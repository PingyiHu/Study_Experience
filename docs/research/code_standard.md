# Code Standardization

> 良好的代码规范是研究可复现性的基础。以下要求帮助你写出易于理解、可维护、可复现的研究代码。

## Basic Requirements

### 1. 兼容性设计

Code should be **designed and organized** in a way that is **compatible** for different networks and different datasets.

- Example: https://github.com/AI-secure/Meta-Nerual-Trojan-Detection

### 2. 可读性命名

You should name each variable and function in a way that is so **readable** that **minimal annotations** have to be used.

- 变量名应自解释，减少注释负担
- 函数名应清楚表达其功能

### 3. 选择友好的平台

Choose a more friendly platform.

- Example: PyTorch（动态图，更 Pythonic）

### 4. 输出中间结果与保存原始数据

Output all **meaningful middle results** and save the **raw data**, as well as **configurations**! The results should be repeatable.

- 输出所有相关对象的值（如 loss、gradient），特别是能帮助判断：
  - **目标是否收敛**（loss curve）
  - **梯度是否爆炸**
- 保存实验配置，确保可复现

### 5. 保存不同实验运行的结果

Save different runs of experiment results (esp. with different configs) to make analysis easier and to prevent bugs/ideal results from disappearing in another run.

---

## Advanced Requirements

### 6. 自适应调整损失权重

**Adaptively adjust the weight** of each loss term when there are multiple loss terms (in a way that can balance each of them optimally).

### 7. 为获取洞察而设计实验

**Design Experiments for Getting Insights!**

- 实验不仅是为了验证性能，更是为了理解方法的行为和特性

### 8. 全方位分析结果

Analyze the results (including intermediate) **in all ways to question if there is something wrong**.

- 从多个角度审视结果
- 特别关注异常值和不符合预期的模式
- 中间结果同样重要，不要只看最终指标

---

## Common Traps in Keras

> 以下是一些在 Keras 框架中常见的陷阱，即使你使用其他框架，这些教训也值得借鉴。

### 1. 普通变量不可赋值

在计算图中，所有变量应使用 `K.variable()` 声明。在运行时，可以使用 `K.set_value()` 赋值。

### 2. 多个损失函数的梯度问题

当对单个输入推导多个损失函数的梯度时，只会产生一个梯度！

- 如果需要分别获取多个损失函数对单个输入的梯度，应**分别调用** `K.gradient()`

### 3. 图片保存为 PNG，不要用 JPG

JPG 默认使用 80% 压缩率，会损失图像质量。对于科研图表，应使用无损的 PNG 格式。
