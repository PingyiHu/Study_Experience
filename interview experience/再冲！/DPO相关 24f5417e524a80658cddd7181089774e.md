# DPO相关

Owner: 吉祥 郑

[(2 封私信) Direct Preference Optimization（DPO）学习笔记 - 知乎](https://zhuanlan.zhihu.com/p/676371444)

[(2 封私信) 一文读懂 DPO（Direct Preference Optimization）：原理、流程与九种 Loss 解析（附 TRL 实现代码） - 知乎](https://zhuanlan.zhihu.com/p/1923311375431754217)

# Bradley-Terry模型

- 常用于比较两个选手哪个更加优秀
- 每一个选手都有一个内在的分数，分数越高越有可能在对比中胜利
- 和softmax类似的方式，可以把分数归一化为一个概率，认为这个概率是某个选手战胜另一个选手的概率，在reward model的训练中，通常是逐渐将我们期望的那个回答的reward（内在分数）不断提高

![image.png](DPO%E7%9B%B8%E5%85%B3/image.png)

![image.png](DPO%E7%9B%B8%E5%85%B3/image%201.png)

# 最大似然估计

## 原来的理解

- 存在一个分布f(θ)
- 从f采样到一组数据D
- 求什么样的θ可以让这组数据D出现的概率最大

## reward model中的理解

- reward model就是去估计一个回复的内在分数
- 当前我有一组胜负已定的样本，即人工选出的win和lose
- 需要使得模型的打分，能够让该组样本，产生人类期望胜负的概率最大（极大似然估计）

# 从RL的目标函数得到DPO的优化目标

强化学习的目标刚好就是：

- 使得所有策略采样出来的路径得到的奖励值的期望最大
- 加上KL散度，防止模型过拟合到reward model上，丧失正常对话能力

## 从强化学习的原始目标中凑出新分布

- 强化学习的原始目标：
    - 在reward model上，任何的x都可以获得一个比较高的打分
    - 通过KL散度，限制当前模型和ref模型之间的分布差别，防止模型遗忘原始的能力
- 新的分布Z(x)的构成，给定x的情况下：
    - **y在reference model的条件概率分布**
    - **y在reward model上的得分**

![image.png](DPO%E7%9B%B8%E5%85%B3/image%202.png)

![image.png](DPO%E7%9B%B8%E5%85%B3/image%203.png)

## 将新分布代入：从一个KL散度变为另一个KL散度

**刚好从ref model和actor model的KL散度变到actor model和最优策略之间KL散度**

**Z(x)只和x、reference model采样得到的y、reward model的打分有关**，不管怎么优化当前策略，都不会对Z(x)有影响。

那么这样一来，想最小化下面这个期望，只需要KL散度为0即可，也就是说，最优的策略就是刚刚凑出的这个分布对应的策略，**但是这个策略是求不出来的，没办法针对x，采样出所有的y**

![image.png](DPO%E7%9B%B8%E5%85%B3/image%204.png)

## 最优策略变形，还原为reward model

reward model和最优策略(Πr)可以相互表示，因此就要想到求最优策略其实就是求reward model，所以将其代入到BT偏好概率中。

![image.png](DPO%E7%9B%B8%E5%85%B3/image%205.png)

![image.png](DPO%E7%9B%B8%E5%85%B3/image%206.png)

σ是sigmoid函数。

此时对模型进行强化学习等同于使用训练reward model的方式训练模型，此时reward使用actor model定义。

![image.png](%E9%9D%A2%E7%BB%8F%E6%80%BB%E7%BB%93/image%206.png)

简而言之，让模型在当前策略模型上的win/lose的概率差值，比参考模型上的win/lose的概率差值更大

# DPO的影响因素

- beta越大，KL约束越强，和reference model分布越接近
- beta越小，越有可能符合reward model的数据分布