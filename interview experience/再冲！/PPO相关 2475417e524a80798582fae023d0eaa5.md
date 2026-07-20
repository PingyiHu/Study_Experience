# PPO相关

Owner: 吉祥 郑

[图解大模型RLHF系列之：人人都能看懂的PPO原理与源码解读 - 知乎](https://zhuanlan.zhihu.com/p/677607581)

[人人都能看懂的RL-PPO理论知识 - 知乎](https://zhuanlan.zhihu.com/p/7461863937)

[Proximal Policy Optimization (PPO) 算法理解：从策略梯度开始 - 知乎](https://zhuanlan.zhihu.com/p/614115887)

![image.png](%E9%9D%A2%E7%BB%8F%E6%80%BB%E7%BB%93/image%204.png)

# 基于值的强化学习

根据策略的价值决定具体的动作，一定要模拟出V或是Q网络，使用V或者是Q**间接评估策略好坏或是决定下一步怎么做**

例如DQN，q learning，sarsa这类都是根据采取动作的价值去进一步决定策略：

- 无法用于无限动作的情况
- 当学习结束后，就会生成固定性的策略

# 基于策略的强化学习

- 直接对策略进行建模，输入为环境信息，直接输出策略
- 策略的优化，通过采样的方式评估策略的优劣，进行更新

![image.png](PPO%E7%9B%B8%E5%85%B3/image.png)

目标函数是：当前策略所得到的轨迹对应的奖励值的期望尽可能大；

![image.png](PPO%E7%9B%B8%E5%85%B3/image%201.png)

![image.png](PPO%E7%9B%B8%E5%85%B3/image%202.png)

# 策略梯度的引入

## 推导

利用log的求导方式，对目标函数进行变换，为的是**把状态转移概率分布从轨迹概率中剔除**，因为他和策略模型的梯度是无关的，完全由环境决定。

![image.png](PPO%E7%9B%B8%E5%85%B3/image%203.png)

![image.png](PPO%E7%9B%B8%E5%85%B3/image%204.png)

**轨迹概率代入到目标函数**

**每一个动作的梯度更新的大小都是其所在路径得到的奖励值**，这其实是不合理的，因为有一些操作是对最终得到奖励没有帮助的，因此将R改为另一个价值函数：既能体现整条路径奖励，又能体现单个动作的优劣

![image.png](PPO%E7%9B%B8%E5%85%B3/image%205.png)

# 优势函数

不希望用整个路径的回报定义单个步骤的回报（防止好路径中的坏步骤得到很大的鼓励），因此需要修改策略梯度中的奖励R，用优势函数A表示。

## advantage的基础定义

某一个状态的状态价值函数为 $v_{Π}(s)$，在该状态执行特定的动作，得到动作价值函数为 $Q_{Π}(s)$

这个状态的优势被定义如下，即这个动作的价值，比当前这个状态的平均价值好多少：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%206.png)

## 某一个状态的价值 V(s)

### 累计折扣奖励

由于语言模型自回归的马尔可夫性，我们认为当前步仅对当前以及之后的步有意义，并且离当前步越远，当前步的贡献越小，采用累计折扣奖励表示V：

- r是随机变量，和当前步的状态和采取的动作有关

![image.png](PPO%E7%9B%B8%E5%85%B3/image%207.png)

### V的表达式推导

这里和之前贝尔曼公式的推导有一个小的不同，原来的奖励分布 p(r | st, a) 被拆成了状态转移分布p(st+1 | st, a)乘以一个新的奖励分布R(st, at, st+1)。

$$
\begin{aligned}V_{\pi}(s_{t}) &= \mathbb{E}_{\pi}[G_{t} \mid s_{t}] \\               &= \mathbb{E}_{\pi}\left[\sum_{k=0}^{T-t} \gamma^{k} r_{t+k} \mid s_{t}\right] \\               &= \mathbb{E}_{\pi}[r_{t} + \gamma(r_{t+1} + \gamma r_{t+2} + \cdots) \mid s_{t}] \\               &= \mathbb{E}_{\pi}[r_{t} \mid s_{t}] + \mathbb{E}_{\pi}[\gamma G_{t+1} \mid s_{t}] \\               &= \mathbb{E}_{\pi}[r_{t} \mid s_{t}] + \mathbb{E}_{\pi}[\gamma V_{\pi}(s_{t+1}) \mid s_{t}] \\               &= \sum_{a_{t} \in \mathcal{A}} \pi(a_{t} \mid s_{t}) \sum_{s_{t+1} \in \mathcal{S}} P(s_{t+1} \mid s_{t}, a_{t}) R(s_{t}, a_{t}, s_{t+1}) \\               &\quad + \sum_{a_{t} \in \mathcal{A}} \pi(a_{t} \mid s_{t}) \sum_{s_{t+1} \in \mathcal{S}} P(s_{t+1} \mid s_{t}, a_{t}) \gamma V_{\pi}(s_{t+1}) \\               &= \sum_{a_{t} \in \mathcal{A}} \pi(a_{t} \mid s_{t}) \sum_{s_{t+1} \in \mathcal{S}} P(s_{t+1} \mid s_{t}, a_{t}) \left[ r_{t} + \gamma V_{\pi}(s_{t+1}) \right] \\               &= \mathbb{E}_{a_{t} \sim \pi(\cdot \mid s_{t})} \left[ \mathbb{E}_{s_{t+1} \sim P(\cdot \mid s_{t}, a_{t})} \left[ r_{t} + \gamma V_{\pi}(s_{t+1}) \right] \right]\end{aligned}
$$

### Q的表达式推导

![image.png](PPO%E7%9B%B8%E5%85%B3/image%208.png)

其实不用那么复杂求Q，V的表达式开始的未知有一个对所有的动作求期望的操作，把这个操作去掉就是动作价值函数的公式，也就是说V是Q在所有动作上的期望：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%209.png)

### advantage

- V如下进行改写，因为v(st)只和st有关，此处前面加一个求期望是无所谓的。
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2010.png)
    
