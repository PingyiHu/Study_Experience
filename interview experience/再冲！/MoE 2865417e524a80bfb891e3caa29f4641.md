# MoE

Owner: 吉祥 郑

[包含关键字 moe 的文章 - 科学空间|Scientific Spaces](https://kexue.fm/search/moe/)

# 手撕

# 为什么需要MoE

FFN在LLM的语境下通常任务是一个先升维后降维的两层FFN（必须要有激活函数才是FFN）

MoE其实可以看成是对完整FFN的**低秩近似**

## FFN分块

- FFN表示为之前一层的输入经过激活函数 $f$和的当前层的$W^{(B)}$进行矩阵运算
    
    ![image.png](MoE/image.png)
    
- 将A矩阵和B矩阵进行分块运算：y实际上是每一个 $v_i$的和

![image.png](MoE/image%201.png)

- 每一个$v_i$都可以看作是一个较小的模型，也就是专家
    
    ![image.png](MoE/image%202.png)
    

## 低秩近似

低秩近似的目的是：使用其中**k**个小模型$v_i$的和来近似完整参数的FFN

- 存在误差
    
    ![image.png](MoE/image%203.png)
    
    ![image.png](MoE/image%204.png)
    
- 直接求解较困难，假设$v_i$正交（交叉项被省略）：求最小，即让模长最小的几个$v_i$被舍弃（**即MoE留下最相关的专家**）
    
    ![image.png](MoE/image%205.png)
    

# 求解MoE（router登场）

## router的作用是预测模长

找模长最大$v_i$，意味着要把所有的$v_i$都算出来，这明显不合理，**我们需要预测模长：**

- 对$v_i$进行归一化
    
    ![image.png](MoE/image%206.png)
    
- 预测每个$e_i$的长度$ρ_i$
    
    ![image.png](MoE/image%207.png)
    

## router在实际推理/训练中的作用

- 把所有token位置对应的隐藏状态 $h_i$过router，得到所有专家的得分，并选出专家
- 根据每一个$h_i$选中的专家，将这些 $h_i$分桶（同一个专家的形成一个batch）
- 专家并行进行前向传播

**注意：**如果给某个专家分配了算力，但是 $h_i$始终无法路由到这个专家，专家占用的算力相当于是白费了

# 负载均衡

## AUX loss（负载均衡loss）

- 归一化选中一个专家的logits $ρ$，得到模长分布 $ρ$；负担分布 $f$（**每个token被分配单位算力1，其中1/k被分配到专家i**）
    
    ![image.png](MoE/image%208.png)
    
- $f$在一个batch的所有token上的期望，即每个专家被分配负担的期望（总算力为1的情况下，每个专家被分配的任务）：
    - 一个batch有N个token，第t个token的负担分布为 $f^{(t)}$，每个专家会有一个负担
    
    ![image.png](MoE/image%209.png)
    
    - 对所有的token求平均，第i个专家的平均负担为
        
        ![image.png](MoE/image%2010.png)
        
    - 如果每个专家得到的负担都一样（1/N），即分布Q，那么就是负载均衡
- LOSS形式
    
    ![image.png](MoE/image%2011.png)
    

## 从等效梯度的方式证明$L_{aux}$可以负载均衡

$L_{aux}$可以自定义：找一个和负担分布F增减趋势相同的量，将F的梯度近似为这个量的梯度即可

- Q是均匀分布，也就是负载均衡的目标分布
    
    ![image.png](MoE/image%2012.png)
    
- **直通估计进行反向梯度的估计：**由于F的计算操作中存在不可导的选取top k操作
    - P是对于F的平滑近似，并且P可以求导
    - sg就是stop gradient
    - 前向过程还是原来的$L_{aux}$，但是反向的梯度依靠P获取
    
    ![image.png](MoE/image%2013.png)
    
- 从梯度上来看，这两个LOSS是等价的，也就是之前介绍的$L_{aux}$是可以保证负载均衡
    
    ![image.png](MoE/image%2014.png)
    

## Loss-Free方案（deepseek）

之前介绍的$L_{aux}$虽然可以为负载均衡提供一定的保证，但是是直接加在最后的Loss里面：

- 权重较小，负载均衡难保证
- 权重太大，影响模型的训练

### Loss-Free方案和之前方案的区别：

- 只需要对模长增加一个偏置值b，就可以达成负载均衡（解耦LLM和负载均衡）
- 之前方案需要更新全体的权重以达成负载均衡，Loss-Free只需要对b进行更新即可

### 方案介绍

![image.png](MoE/image%2015.png)

![image.png](MoE/image%2016.png)

- 每个专家在进行topk挑选之前会把模长 $ρ_i$加上一个对应的偏置值 $b_i$
- $b_i$只参与到专家的挑选，在模长计算的时候不参与
- $b_i$的更新，$b_i$的增减趋势和F是相同的，因此可以进行平滑近似：
    - 负载均衡目标还是不变
    
    ![image.png](MoE/image%2017.png)
    
    - 直通估计，这里直接对于b求导，导数就是1
        
        ![image.png](MoE/image%2018.png)
        
    - b的更新是在每个step结束，即LLM参数更新完成之后进行的，是一个**手搓**梯度更新
        - b越大，该专家被挑选的可能性越大
        - 如果当前专家负载过重，超过1/n，就把b减小
        
        ![image.png](MoE/image%2019.png)
        

# 难点处着力：动态专家数

对于一些比较重要的token，固定的k个专家可能不够；对于一些简单的token也许不需要k个专家

如何动态：

- 对于某个token只要模长加偏置值大于0，则选中该专家
    
    ![image.png](MoE/image%2020.png)
    
- 优化目标：
    - 平均的被选中专家数为k
    - 保证负载均衡

## 分布变化

现在每个token选中的专家都是动态的，每个token给到每个expert的负担就不再是1/k

![image.png](MoE/image%2021.png)

![image.png](MoE/image%2022.png)

这就会使得对一个batch内的N个token进行期望计算后，得到的 $\tilde{F}$不再是一个分布（仍然表示每个专家的预期负载），因此需要对$\tilde{F}$进行归一化

![image.png](MoE/image%2023.png)

**b存在自由度：**即对于b的每一维增加一个偏置值，是不会影响到top k的选择

## 控制专家数的期望为k

![image.png](MoE/image%2024.png)

- **减去标量（归一化）：**b的更新中减去均值，保证b的期望为0，空出自由度，即**只确定b的更新方向**
    
    ![image.png](MoE/image%2025.png)
    
- **加上标量：**总预算减去k，添加更新约束以确保总体的预算在k附近（如果超出预算了，也就是 $ρ+b$很容易就会大于0，就把b减小；反之增大）
    
    ![image.png](MoE/image%2026.png)
    

# 共享专家

假设有n个专家，其中k个被激活

- 部分专家永远被激活（s个），负责学习共性知识
- 部分专家有router选择是否激活（从剩余的n-s个中挑k-s个进行激活），负责学习残差