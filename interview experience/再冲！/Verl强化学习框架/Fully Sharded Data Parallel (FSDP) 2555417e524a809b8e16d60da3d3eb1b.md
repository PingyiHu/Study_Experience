# Fully Sharded Data Parallel (FSDP)

Owner: 吉祥 郑

## 🔹 Sharding 是什么

- **直观理解**：把一整个大模型的参数（或优化器状态、梯度）**分片存放在不同 GPU 上**，每张卡只保存一部分，避免内存爆炸。
- **区别于普通 DDP**：
    - DDP：每个 GPU 都有一份完整模型（参数完整复制），通信时 all-reduce 梯度。
    - Sharded Training：参数/梯度/优化器状态分开存，每张卡只负责其中的一块，必要时再 gather 或 all-reduce。
- **好处**：显存占用从 O(参数总量)O(\text{参数总量}) 降低到 O(参数总量/N)O(\text{参数总量}/N)，其中 NN 是 GPU 数。

---

## 🔹 FULL_SHARD

在 FSDP 里，`sharding_strategy` 可以设置成不同模式，例如：

- `NO_SHARD`：不分片，每张卡都有完整参数（类似 DDP）。
- `SHARD_GRAD_OP`：只对梯度和优化器状态做分片，参数还是完整的。
- **`FULL_SHARD`**：参数 + 梯度 + 优化器状态都分片。
    - 前向计算前：需要把参数 all-gather 到本地，保证能算；
    - 前向结束后：立刻再把参数 free 掉，只保留分片，节省显存。
    - 反向时：同样按需 all-gather + reduce-scatter。
    - 这是最省显存的一种方式，也是 FSDP 的核心。

---

## 🔹 总结

- **Sharding**：泛指把参数/梯度/优化器状态分片到多卡上存储。
- **FULL_SHARD**：FSDP 的最强分片策略，把三大块（参数、梯度、优化器状态）都分片，是最省显存的模式，但通信开销最大。

# 具体例子

# 1) FULL_SHARD 在“存什么、什么时候通信”

**目标**：把“参数、梯度、优化器状态”都按 rank 分片（每张卡只留 1/n），只在必须计算某一层时，**临时**把那一层的“完整参数”拉到本地，用完就释放。这样显存峰值≈“当前层参数”而不是“全模型参数”。

**时间线（逐层流动）**

假设 world_size = n、当前层参数量 = P、激活 batch = B。

**前向**

1. **（入口通信）All-gather 参数**
    - 每个 rank 只有自己 1/n 的 shard（P/n）。
    - 进入该层计算前，FSDP 从各 rank **all-gather** 得到这一层的**完整参数**（P），通常放在一个临时的“展平 buffer”里并作为 weight 的 view 使用。
    - 常配合 `forward_prefetch=True`：在计算第 k 层时，后台预取第 k+1 层的参数，**重叠**通信和计算。
2. **局部计算**
    - 用完整参数做 `y = f(x; W_full)`。
    - 计算结束后，**立刻丢弃完整参数 buffer**，只保留 shard（P/n）。
    - 如果启用激活检查点（checkpointing），还能进一步降激活显存。

**反向**

3. **（再入口通信）All-gather 参数（for backward）**

- 由于前向后已经 free 了完整权重，反传到该层时，需要“**就地**”再 all-gather 一次完整参数，保证梯度公式可用（尤其带权重衰减/正则或需要权重值的反传路径）。
1. **计算本层局部梯度**
    - 产生 `∂L/∂W_full` 和对输入的梯度等临时量。
2. **（出口通信）Reduce-scatter 梯度**
    - 把完整梯度做 **reduce-scatter**（例如 SUM），每个 rank 只保留自己 shard 的梯度 `∂L/∂W_shard`（大小 P/n）。
    - 随后释放完整梯度的临时 buffer。

> 小结：入口 all-gather → 局部算 → 出口 reduce-scatter，中间只保留 shard，显存随层走，峰值≈单层参数而非全模型。
> 

# 2) 为什么叫“参数 + 梯度 + 优化器状态都分片”