- 将Q-V就得到优势函数
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2011.png)
    
- 由于r是环境决定的，但是V是利用模型近似的：
    - r是准确的
    - 从模型近似的V函数中采样得到的不是准确的V值（不是该状态真正的价值）
    - TD error不能算是优势函数的无偏估计

# ACTOR-CRITIC

- 单独用actor其实是可以的，就不需要建模值函数，只需要将路径的评估作为优势函数即可，但是这样的优势函数粒度太粗，方差大，估计不稳定
- 单独用critic也可以，这时候就变成DQN了，只需要根据TD-ERROR，更新V的建模即可，但是这样最终得到的是一个固定的策略

## ACTOR

### 优化目标

actor就是对策略进行优化，直接对策略进行更新，他的优势函数靠critic侧给出。

下面是优化目标的写法1：等多个episode结束之后，再算advantage。

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2012.png)

其实我们也可以分batch去做这个事，batch中的每一个样本都是一个step，不需要等完整的episode结束，也就是写法2：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2013.png)

## CRITIC

### 优化目标

在 PPO 中，critic 是一个随着 actor 更新而不断调整的低方差近似基准线，而不是一个试图精确还原当前策略真实价值的预测器。它的作用是为了让 actor 的更新方向更稳定，**而不是为了得到绝对准确的价值函数**。

critic给出**当前策略下的价值评估（V）**，为了进一步给出当前状态 s 执行的动作 a 相对于其他动作的优势。

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2014.png)

### 为什么使用TD-error为优化目标

- 视角1：可以使用贝尔曼残差去理解：
    - 贝尔曼方程V=f(V)满足收缩映射，因此可以通过不断进行迭代得到尽可能接近真实值的V
    - 这个迭代还可以得到一个误差上界，贝尔曼残差为0，当前迭代的V就是真正的状态价值V
        
        ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2015.png)
        
    - PPO critic常使用的TD(0)实际就是对于贝尔曼残差的单样本估计
        
        ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2016.png)
        
- 视角2：自举，得到一个较为可信的V（存在方差和偏差），让模型以这个V为target进行更新：
    - 当模型未能完美估计出V的时候，可以认为当前模型估计的V总是不如实际使用样本进行近似的V准确
    - MC方式，如果可以从某个状态出发采样并获取一系列的r，那我们可以得到V的一个无偏，但是高方差的近似值
    - TD方式，当前的V由当前获得的奖励r和下一状态的V构成，低方差，但是高偏差

# 重要性采样

- on-policy，产出样本的策略和当前更新的策略相同。
- off-policy，产出样本的策略并不是当前需要更新的策略（一个策略生成大量的样本，然后在同一批样本上反复进行更新）

重要性采样是典型的off policy，它通过在旧策略q(x)上采样的数据，预测新分布p(x)下的期望。

这里的f(x)就是loss函数。

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2017.png)

## 新的策略梯度

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2018.png)

## 只有多次采样才准

如果p和q差异很大，那只有多次采样，才能准确，在q上采样的时候：

- q比p大的位置，造成的影响很小。
- p比q大的位置，造成的影响较大。（多次采样需要采到这种数据）

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2019.png)

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2020.png)

# GAE

