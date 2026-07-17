# 研究经验（Research Experience）

> 本指南整合了论文阅读、代码规范和论文写作三方面的实用经验，帮助研究者高效开展工作。

---

# How to Read a Paper

> 本节基于 S. Keshav 的经典论文 *How to Read a Paper*（ACM SIGCOMM CCR, 2007）。

## 三遍阅读法（The Three-Pass Approach）

核心思想：不要从头到尾线性阅读，而应分三遍递进式阅读。每遍完成特定目标，并建立在前一遍基础上。

| 维度 | 第一遍 | 第二遍 | 第三遍 |
|:---|:---|:---|:---|
| 时间 | 5-10 分钟 | 约 1 小时 | 4-5 小时（初学者）/ 1 小时（有经验者） |
| 目标 | 鸟瞰全局 | 掌握内容 | 深度理解 |
| 方法 | 读标题、摘要、引言、章节标题、结论、参考文献 | 仔细阅读，忽略证明，关注图表，做注释 | 虚拟复现，挑战每个假设 |
| 输出 | 五个 C | 能向他人总结论文核心 | 能凭记忆重构论文结构，识别优缺点 |

### 第一遍：快速扫描（5-10 分钟）

**步骤：**

1. 仔细阅读标题（Title）、摘要（Abstract）和引言（Introduction）
2. 阅读章节和子章节标题，忽略正文
3. 扫视数学内容（如有），判断理论基础
4. 阅读结论（Conclusions）
5. 浏览参考文献，标记已读过的文献

**第一遍结束后，应回答"五个 C"：**

- **Category（类别）**：论文类型是什么？测量类？系统分析？研究原型？
- **Context（背景）**：与哪些论文相关？使用什么理论基础？
- **Correctness（正确性）**：假设是否有效？
- **Contributions（贡献）**：主要贡献是什么？
- **Clarity（清晰度）**：写作质量如何？

根据这五个 C，决定是否继续读第二遍。

### 第二遍：掌握内容（约 1 小时）

**要点：**

- 仔细阅读，但忽略证明细节
- 边读边在页边做注释，记录关键点和疑问
- 记录不理解的术语或想向作者提出的问题
- **特别关注图表**：
  - 坐标轴是否正确标注？
  - 结果是否有误差条（error bars）？
  - 结论是否具有统计显著性？

**第二遍结束后**：应能用证据向他人总结论文的核心论点。

**如果仍不理解**，可选择：
- 搁置论文（可能不需要理解）
- 先读背景材料后返回
- 坚持进入第三遍

### 第三遍：深度理解（4-5 小时 / 有经验者 1 小时）

**关键方法——虚拟复现（Virtual Re-implementation）：**

- 做出与作者相同的假设，在脑中重新构建这项工作
- 将虚拟复现与实际论文比较，识别创新点和隐藏缺陷
- 识别并挑战每个陈述中的每个假设
- 思考如果是自己，会如何呈现某个观点

**第三遍结束后，应能：**

- 凭记忆重构论文的完整结构
- 识别优点和弱点
- 精准定位隐含假设、遗漏的引用、实验或分析的潜在问题
- 记录未来工作的想法

## 文献综述方法（Literature Survey）

当需要阅读数十篇论文（可能在不熟悉领域）时：

**第一步**：用 Google Scholar 等搜索 3-5 篇近期高引用论文，每篇做第一遍阅读，然后读它们的 Related Work 部分。

**第二步**：在参考文献中寻找共同引用和重复出现的作者名——这些是关键论文和研究者。下载关键论文，访问关键研究者的网站，查看他们最近的发表，识别该领域的顶级会议。

**第三步**：访问顶级会议网站，浏览近期论文集。对这些论文进行两遍阅读。如果它们都引用了你之前未收集的关键论文，获取并阅读，必要时迭代。

## 批判性与创造性阅读

- **批判性阅读（Read Critically）**：不要假设作者总是正确，提出适当的问题
- **创造性阅读（Read Creatively）**：论文中的好想法是什么？是否有其他应用或扩展？是否存在改进可能？下一步你会做什么？

---

# Things that You Should Follow to Save Everyone's Time (Esp. Yours)

## Code Standardization

### Basic Requirements

1. Code should be **designed and organized** in a way that is **compatible** for different networks and different datasets.
   - Example: https://github.com/AI-secure/Meta-Nerual-Trojan-Detection

2. You should name each variable and function in a way that is so **readable** that **minimal annotations** have to be used.

3. Choose a more friendly platform.
   - Example: Pytorch (dynamic graph).