- **参数（Param）**：常驻只存 1/n（shard）。计算时临时拉齐该层的完整参数，用完即弃。
- **梯度（Grad）**：反向结束后，立即 reduce-scatter 成 1/n（而不是 all-reduce 出完整梯度）。
- **优化器状态（Opt State）**：如 Adam 的 `m/v` 也只在各自 shard 上维护，并且只更新本 shard 的参数；checkpoint 时也以“分片 state_dict”持久化（或在需要时用工具聚合为全量）。

> 对比：SHARD_GRAD_OP 只分片“梯度+优化器状态”，参数仍常驻全量；FULL_SHARD 连“参数常驻”也变成了分片。
> 

# 3) 性能/显存与关键开关

- **显存**：理论上把“常驻显存”降到原来的 **1/n**（再叠加短暂的“当前层完整参数”峰值）。配合激活检查点、混精（`MixedPrecision`）、CPU/NVMe offload，能把大模型塞进更小 GPU。
- **通信**：比 DDP 多（每层两次通信：前向的 all-gather、反向的 reduce-scatter）。
- **重叠**：用 `forward_prefetch=True`、`backward_prefetch=BACKWARD_PRE` 把下一层的 all-gather 与当前层计算重叠，降低墙钟时间。
- **参数展平/分桶**：FSDP 会把一层/一组参数“扁平化”为通信桶，减少小张量开销。
- **混精与 dtype**：`MixedPrecision(param_dtype=bfloat16/float16, reduce_dtype=..., buffer_dtype=...)`，既省显存也降带宽。
- **CPU Offload**：`CPUOffload(offload_params=True)` 可把 shard 常驻到 CPU，需要时搬到 GPU；进一步省显存、增加 PCIe 代价。

# 4) 代码骨架（PyTorch 2.x）

```python
import torch, torch.distributed as dist
from torch.distributed.fsdp import (
    FullyShardedDataParallel as FSDP,
    ShardingStrategy, BackwardPrefetch,
    CPUOffload, MixedPrecision, StateDictType
)
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy

def build_fsdp_model(model):
    mp = MixedPrecision(  # 典型混精
        param_dtype=torch.bfloat16,   # 参数/通信用 bf16
        reduce_dtype=torch.bfloat16,
        buffer_dtype=torch.bfloat16,
    )
    fsdp_model = FSDP(
        model,
        sharding_strategy=ShardingStrategy.FULL_SHARD,
        auto_wrap_policy=transformer_auto_wrap_policy,  # 只包住大层/Block
        mixed_precision=mp,
        forward_prefetch=True,
        backward_prefetch=BackwardPrefetch.BACKWARD_PRE,
        # cpu_offload=CPUOffload(offload_params=False),
        use_orig_params=True,  # 推荐，便于优化器/状态字典
        device_id=torch.cuda.current_device(),
    )
    return fsdp_model

# 初始化后：
# fsdp_model = build_fsdp_model(model)
# optimizer = torch.optim.AdamW(fsdp_model.parameters(), lr=...)
# 正常训练即可：FSDP 负责 all-gather / reduce-scatter / 分片优化器状态

```

# 5) Checkpoint / 推理注意点

- **保存**：用 FSDP 的 `state_dict_type` 选择：
    - `SHARDED_STATE_DICT`（推荐，大小≈1/n，分布式安全），或
    - `FULL_STATE_DICT`（需要 `summon_full_params` 聚合，显存/内存更高）。
- **加载**：同理，分片加载更轻；跨集群/卡数变动时可用 sharded 格式做再平衡。
- **评测/推理**：若需要完整权重，可在 `with FSDP.summon_full_params(fsdp_model):` 下临时还原成全量做一次性推理或导出。

# 6) 与 ZeRO-3、TP 的关系

- **ZeRO-3** 与 **FSDP(FULL_SHARD)** 思想一致（param/grad/opt all shard），但实现/生态不同；FSDP 是 PyTorch 原生、以层为粒度做“就地 all-gather/free”。
- **与张量并行（TP）** 可叠加：TP 降低**中间激活**（每卡 1/n 宽度），FSDP 降低**参数/梯度/优化器状态**；大模型常用 **TP × PP × FSDP** 的混合并行。