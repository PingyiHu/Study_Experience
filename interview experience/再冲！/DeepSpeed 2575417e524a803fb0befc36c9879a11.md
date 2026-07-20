# DeepSpeed

Owner: 吉祥 郑

[Deepspeed分布式训练](DeepSpeed/Deepspeed%E5%88%86%E5%B8%83%E5%BC%8F%E8%AE%AD%E7%BB%83%202405417e524a811a9989c8a3e3147b38.md)

[(2 封私信) DeepSpeed之ZeRO系列：将显存优化进行到底 - 知乎](https://zhuanlan.zhihu.com/p/513571706)

# 并行方式

## 数据并行 DP

- 每个卡上都放一个完整的模型
- 把数据等分后作为每张卡的输入
- 在进行梯度计算的时候，将每个卡上计算得到的梯度相加进行平均

## 张量并行 TP

**按照输出维度切分，W的indim不变：**

- 把模型每一层的tensor进行列方向上的切分，放到每一张卡上
- 每个卡的输入都是一个完整的batch
- 进行前向的过程：
    - 层的入口处的输入一致
    - 层的出口处，需要gather所有卡上的输出，**进行cat**，作为下一个层的输入

**按照输入维度切分，W的indim进行切分，outdim不变：**

- 模型每一层的tensor进行行方向的切分，防在每一个卡上
- 每个卡的输入都是一个batch，但是batch中的每个元素要根据W的indim进行切分
- 进行前向的过程：
    - 层的入口处的输入不相同，按照列进行了切分
    - 层的出口处，需要gather所有卡上的输出，**进行sum，**作为下一个层的输入

## 流水线并行 PP

- 每一张卡放模型的不同层，层不进行切分
- 输入到首层存在的那个卡，获取输出后给下一层存在的卡作为输入

# 训练过程中模型参数的构成

[(2 封私信) 全网最全-混合精度训练原理 - 知乎](https://zhuanlan.zhihu.com/p/441591808)

![image.png](DeepSpeed/image.png)

![image.png](DeepSpeed/image%201.png)

## **混合精度训练的过程中有fp16和fp32的模型参数（低精度备份）**

其中fp16是由fp32的参数进行截断获得的

- 低精度参数：前向反向使用低精度fp16，算出的梯度是fp16的
- 高精度参数：把fp16上面算出的梯度，反向转回的fp32的精度进行adam状态的更新

## 混合精度的loss scaling

因为梯度通常比较小，fp16的情况下可能会有精度的损失，可以先把loss乘以一个较大的系数，相当于放大梯度。

fp16的梯度转回fp32的时候再除以这个系数，就可以得到一个比较高精度的梯度。

# ZeRO系列

- ZeRO-1，参数和梯度不分片，把adam状态分片了
    
    ![image.png](DeepSpeed/image%202.png)
    
- ZeRO-2，把梯度进一步分片
    
    ![image.png](DeepSpeed/image%203.png)
    
- ZeRO-3，把参数也分片了
    
    ![image.png](DeepSpeed/image%204.png)
    
- 对于激活值等其他的信息也按照相同的方式

## 梯度怎么更新？

## 两种不同的梯度

![image.png](DeepSpeed/image%205.png)

### ZeRO1

- 每个设备有全部梯度：
    - 在进行状态值更新之前，会对所有的梯度进行all reduce，这样所有的卡上的梯度都是一样的了
- 每个设备只需要用这些梯度对于自己负责的adam分片状态进行更新即可
- 更新完成之后，每个设备把自己adam分片中的模型参数boardcast到所有的设备

### ZeRO2

DP的情况下：

- 分桶操作bucket
    - 将模型的全体参数划分为一个个桶，即连续缓冲区
    - 当所有rank（进程）的全量参数（在计算的时候，记录计算得到完整的梯度信息）填满一个桶的时候，进行一次通信
    - 减少通信次数，尽量吃满通信带宽

**反向传播：**

- 每个rank的bucket内记录的是当前这个rank，本地的梯度贡献
- 当一个bucket的梯度被填满后，对bucket内的所有梯度值进行reduce scatter，每个设备获得自己负责分片梯度均值(分片的规约值）

**更新状态：**

- 由于状态也被分片，每个rank负责分片的梯度值还需要去更新其负责的状态分片

**更新模型参数**

- adam状态中存在fp32参数，fp32的模型参数需要被reload到每一张卡上
- 在下一次前向之前，需要进行all gather，以更新每一个rank的fp16模型参数

### ZeRO3

DP的情况下

**前向：**

- **Unshard：all-gather 参数，**进入某个 module时，触发 **all-gather** 把该模块的全部参数片从各个 rank 拉齐到本机，临时形成**完整权重**用于计算。
- 用刚刚聚齐的完整权重在本 rank 上对本地 mini-batch 做前向。
- Reshard / 释放，前向一结束，**立即丢弃/释放非本片的权重**，只保留自己负责的那一片（以节省显存）。
    - 算出当前层激活值，权重就没用了，就可以丢掉了。

**反向：**

- 进入某个module的时候，还是all gather模型参数
- 如果有activation checkpoint，还要all gather进行前向
- 计算完整不分片的梯度，把参数梯度放到bucket中
- 计算结束或是bucket满了，就进行reduce scatter，每个设备获得完整规约值，保留自己的分片
- 更新adam状态
- all gather fp32参数到fp16参数

# 模型中的通讯方式

- reduce
    
    ![v2-51ff40433d988c7696624e44b3a8f75f_1440w.png](DeepSpeed/v2-51ff40433d988c7696624e44b3a8f75f_1440w.png)
    
- broadcast
    
    ![v2-e231dae32e242c83684fdeda0d235dc9_1440w.png](DeepSpeed/v2-e231dae32e242c83684fdeda0d235dc9_1440w.png)
    
- all reduce
    
    ![v2-5a624583d1381b0e66a18a6f0d0ed9b4_1440w.png](DeepSpeed/v2-5a624583d1381b0e66a18a6f0d0ed9b4_1440w.png)
    
- all gather
    
    ![v2-6cbc23fd16b666f2ae3c9bc295722b52_1440w.png](DeepSpeed/v2-6cbc23fd16b666f2ae3c9bc295722b52_1440w.png)
    
- reduce scatter
    
    ![image.png](DeepSpeed/image%206.png)
    

## ring reduce scatter

- 每一个设备，把自己负责的某块分片传给其左边的设备（设备号是1，2，3，4。1左边的设备是4），设备1把当前自己负责的分片2送给设备4。
- 设备4把1的分片和自己的这一份相加
- 这样当数据绕了一圈之后，每一个设备上都有一片数据是完全算完的，相当于reduce算完平均再scatter到每一个设备

![image.png](DeepSpeed/image%207.png)

# FSDP

其实FSDP和ZeRO3的做法是差不多的：

- 仍然属于数据并行。tp，数据已经不并行了，比如竖着切矩阵，每个卡的输入都要一样；横着切的话同一个输入也要切了。
- 在用到参数的时候进行all gather
- 参数用完了以后释放掉，只留下自己负责的分片
- 反向的时候参数梯度入桶，然后进行reduce scatter

## 初始化

把某个layer的weight直接展平为一个一维矩阵，然后平均分给多个设备，不够分就补padding

### **参数放进1D tensor并且保证每一份相等是因为：**

- [all_gather_into_tensor](https://link.zhihu.com/?target=https%3A//github.com/pytorch/pytorch/blob/bc843682dd2cc739ee5f6ed9502a598e8aa88a8f/torch/distributed/distributed_c10d.py%23L2435) 和[reduce_scatter_tensor](https://link.zhihu.com/?target=https%3A//github.com/pytorch/pytorch/blob/bc843682dd2cc739ee5f6ed9502a598e8aa88a8f/torch/distributed/distributed_c10d.py%23L2910) 是比[all_gather](https://link.zhihu.com/?target=https%3A//github.com/pytorch/pytorch/blob/bc843682dd2cc739ee5f6ed9502a598e8aa88a8f/torch/distributed/distributed_c10d.py%23L2361) 和[reduce_scatter](https://link.zhihu.com/?target=https%3A//github.com/pytorch/pytorch/blob/bc843682dd2cc739ee5f6ed9502a598e8aa88a8f/torch/distributed/distributed_c10d.py%23L2868) 的性能更好，而这两个op要求保证输入tensor size是均等的
- FSDP模块内的参数被打包在一起，不需要一个参数进行一次all gather

![image.png](DeepSpeed/image%208.png)

### **什么是Wrap？**

wrap就是对于某个layer创建一个FSDP实例。

- 红色的是被显式创建FSDP实例的layer
- 黄色的是没有被wrap的layer

其中如果创建了fsdp实例，红色节点和其后不被其他红色节点阻隔的子节点，共享一个1D tensor

![image.png](DeepSpeed/image%209.png)

### 变成1D之后怎么能读到原始的层结构呢？

因为把参数分片都放到1D tensor里面了，原始层与层之间的结构就被破坏了，也就是没法用named parameter()得到原始的层名。

- **保存参数的原始形状：**构建一个中间层，FlatParamHandle，管理1D tensor和原来的参数矩阵之间的映射关系
    - 通常不止一个1D tensor，会按照精度，分成多个1D tensor
    
    ![image.png](DeepSpeed/image%2010.png)
    
- **保存模型的树状结构：**
    - 把某个module抽象为一个FSDP unit，下面有很多个hook
    - 会递归为每一个子module生成hook，如果子module有FSDP unit那就不会为其生成hook
    - 进入子module的时候hook激活，从1D tensor得到当前module的视图，然后进行前/后向计算

![image.png](DeepSpeed/image%2011.png)

## 运行

- pre forward hook：
    - all gather在每个rank上重建1D tensor
    - 通过handle，从1D tensor重建当前进行计算的层，其完整的参数视图
    - 注册一个post backward hook，因为当前计算的这个位置就是反向的时候进行规约的位置（reduce-scatter）
- post forward hook：
    - reshard，把重复的参数删除掉，只保留自己的一份
    - 注册pre backward hook，理由同上，时机相同
- pre backward：获取所有的参数
- post backward：进行ring scatter

### 运行时会有sharding大小和吞吐量的平衡：

- 显存的峰值占用就是这个块，加上其他部分的分片
- 如果分片小，不容易爆显存，但是带宽占不满

![image.png](DeepSpeed/image%2012.png)

## 计算和数据预取

在进行计算的时候，可以提前取之后一个module的参数，这样带宽可以占满，同时计算kernel也可以占满