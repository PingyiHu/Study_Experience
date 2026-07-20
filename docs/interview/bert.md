# BERT

Owner: 吉祥 郑

- BERT是同时看上下文，对于文本整体进行一个理解
- 获得文本embedding之后，可以在BERT之后再加一个头从而适应多种任务场景
- 可以用BERT去标记文本数据
- BERT不是自回归，出现的每个词输入后，得到的就是当前位置的一个hidden state，不会用这个hs去预测next token，所以叫BERT是编码器（特别的，是双向编码器）

# embedding的构成

![image.png](BERT/image.png)

- segment embedding，用于分段文本
- position embedding，用于标记位置

## segment embedding

用于处理句子对任务：比如分辨两个句子是不是同样的意思

## position embedding

同一个词在不同的位置，表达的意思不同

# CLS和SEP

- CLS用于表示整句话的含义
- SEP用于分割两句话

# 训练流程

![image.png](BERT/image%201.png)

## pretrain

### MLM（mask language model）

遮盖住某些词语，让模型去猜测被mask的词语。一般来说15%的word piece（被tokenize过后的文本）会被替换

有15%的词语有可能被mask，mask需要保证模型**不overfit到某个特定的pattern**，不能遇见某个特定的空，就填一样的单词，对于一个被mask掉的位置，需要保证模型认为**输入是一个分布，而不是一个特定的词：**

- 80%概率替换为mask
- 10%替换为任意单词，即使替换为了任意的单词，对mask处的内容依旧可以判断正确，因此具有**对抗错词的鲁棒性**
- 10%保持句子不变：因为在后续finetune的过程中是看不到mask的，为了**使得预训练和finetune的任务相匹配**

### NSP（next sentence prediction）

在CLS上接一个二分类器，判断当前被sep分割的文本A SEP B，B是不是A的下一句话

这不是一个必须的任务：

- 去掉之后结果不降低，甚至变好
- 存在捷径：模型很快学会用**主题/词汇分布**来区分是否同一文档，而不是学到真正的**句间连贯性**
- transformers的自注意力机制，本身就是可以捕捉到上下文的关系

## finetune

- 文本分类
- 问答任务：答案在原文里，给出问题和上下文（sep分割），cls接上一个头，输出是上下文文本中的两个位置

# BERT长文本

## BERT为什么不可以直接外推到更长的文本

- 位置编码存在上限：BERT没有更长的位置编码，直接外推是有问题的
- 分布偏移：attention的QKV矩阵没有在更长的文本长度上训练过

## 如何外推BERT

- 文本切块，进行多维度的注意力机制：
    - 块间注意力机制
    - 块内注意力机制
- 稀疏注意力机制，CLS做全部的注意力，其他的token改用窗口注意力机制
- 改用RoPE或是Yarn，低频直接外推，高频内插
- 在更大的语料库上进行再训练