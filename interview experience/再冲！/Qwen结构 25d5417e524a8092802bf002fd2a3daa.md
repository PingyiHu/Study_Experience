# Qwen结构

Owner: 吉祥 郑

[(4 封私信) Qwen 历代版本发展史 - 知乎](https://zhuanlan.zhihu.com/p/1902064402053695444)

![image.png](Qwen%E7%BB%93%E6%9E%84/image.png)

# Qwen1.0

## untied embedding

tied embedding：指的是模型的词嵌入矩阵W1和最后由隐藏状态变回词表分布的矩阵W2是共享参数的

untied：不共享输入矩阵和输出矩阵的参数

## 使用RoPE(都这么干)

NTK-awared RoPE，对于高频进行外推，对低频进行内插

[位置编码RoPE和YARN](attention%E7%9B%B8%E5%85%B3/%E4%BD%8D%E7%BD%AE%E7%BC%96%E7%A0%81RoPE%E5%92%8CYARN%202465417e524a806b99b9c6acd08cf0ae.md)

## 使用RMS norm（都这么干）

[layer norm和RMS norm](layer%20norm%E5%92%8CRMS%20norm%202585417e524a80fab714c9ef1815f43e.md)

## 使用swiglu（都这么干）

[SwiGLU](SwiGLU%202585417e524a80f89693fba200e8b702.md)

## **LogN-Scaling**

当序列长度很长的时候，就会导致，在计算QK后进行softmax时，底数变得很大，这样计算得到的输出分布就很平，模型采样的时候会丢失重点，认为每一个token都差不多

LogN scaling相当于是一个温度参数，这个温度参数随着长度的变长而降低，从而使得attention score的分布更加重点突出

## 分层Window attention

在不同的层使用不同的长度的attention window，不进行全部token的attention

# Qwen2.0

## 使用GQA

[MQA和GQA](attention%E7%9B%B8%E5%85%B3/MQA%E5%92%8CGQA%202465417e524a806293a6f93849e9cf36.md)

## **Dual Chunk Attention（DCA)**

注意力的计算使用的是GQA，但是稀疏注意力机制是DCA，

- 块内注意力
- 当前块和之前块之间还有一个注意力

## 使用Yarn

## 使用MoE模型

# Qwen2.5

扩展了数据量：人工标注和拒绝采样

上下文窗口扩展：进行更长上下文的预训练

# Qwen3.0

引入了推理模型，应该是类似于R1的方式进行训练