4. Output all **meaningful middle results** and save the **raw data**, as well as **configurations**! The results should be repeatable. For instance, values (like loss and gradient) of all related objects should be output, especially those that can help you judge if **objective converges (loss curve) or gradient explodes**.

5. Save different runs of experiment results (esp. with different configs) to make analysis easier and to prevent bugs/ideal results from disappearing in another run.

### Advanced Requirements

6. **Adaptively adjust the weight** of each loss term when there are multiple loss terms (in a way that can balance each of them optimally).

7. **Design Experiments for Getting Insights!**

8. Analyze the results (including intermediate) **in all ways to question if there is something wrong**.

---

# How to Write a Paper

> 论文写作是研究成果的最终呈现。好的写作能让审稿人快速理解你的贡献，差的写作则可能掩盖优秀的工作。

## 论文基本结构

一篇标准的 CS/ML 论文通常包含以下部分：

| 部分 | 内容 | 常见问题 |
|:---|:---|:---|
| **Title** | 简洁、具体、包含关键词 | 太泛或太长 |
| **Abstract** | 问题→方法→结果→意义，1-2 句每点 | 写成引言或缺少具体数字 |
| **Introduction** | 问题背景→现有方法不足→本文贡献 | 贡献列表不清晰 |
| **Related Work** | 按主题组织，突出与本文的区别 | 变成文献罗列 |
| **Method** | 从直觉到形式化，先总后分 | 缺少动机或符号混乱 |
| **Experiments** | 数据集→基线→指标→主实验→消融实验 | 缺少消融或统计检验 |
| **Conclusion** | 总结贡献，讨论局限，展望未来 | 重复摘要或过度宣称 |

## 写作原则

### 清晰性优先

- 每段第一句应是该段的核心观点
- 一个段落一个主题，避免"万能段落"
- 使用主动语态：*We propose...* 优于 *It is proposed that...*
- 避免长句和嵌套从句，审稿人没有时间反复阅读

### 摘要写作

摘要决定审稿人是否愿意仔细阅读你的论文。结构化写法：

1. **问题**：一句话说明研究问题和重要性
2. **现有方法的不足**：一句话指出 gap
3. **本文方法**：1-2 句描述核心思路
4. **关键结果**：1-2 句给出最重要的实验数字
5. **意义**：一句话总结贡献的影响

### 引言写作

引言是论文最重要的部分之一。推荐结构：

1. **第一段**：问题背景，引起兴趣
2. **第二段**：现有方法及其不足（建立 gap）
3. **第三段**：本文的核心思路（high-level idea）
4. **贡献列表**：用条目形式明确列出 3-4 个贡献

### 实验设计

好的实验应回答以下问题：

1. **主实验**：你的方法整体效果如何？（与 SOTA 对比）
2. **消融实验**：每个组件的贡献是什么？（ablation study）
3. **参数敏感性**：关键参数如何影响性能？
4. **案例分析**：定性结果能否支撑你的论点？

**重要提示**：
- 所有比较必须公平（相同数据划分、相同预处理）
- 报告均值和标准差，进行统计显著性检验
- 保存所有实验配置，确保可复现

### 图表规范

- 图片保存为 PNG 格式，不要用 JPG（JPG 默认 80% 压缩率）
- 坐标轴必须标注名称和单位
- 图例清晰，不同曲线/柱子易于区分
- 字体大小在缩小到单栏宽度后仍可阅读
- 表格中最佳结果**加粗**，次优结果加下划线

## 常见拒稿原因

1. **贡献不清晰**：审稿人读完不知道你做了什么
2. **缺少相关工作讨论**：没有说明与现有方法的区别
3. **实验不充分**：缺少消融实验、统计检验或公平比较
4. **写作质量差**：语法错误、逻辑混乱、图表不清
5. **过度宣称**：结论超出了实验支持的范围

## 投稿前检查清单

- [ ] 标题是否简洁且包含关键词？
- [ ] 摘要是否包含问题、方法、结果、意义？
- [ ] 引言是否清楚列出贡献？
- [ ] 相关工作是否突出了与本文的区别？
- [ ] 方法部分是否先给直觉再给形式化？
- [ ] 实验是否有消融研究和统计检验？
- [ ] 图表是否清晰、标注完整？
- [ ] 是否检查了拼写和语法？
- [ ] 参考文献格式是否一致？
- [ ] 是否遵守了页数限制和格式要求？

## 参考资料

- S. Keshav, "How to Read a Paper," ACM SIGCOMM CCR, vol. 37, no. 3, pp. 83-84, 2007.
- Simon Peyton Jones, "How to Write a Great Research Paper," Microsoft Research, 2007.
- Timothy Roscoe, "Writing Reviews for Systems Conferences," 2007.
