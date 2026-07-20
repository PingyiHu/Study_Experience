# Theseyouwant

Owner: 吉祥 郑

[**MRZN-LLM面试准备总结笔记**](Theseyouwant/MRZN-LLM%E9%9D%A2%E8%AF%95%E5%87%86%E5%A4%87%E6%80%BB%E7%BB%93%E7%AC%94%E8%AE%B0%202405417e524a8157a6cec2e09cecf8fd.md)

# 常见问题：

https://mp.weixin.qq.com/s/zf0JASGQnuXFQwsZqMm0tA

https://mp.weixin.qq.com/s/Kl5l9_NIQtwUgLwiYohE6A

https://mp.weixin.qq.com/s/MB-JntfIjbZ6yYvIJgxweA

https://mp.weixin.qq.com/s/kLI5DPaRW5zDDPmfAG7wrw

https://mp.weixin.qq.com/s/fN5idjo5LHmTE1D8ifz0hA

https://mp.weixin.qq.com/s/1LuOZnOke4KZfIPHI1-Kcw

vllm：https://mp.weixin.qq.com/s/-5EniAmFf1v9RdxI5-CwiQ

# **垂直大模型基本套路**

https://zhuanlan.zhihu.com/p/652645925

![image.png](Theseyouwant/image.png)

需要注意的是一般垂直领域大模型**不会直接让模型生成答案**，而是跟先检索相关的知识，然后基于召回的知识进行回答，也就是基于检索增强的生成([Retrieval Augmented Generation](https://link.zhihu.com/?target=https%3A//www.promptingguide.ai/techniques/rag) , RAG)。这种方式能**减少模型的幻觉**，**保证答案的时效性**，还能**快速干预**模型对特定问题的答案。

[垂直领域大模型的思考 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/652645925)

[Continue Pretrain](Theseyouwant/Continue%20Pretrain%202405417e524a811ca512d21a5800bb5a.md)