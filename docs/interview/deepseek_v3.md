# DEEPSEEK V3

Owner: 吉祥 郑

[(12 封私信) 【LLM技术报告】DeepSeek-V3技术报告（全文） - 知乎](https://zhuanlan.zhihu.com/p/14890557782)

[(12 封私信) Deepseek v3 技术报告万字硬核解读 - 知乎](https://zhuanlan.zhihu.com/p/16323685381)

# MLA（多头隐注意力机制）

[多头隐注意力机制](attention%E7%9B%B8%E5%85%B3/%E5%A4%9A%E5%A4%B4%E9%9A%90%E6%B3%A8%E6%84%8F%E5%8A%9B%E6%9C%BA%E5%88%B6%202465417e524a800c9c27fbb113e6d0e4.md)

# shared MoE

[MoE环游记：5、均匀分布的反思 - 科学空间|Scientific Spaces](https://kexue.fm/archives/10945)

MoE想用一个小模型的计算量近似一个大模型完整dense层的能力

## 细粒度专家

把FFN切分的更细，取top8或者top16进行激活

## 降低专家冗余

专家分为两类：

- 共享专家，一直被激活的专家，降低其他路由专家的冗余程度
- 路由专家，根据路由打分而选择的专家

# loss free负载均衡

[MoE](MoE%202865417e524a80bfb891e3caa29f4641.md)

# **Multi-Token Prediction**

[**Multi-Token Prediction**](DEEPSEEK%20V3/Multi-Token%20Prediction%2027c5417e524a8036b490fb5a6b3f5dff.md)