[六、GAE 广义优势估计 - 知乎](https://zhuanlan.zhihu.com/p/549145459)

[残差是什么？](PPO%E7%9B%B8%E5%85%B3/%E6%AE%8B%E5%B7%AE%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F%2024b5417e524a80428bbaf8cb38b6b94d.md)

因为critic不断在对当前的策略进行拟合，当前策略又在不断地更新，所以critic某时刻得到的V是不准确的，我们无法获得对于优势值A的无偏估计：

## 尽量少地依赖V的计算

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2021.png)

但是这样一来，虽然偏差变小了，都是由于每一个r都是随机变量，又增大了A的方差。

## 在高方差低偏差和低方差高偏差中找到平衡：λ-return

对于Gt做多次展开，TD-error只展开了一次。

Gt的表达式如下，只有当前步的奖励和下一步的状态价值：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2022.png)

如果展开n次：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2023.png)

对于同一状态下，展开不同次数的G进行加权，就是λ-return：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2024.png)

- 如果λ为0，就变回最原始的Gt，只展开一次，就是时序差分法求V
- 如果λ为1，就变回累计折扣奖励，MC蒙特卡洛法，多次采样轨迹，取累计折扣奖励的均值作为V
    - 这里使用**几何权重**进行累计回报，所以λ为1，不会是0，需要求一个极限，我们可以吧Rt+1单独拿出来看，当lambda趋近于1的时候，所有的G项中抽出来的Rt+1相加求极限，最后的极限就是Rt+1。
    - MC也是利用TD-error逼近真正的V值，需要多次得到轨迹，得到累计折扣奖励的均值来代表Gt。
    - 下面的这个随机近似更新只是累计折扣奖励均值的一种写法而已。
        
        ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2025.png)
        

### λ return在实际场景中的运用

因为步数不可能是无限的，在最后一步，也就是第T步的时候，就结束了：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2026.png)

![58733bfd7e6d100ed25e31dc4b24b12a.jpg](PPO%E7%9B%B8%E5%85%B3/58733bfd7e6d100ed25e31dc4b24b12a.jpg)

## 利用λ-return计算优势值

### 多步advantage

向后走两步的Q相较于只走一步的Q，偏差更小。

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2027.png)

最小化残差等于向贝尔曼公式靠近，贝尔曼公式本身就可以递推为两步：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2028.png)

### 计算加权—GAE

将A进行不同程度的展开，再进行几何权重的加权平均

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2029.png)

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2030.png)

## GAE计算

GAE是倒着算的，假设最多有T步：

- 第T步的优势值为0
- 0到T-1步都是使用递推公式获得：
    - 计算每一步的td error
    - 从后往前当前的GAE就是之后状态到当前状态的td error的做几何平均
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2031.png)
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2032.png)
    

# 限制PPO的更新幅度

由于重要性采样的需要，即两个分布越相似，则重要性采样越准（采样分布概率大，当前策略分布概率小的情况发生的可能性小，loss算的更准）

## CLIP的方式

限制更新的上下限：A的绝对值一定要在合理范围内，防止过分更新

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2033.png)

## 直接加一个KL penalty

β是超参，就是强行让两个分布的相似性尽可能小

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2034.png)

# 引入GAE之后的critic loss

critic的优化目标是得到更加准确的v，因此目标函数是减小TD error以逼近当前策略的V。

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2035.png)

**类似于DQN，在DQN中，估计值是从target network中获取的，在一定的step之内这个估计值target是不变的，防止目标偏移：**

- 在critic中我们也需要固定目标值Vtarget，也就是如下部分：
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2036.png)
    

从GAE中，我们可以得到固定目标值的表示，只需要将GAE加上 $V_{t}^{old}$即可：

- 使用GAE可以避免直接使用V去进行估计，从而使得偏差变小，这和在actor中使用GAE是相同的目的
- GAE的公式中就是TD-error+下一步的GAE（GAE是倒着算的）

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2037.png)

加入了GAE后的loss：**其中除了Vnew，其他的值在一个ppo epoch中是不变的，是标量**

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2038.png)

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2039.png)

我们还可以模仿actor loss进行clip，防止过分更新：

![image.png](PPO%E7%9B%B8%E5%85%B3/image%2040.png)

# 语言模型的策略梯度体现在哪？

当我们将采样完成的prompt+response再次输入到model中：

- 对于每一个token都有一个token logits向量长度等于词表大小
- 把prompt+response往左平移一格得到labels（每一个位置，预测得到的目标值）
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2041.png)
    
- 得到label对应的log probs，这个就是对应的 $log(Π(a|s_t))$
    
    ![image.png](PPO%E7%9B%B8%E5%85%B3/image%2042.png)