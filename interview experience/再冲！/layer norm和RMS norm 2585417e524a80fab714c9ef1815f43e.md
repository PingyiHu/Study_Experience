# layer norm和RMS norm

Owner: 吉祥 郑

# 为什么需要Normalization：上一层参数优化好了，下一层的输入变化了

因为模型每一层的输入的分布都可能发生变化，会使得在训练中模型需要改变参数以适应不同的输入分布，训练不稳定：

最普遍的例子就是上一层的参数发生变化，导致下一层的输入发生变化：

![image.png](layer%20norm%E5%92%8CRMS%20norm/image.png)

## normalization是需要学习的

layer norm主要放在transformer block中的进入子层之前，如果normalization，只是把输入规约为均值0方差1的分布，之前层学到的特殊的映射就会被破坏：

- 当前层的输入本身和标准正态的差别可能就很大，强行变为正态会损失掉之前层学到的内容
- 激活函数或是一些子层的输入本身依赖于某些特殊分布

需要增加一个线性映射，恢复模型数据的表达能力：

- 先进行0,1归一化
- 对于归一化的结果N(Y)，进行线性变换，γ * N(Y) + β

![image.png](layer%20norm%E5%92%8CRMS%20norm/image%201.png)

## 训练的时候有batch，预测的时候没有怎么办

在训练的时候是有完整的batch，可以计算得到均值方差；测试的时候只有一条数据：

- 记录训练时候每一组输入在每一层上所有位置的均值方差，在训练结束之后，对所有位置的均值和方差进行汇总：
    - 消耗的显存大，每个参数都要保存均值方差
    - 在训练的过程中没法进行test set的验证
- 在预测的时候使用momentum，进行指数加权：
    
    ![image.png](layer%20norm%E5%92%8CRMS%20norm/image%202.png)
    

# batch norm

对特征进行归一化，LLM的特征是embedding那一维

**隐藏维的每一维都是一个通道**，对所有batch的所有token的同一个通道上的内容进行normalization

![image.png](layer%20norm%E5%92%8CRMS%20norm/image%203.png)

![image.png](layer%20norm%E5%92%8CRMS%20norm/image%204.png)

![image.png](layer%20norm%E5%92%8CRMS%20norm/image%205.png)

# layer norm

## 为什么transformers要用layer norm：

- **如果batch中seqlen不一样，要考虑padding，使得数值不稳定**
- 如果测试的时候，测试集里面有更长的数据，那么那些长于训练集中的位置，其均值和方差是未知的
- layer norm在测试的时候，无需batch，只要per sample就行

## 做法

- 按照seqlen的方向（第一维），对同一个batch内的信息进行归一化
- NLP中就是将一个batch中，**同一个token的所有维度进行归一化**
    - 同一层中layer norm的线性变换参数是一样的
    - NLP中的特征是最后一维，形状就是hidden_size
    
    ![image.png](layer%20norm%E5%92%8CRMS%20norm/image%206.png)
    
- CV中，特征指的是某个chanel上的特征图形状是H * W
    
    ![image.png](layer%20norm%E5%92%8CRMS%20norm/image%207.png)
    

## 代码实现

```python
import torch
import torch.nn as nn

class SimpleLayerNorm(nn.Module):
    """
    等价于 nn.LayerNorm(normalized_shape=hidden_size, elementwise_affine=True)
    只是假设输入最后一维是 hidden_size，并手写了公式以便看清每步。
    """
    def __init__(self, hidden_size: int, eps: float = 1e-5):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(hidden_size))  # γ，按隐藏维逐元素缩放
        self.bias = nn.Parameter(torch.zeros(hidden_size)) if bias else None  # β

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x 形状通常是 [batch, seq, hidden_size]（也可以是 [seq, batch, hidden]）
        # 归一化均沿最后一维进行
        x_fp32 = x.float()  # 数值稳定：按 FP32 统计
        mean = x_fp32.mean(dim=-1, keepdim=True)
        var  = x_fp32.var(dim=-1, unbiased=False, keepdim=True)
        x_hat = (x_fp32 - mean) / **torch.sqrt(var + self.eps)**  # 标准化

        y = x_hat * self.weight  # 广播到最后一维
        y = y + self.bias
        return y.to(dtype=x.dtype)  # 保持输入 dtype（支持 AMP）

```

# RMS norm

为什么用RMS norm：

- 减均值：去中心化不一定有利于模型训练，有可能打乱特征向量的方向
- RMS只是把向量的长度进行缩放，更好的保留了方向信息
- RMS计算快，参数少，成本低

不去计算某一层输入的均值方差，而是直接计算这一层的均方根，然后输入除以均方根

![image.png](layer%20norm%E5%92%8CRMS%20norm/image%208.png)

```python
class RMSNorm(torch.nn.Module):

    def __init__(
        self,
        dim: int,
        eps: float = 1e-6,
    ):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
		    x_fp32 = x.float()
        x_hat = x_fp32 * torch.rsqrt(x.pow(2).mean(dim=-1, keepdim=True) + self.eps)
	      y = x_hat * self.weight
        return y.to(dtype=x.dtype)
```