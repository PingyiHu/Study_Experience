# Multi-Token Prediction

Owner: 吉祥 郑

[(12 封私信) deepseek技术解读(2)-MTP（Multi-Token Prediction）的前世今生 - 知乎](https://zhuanlan.zhihu.com/p/18056041194)

# LLM SFT

![image.png](Multi-Token%20Prediction/image.png)

- ✅ **拼接**：先把 prompt 和 target 拼接。
- ✅ **自回归条件**：每个 target token 的条件都是“prompt + 之前的 target”。
- ⚠️ **“单步”**：训练不是逐步 rollout 再回传；而是一次前向里**并行**对 target 的每个位置做下一词预测（计算时等价于多步，但实现是矢量化的）。
- ✅ **交叉熵**：用 CE/NLL，对应上式。

# 最初始的多token预测（Blockwise Parallel Decoding）

这个方法只进行推理加速

## 构成

- 主干网络的logits在最后输出词表概率的时候，输入到多个head中
- 初始化多个head，每个head负责一个token的生成
    - 每个head的升维FFN矩阵参数共享
    - 降维矩阵分别训练
    - 共享词嵌入矩阵

![v2-aa5641777b5a18a2131e37d07e45f320_1440w.jpg](Multi-Token%20Prediction/v2-aa5641777b5a18a2131e37d07e45f320_1440w.jpg)

## 推理

- predict阶段，一次性生成k个token。这k个token由于不是自回归生成的，和原始的decoder only模型的马尔可夫链模型相差很大，需要验证
- verify阶段：
    - 原始的llm head（即head1），是有自回归的功能的
    - 把predict得到的多个token，按照自回归的格式与prompt拼接为一个batch
    - 把一整个batch进行单步的生成，检测这样进行自回归得到的结果是否和predict阶段的一致
- accept阶段，选择**从头开始的、可以被接受的、最长的、连续的token**作为一次rollout的结果

![image.png](Multi-Token%20Prediction/image%201.png)

# **Meta's MTP**

这个方法借鉴了之前一节介绍的方法，但是进行了训练：

- 之前的推理加速是2层FFN， 当前方法是一个Transformer
- 当前方法可以进行类似之前介绍的并行推理，本文也重点考虑模型加速训练的优化，在模型训练时，多个头都会并行计算loss，提升样本利用效率和加速模型收敛

![image.png](Multi-Token%20Prediction/image%202.png)

# Deepseek MTP

![v2-45e640b4d0c6dec6f58456e815eaf907_1440w.jpg](Multi-Token%20Prediction/v2-45e640b4d0c6dec6f58456e815eaf907_1440w.jpg)

## 训练

### 原理

目的是：当前有第i个token，想预测第i+k+1个token（原始的transformer是预测第i+1个token）

那就需要：

- 0到i的上下文（初始的transformer的hidden state）
- i到i+k的上下文
    - i到i+k-1是之前的MTP module给出的
    - 第i+k就是当前MTP module的输入，经过embedding
    - 将上面两种信息通过FFN融合

举例来说，t1想要预测t3怎么办？

1. t1拥有自身作为上下文，它可以预测出t2
2. 需要把t2拼接上t1作为t3预测的上下文
3. 套娃上面的步骤可以继续由t1、t2预测t4（这时就需要之前得到的t3作为桥梁）

### 格式化的定义

![v2-8c84c2707701c25dd9987f1996418c3c_1440w.jpg](Multi-Token%20Prediction/v2-8c84c2707701c25dd9987f1996418c3c_1440w.jpg)

对于第i个token和第k个预测深度：

- 第i个token（应该是第i个token和之前的k-1的预测的上下文）经过当前第k-1个MTP block之后，有隐藏状态 $h_{i}^{k-1}$
    - 这个隐藏状态是包含了 0 到 i+k-1 的所有信息的，因为经过了transformer block，做了mask attention
- 第i+k个token过embedding之后，得到新的有关i+k的信息 $embed(t_{i+k})$
- concat两部分信息，过一个线性层，得到 1 到 i+k信息的隐藏表征
    
    ![image.png](Multi-Token%20Prediction/image%203.png)
    
- 对hi间进行attention计算，获取高阶信息
    - 训练序列的长度上限是T
    - 采用teacher forcing的方式，我们不可能生成比样例长度上限T还要大的序列，因此这里hi的下标只能是(1, T-K)
    
    ![image.png](Multi-Token%20Prediction/image%204.png)
    

### 优势

只通过一次LLM主干网络，可以预测多个token并进行更新

- 梯度更密集
- 算力消耗低
- 可以学习更远距离的依赖
- 每一个MTP block都有ground truth token作为输入，采样teacher forcing的方式，保留了马尔科夫链的信息

## 推理

这个MTP主要是为了训练加速，而并不是为了推理加速，这个推理方式有2种：

- 去掉所有MTP module
- 和之前一样做投机解码