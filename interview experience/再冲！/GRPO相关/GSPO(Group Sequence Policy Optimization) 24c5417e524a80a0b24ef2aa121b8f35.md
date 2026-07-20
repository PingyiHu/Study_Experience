# GSPO(Group Sequence Policy Optimization)

Owner: 吉祥 郑

# GRPO存在的问题

## importance sampling存在的问题

### 重要性采样定义

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image.png)

- 由于受到显存大小和计算量的影响，一般的RL训练会将采样（假设采样分布为 $Π_{beh}$）到的一整个batch分为很多的mini batch，在mini batch上进行backward:
    - 第一个mini batch使用得到一个新的分布 $Π_{target}$，一点问题也没有，是on-policy（采样分布和被更新的分布是同一个）
    - 第二个及之后的mini batch，还是用 $Π_{beh}$上采样的样本，但是需要进行重要性采样，变成off-policy
- 通过增加一个权重，利用采样分布中 $Π_{beh}$得到的样本，计算函数 $f$在 目标分布$Π_{tar}$中的期望

### 方差的来源

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%201.png)

### 不应该在token level进行重要性采样的计算

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%202.png)

GRPO的重要性采样权重如上，在每一个token处根据token的概率分布进行重要性采样，是不合理的：

- 在每一个token处存在采样操作，这个重要性采样权重本身就是随机变量，存在偏差和方差，每个token都有一个方差，最终导致整体方差累积。
- 作者认为**既然奖励是sequence level的，GRPO目标函数中其他的值也应该从sequence层面获得**：重要性采样是对sequence level的奖励函数进行reweighting，对应的变量应该是采样到的某个response，而不是response中特定的token
- clipping导致这个问题更加严重：不管是重要性权重超过upper bound或是lower bound，都会导致重要性采样的权重方差进一步增大（本来这里预测的重要性采样分数可能就离真正的重要性采样权重有一定距离了，再截断导致这个距离更加不可知）

# sequence level重要性采样和clipping

**为什么求的是平均呢？**

防止重要性采样参数和回复的长度大小有关

**重要性采样的分数变成sequence在target和behavior分布上出现的概率的比值**，实际计算的时候：

- 计算log ratio，per token计算新的概率值除以旧的概率值
- 把单个回复的所有log ratio加起来求平均
- 把结果进行torch.exp

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%203.png)

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%204.png)

## 为什么会更稳定？

GSPO的重要性采样分数是多个token的概率值相乘，方差也是会累积的，但是：

- GSPO的重要性采样权重的定义符合sequence level奖励的重要性采样权重的定义（变量是一个sequence，从策略分布中采样），无偏，存在方差，不会产生累积：
    - gspo的重要性采样权重，还根据序列长度求了均值，这个操作进一步减小了方差
- GRPO使用token wise的重要性权重近似sequence wise重要性权重，不符合定义。同时，每一个token对应的重要性采样权重偏差和方差较大，并且在采样的过程中，随机变量的方差加和导致方差累积。

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%205.png)

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%206.png)

# TOKEN level的GSPO

如果reward不是sequence level获取的，也可以通过变换，强行使其的目标方程和梯度与sequence level的gspo对齐：

- 但是这样reward中又会引入方差
- 存在sequence和token不对齐的情况

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%207.png)

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%208.png)

# GSPO clip了更多的token却效果更好

GSPO的重要性采样权重是一个均值，但是GRPO中很多权重没被clip到，说明GRPO中的权重离群现象很严重，因此噪声很多

![image.png](GSPO(Group%20Sequence%20Policy%20Optimization)/image%209.png)

# MoE在GSPO上效果更好

## VERL的on policy 和 off policy

- verl中有3种batch size：
    - train batch size，传统意义上的一个batch，也就是一组问题，会先对这一组问题进行回复的采样
    - mini batch size，用于梯度累积
    - micro batch size，实际在机器上进行梯度/前向计算的batchsize
    - 当一个mini batch size的样本梯度累积之后会对模型进行一次梯度更新
- 在一个batch的训练过程中，相当于第一次更新时是on policy，后续是off policy，那么**如果是采用MoE的架构的GRPO，就会使得后续mini batch进行前向的路径和之前的不同，从而导致重要性采样的估计不准确**

## GRPO在MoE效果差

- KL惩罚的计算在MoE上不合理：每次激活的专家不同，本身分布差距就很大，KL代表的意义不明
- 随着模型更新，激活的专家不同，per token的重要性采样存在问题，激活后的per-token分布差别大，方差进一步增大

可以使用**激活路径记录**的方式降低影响，即记录采样分布的激活路径，在进行计算的时候不再根据router进行选择专家。存在问题：

- 额外的计算量和显存占用
- 并不可以充分发挥MoE的作用GSPO

## GSPO可以适用MoE

在极少量的mini batch梯度更新的过程中，per token的分布差别很大，但是per sequence的差别很小，因此sequence level的重要性采样更加准确。

# GSPO可以加速计算

现在的强化学习框架的实现中：

- rollout和actor update使用的库不同，计算精度是存在差距的
- 使用的是per token的重要性采样。

因此rollout得到的log probs不能直接用于update，需要使用actor对应的库重新进行log probs的计算，不然会导致采样分布和更新分布之间的分布差别异常大，从而重要性采样不准。

和GSPO适用MoE的理由相同，sequence level在不同精度下的差异较小，可以不必再用actor对应的库再次计算log probs