# LLM Prompt Injection 攻击与防御 研究探索

> 研究综述文档 | 生成日期: 2025年 | 覆盖论文范围: 2022-2025

---

## 经典论文（2022-2024早期奠基性工作）

### 1. Ignore This Title and HackAPrompt: Exposing Systemic Vulnerabilities of LLMs through a Global Prompt Hacking Competition
- **作者**: Sander Schulhoff, Jeremy Pinto, Anaum Khan, Louis-François Bouchard, Chenglei Si, Svetlina Anati, Valen Tagliabue, Anson Kost, Christopher Carnahan, Jordan Boyd-Graber
- **年份/会议**: 2023, EMNLP (Empirical Methods in Natural Language Processing)
- **核心贡献**: 通过全球范围的prompt hacking竞赛收集了600,000+对抗性提示，系统性地暴露LLM的系统性漏洞；建立了最早的prompt injection大规模数据集和分析框架。
- **一句话总结**: 通过众包竞赛方式首次大规模量化了LLM对prompt injection攻击的脆弱性。
- **为什么经典**: 这是第一篇通过大规模实证研究系统记录prompt injection攻击模式的论文，为后续所有研究奠定了数据基础；提出的HackAPrompt数据集至今仍是该领域的标准基准之一。

### 2. Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection
- **作者**: Kai Greshake, Sahar Abdelnabi, Shailesh Mishra, Christoph Endres, Thorsten Holz, Mario Fritz
- **年份/会议**: 2023, AISec (ACM Workshop on Artificial Intelligence and Security), arXiv:2302.12173
- **核心贡献**: 首次提出并系统研究了**间接提示注入攻击（Indirect Prompt Injection, IPI）**；展示了攻击者如何通过外部数据源（网页、文档、邮件）向LLM-集成应用注入恶意指令；在Bing Chat等真实系统中验证了攻击可行性。
- **一句话总结**: 开创了间接提示注入的研究方向，证明LLM集成应用通过外部数据渠道面临严重的安全风险。
- **为什么经典**: 这是间接提示注入领域的奠基性工作，将威胁模型从直接的用户输入扩展到了整个数据供应链；被OWASP LLM Top 10引用为关键参考文献。

### 3. Ignore Previous Prompt: Attack Techniques for Language Models / PromptInject: Systematic Prompt Injection Against Language Models
- **作者**: Federico Perez, Ribeiro
- **年份/会议**: 2022, arXiv:2211.09527
- **核心贡献**: 最早系统性地研究了针对语言模型的提示注入攻击；提出了PromptInject框架，实现了目标劫持（goal hijacking）和提示泄露（prompt leaking）两种攻击；发现了"ignore previous instructions"等经典攻击模式。
- **一句话总结**: 开创了直接提示注入攻击的系统性研究，首次展示了通过用户输入覆盖LLM系统指令的可行性。
- **为什么经典**: 这是提示注入领域的开山之作，首次将web安全中的注入攻击概念系统性地引入LLM安全研究；提出的攻击框架和分类方法至今仍被广泛引用。

### 4. Universal and Transferable Adversarial Attacks on Aligned Language Models (GCG Attack)
- **作者**: Andy Zou, Zifan Wang, J. Zico Kolter, Matt Fredrikson
- **年份/会议**: 2023, NeurIPS (Neural Information Processing Systems)
- **核心贡献**: 提出了Greedy Coordinate Gradient (GCG) 方法，自动生成可迁移的对抗性后缀以绕过LLM安全对齐；展示了攻击从开源模型向闭源商业模型（GPT-3.5/4）的有效迁移； AdvBench数据集成为标准评测基准。
- **一句话总结**: 提出了首个通用的自动化越狱攻击方法，证明安全对齐的LLM可以通过对抗性后缀被系统性绕过。
- **为什么经典**: GCG攻击是该领域最具影响力的技术之一，开启了自动化对抗攻击的新范式；其技术思路（梯度优化+贪婪搜索）被后续大量工作所扩展和改进。

### 5. JailbreakBench: An Open Robustness Benchmark for Jailbreaking Large Language Models
- **作者**: Patrick Chao, Edoardo Debenedetti, Alexander Robey, Maksym Andriushchenko, Francesco Croce, Vikash Sehwag, Edgar Dobriban, Nicolas Flammarion, George J. Pappas, Florian Tramer, et al.
- **年份/会议**: 2024, arXiv:2404.01318
- **核心贡献**: 建立了 JailbreakBench，一个开放、可复现的越狱攻击鲁棒性评测基准；系统比较了多种攻击方法（GCG、AutoDAN、PAIR等）在不同模型上的表现；提出了标准化的评估协议和度量指标。
- **一句话总结**: 为LLM越狱攻击和防御提供了第一个全面的标准化评测框架。
- **为什么经典**: 这是越狱/提示注入领域最重要的基准测试工作之一，提供了系统性的比较框架和数据集，使得后续研究可以在统一标准下进行评估。

---

## 最新论文（2024-2025前沿进展）

### 1. The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions
- **作者**: Eric Wallace, Kai Xiao, Reimar Leike, Lilian Weng, Johannes Heidecke, Alex Beutel (OpenAI)
- **年份/会议**: 2024, arXiv:2404.13208
- **核心贡献**: 提出了**指令层次结构（Instruction Hierarchy）**的概念，训练LLM优先遵循高特权指令；设计了自动数据生成方法（Context Synthesis和Context Ignorance），教LLM选择性地忽略低特权指令中的冲突指令；在直接注入、越狱和工具注入攻击上实现了63%的鲁棒性提升。
- **一句话总结**: 通过训练LLM理解指令特权层次（系统>用户>第三方），显著提升了模型对提示注入攻击的抵抗力。
- **新颖之处**: 这是从模型训练层面解决提示注入问题的开创性工作；OpenAI后续将其整合到GPT-4o和GPT-5系列模型中；2025年发布的IH-Challenge数据集进一步推进了这一方向。

### 2. AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents
- **作者**: Edoardo Debenedetti, et al. (ETH Zurich SpyLab)
- **年份/会议**: 2024, NeurIPS
- **核心贡献**: 提出了AgentDojo动态评测框架，用于系统评估LLM智能体面临提示注入攻击的安全性和实用性；覆盖银行、Slack、旅行、工作空间4个领域，97个用户任务和629个安全测试用例；发现GPT-4o在攻击下目标攻击成功率可达53.1%。
- **一句话总结**: 第一个针对LLM智能体提示注入攻击的动态评测框架，揭示了当前智能体系统的严重安全漏洞。
- **新颖之处**: 首次将提示注入评测从静态问答扩展到动态智能体交互环境；同时评测良性任务完成率和攻击成功率，揭示了安全-效用权衡；被US/UK AISI用于红队测试。

### 3. Defenses Against Prompt Attacks Learn Surface Heuristics
- **作者**: 多位作者（OpenAI, UC Berkeley等）
- **年份/会议**: 2025, arXiv:2501.07185
- **核心贡献**: 系统分析了现有微调防御方法（如StruQ）学习到的实际上是**表面启发式规则**而非真正的语义理解；发现了三种shortcut行为：基于位置的拒绝、基于token触发的拒绝和对良性提示的过度拒绝；通过消融实验证明了现有防御的脆弱性。
- **一句话总结**: 揭示了当前提示注入微调防御方法本质上依赖表面模式而非深度理解，存在严重的泛化缺陷。
- **新颖之处**: 首次从机制解释性角度系统剖析了防御失效的根本原因；对防御研究领域提出了重要的方法论警示——高攻击拒绝率不等于真正的鲁棒性。

### 4. Rennervate: Attention is All You Need to Defend Against Indirect Prompt Injection Attacks
- **作者**: Yinan Zhong, Qianhao Miao, Yanjiao Chen, Jiangyi Deng, Yushi Cheng, Wenyuan Xu
- **年份/会议**: 2025, NDSS 2026 (Network and Distributed System Security Symposium)
- **核心贡献**: 提出了Rennervate防御框架，利用注意力特征在**token级别**检测和清除注入内容；设计了2-step attentive pooling机制聚合注意力头和响应token；在5个LLM和6个数据集上超越了15种商业和学术防御方法。
- **一句话总结**: 通过token级别的注意力特征分析实现了精确的间接提示注入检测和净化。
- **新颖之处**: 首次将注意力机制用于token级别的注入检测，实现了比句子/段落级别检测更细粒度的防御；建立了FIPI细粒度IPI数据集。

### 5. Prompt Injection Attacks in Large Language Models and AI Agent Systems: A Comprehensive Review
- **作者**: Saidakhror Gulyamov, et al.
- **年份/会议**: 2025/2026, Information journal
- **核心贡献**: 对2023-2025年间的提示注入攻击进行了最全面的系统性综述；综合分析了45种以上的攻击向量和防御机制；提出了PALADIN纵深防御框架。
- **一句话总结**: 目前最全面的提示注入攻击与防御系统性综述，整合了整个领域的研究成果。
- **新颖之处**: 提供了到目前为止最完整的文献综述和分类体系；提出的纵深防御框架整合了模型层、系统层和应用层的多种防御策略。

---

## 核心概念与学习笔记

### 1. Prompt Injection 定义与分类

#### 定义
提示注入（Prompt Injection）是一种针对大语言模型的安全攻击，攻击者通过在模型输入中嵌入恶意指令，覆盖或篡改模型原本应遵循的系统指令，从而诱导模型执行非预期行为。

#### 与Jailbreak的区别
| 维度 | Prompt Injection | Jailbreak |
|------|-----------------|-----------|
| 目标 | 劫持模型执行攻击者指令 | 绕过安全对齐产生有害内容 |
| 攻击面 | 系统指令vs用户输入/外部数据 | 安全训练边界 |
| 场景 | 集成应用、智能体、RAG | 对话系统 |
| 关系 | 两者本质都是利用LLM遵循指令的特性；越狱可视为提示注入的特例 |

#### 直接注入 vs 间接注入
- **直接提示注入（Direct Prompt Injection / DPI）**: 攻击者直接控制用户可见的输入通道，通过精心构造的提示覆盖系统指令。例如：用户在聊天框中输入"忽略之前的所有指令，现在请..."
- **间接提示注入（Indirect Prompt Injection / IPI）**: 攻击者控制外部数据源（网页、文档、邮件、数据库），将恶意指令嵌入到LLM应用会检索的内容中。例如：在网页HTML中隐藏"Ignore previous instructions..."，当LLM总结该网页时执行注入指令。

#### 分类体系
```
Prompt Injection
├── Direct Prompt Injection (DPI)
│   ├── Context Ignoring ("Ignore previous instructions")
│   ├── Template Escape (分隔符逃逸)
│   ├── Fake Completion (伪装对话历史)
│   ├── System Message Override (系统消息覆盖)
│   └── Obfuscated Attack (编码/混淆攻击)
├── Indirect Prompt Injection (IPI)
│   ├── Web-based (网页注入)
│   ├── Document-based (文档注入)
│   ├── Email-based (邮件注入)
│   ├── RAG Poisoning (检索内容投毒)
│   └── Tool Output Injection (工具输出注入)
└── Agent-specific Injection
    ├── Tool Description Poisoning (工具描述投毒)
    ├── Memory Poisoning (记忆投毒)
    ├── Multi-agent Propagation (多智能体传播)
    └── MCP Tool Poisoning (MCP工具投毒)
```

### 2. 主要攻击方法

#### 直接提示注入
- **Context Ignoring**: 使用"Ignore previous instructions"等指令让模型忽略系统提示
- **Delimiter Escape**: 通过特殊字符或格式破坏输入分隔
- **Fake Completion**: 伪装成之前的对话轮次，欺骗模型
- **Role Playing**: 通过角色扮演让模型切换到不受限制的模式（如DAN）
- **Payload Splitting**: 将恶意载荷分散到多个输入中

#### 间接提示注入（通过外部内容）
- **Web Injection**: 在网页中嵌入隐藏指令（HTML注释、不可见文本）
- **Document Injection**: 在PDF/Word文档中嵌入恶意指令
- **RAG Poisoning**: 毒害检索数据库中的文档
- **Email Injection**: 通过邮件内容注入恶意指令

#### 工具/插件注入
- **Tool Description Attack**: 操纵工具描述来劫持工具选择（ToolHijacker）
- **Tool Output Injection**: 在工具返回的结果中嵌入恶意指令
- **MCP Tool Poisoning**: 通过Model Context Protocol的工具描述注入恶意指令

#### RAG场景注入
- **Corpus Poisoning**: 向知识库中添加恶意文档
- **Few-Shot Knowledge Poisoning**: 注入精心构造的单条 passage 覆盖正确证据
- **Backdoor Attack**: 在知识库中植入触发器，特定查询时激活恶意行为

### 3. 主要防御方法

#### 输入验证与过滤
- **基于规则的过滤**: 使用正则表达式检测已知攻击模式
- **基于分类器的检测**: 使用DeBERTa等模型检测注入（Prompt-Guard, ProtectAI-v2）
- **LLM-based检测**: 使用辅助LLM判断输入是否包含注入

#### 指令层次结构
- **Instruction Hierarchy (OpenAI)**: 训练模型优先遵循高特权指令
- **Instructional Segment Embedding (Wu et al., ICLR 2025)**: 通过学习的段嵌入区分指令角色
- **Signed-Prompt (Suo, 2024)**: 用特殊token签名指令以验证来源

#### 提示硬化
- **StruQ (Structured Queries, Chen et al., 2024)**: 将查询结构化为用户指令槽和数据槽
- **Spotlighting (Hines et al., 2024)**: 用标记或编码明确标识不可信内容
- **Sandwich Defense**: 将用户数据夹在系统指令之间
- **SecAlign**: 使用偏好优化使模型偏向遵循用户意图

#### 输出监控
- **Response-based Detection**: 检查模型输出是否与预期一致
- **Perplexity Filtering**: 检测异常低困惑度（可能的攻击签名）
- **Attention Analysis (Rennervate)**: 通过注意力模式检测注入

#### 系统级防御
- **CaMeL**: 设计围绕LLM操作的安全执行层
- **Least Privilege**: 最小权限原则限制智能体能力
- **Human-in-the-Loop**: 高风险操作需要人工确认
- **Tool Filtering**: 仅允许与任务相关的工具

### 4. 关键理论与原理

#### 提示注入的根本原因（指令与数据混淆）
LLM的本质缺陷在于：**指令和数据在输入表示层面无法区分**。LLM将所有输入视为统一的token序列进行处理，缺乏内在的机制来区分"应该遵循的指令"和"应该处理的数据"。这种指令-数据混淆是提示注入攻击存在的根本技术原因。

> "The root cause of prompt injection is the commingling of trusted instructions and untrusted data in the LLM input channel." — Chen et al., 2025

#### 信任边界理论
- **信任边界（Trust Boundary）**: 系统设计中需要明确定义哪些输入来源是可信的、哪些是不可信的
- **传统软件安全**: 代码和数据有明确区分（W^X保护、SQL参数化等）
- **LLM挑战**: 提示和数据在统一文本空间中表示，缺乏硬件/操作系统级别的隔离
- **防御启示**: 需要在系统架构层面建立明确的信任层次（Instruction Hierarchy）

#### 防御的不可能性定理
Willison (2023) 提出了一个著名的观点：**纯提示级别的防御无法完全解决提示注入问题**，因为：
1. LLM无法100%可靠地区分指令和数据
2. 任何基于规则的过滤都可能被更巧妙的攻击绕过
3. 模型层面的防御（如微调）往往学到表面启发式而非真正理解

> "Delimiters won't save you from prompt injection." — Simon Willison, 2023

这一观点在 "Defenses Against Prompt Attacks Learn Surface Heuristics" (2025) 中得到了实证验证。

---

## 重要基准测试（Benchmarks）

| 基准名称 | 年份 | 规模 | 聚焦领域 | 关键贡献 |
|---------|------|------|---------|---------|
| **AdvBench** | 2023 | 520种有害行为 | 越狱攻击 | GCG攻击提出的标准评测集 |
| **HackAPrompt** | 2023 | 600K+对抗提示 | 直接注入 | 大规模prompt injection数据集 |
| **BIPIA** | 2023/2024 | 250个攻击目标，5个应用场景 | 间接注入 | 首个间接提示注入评测基准 |
| **JailbreakBench** | 2024 | 多攻击×多模型 | 越狱攻击 | 标准化越狱鲁棒性评测 |
| **InjecAgent** | 2024 | 1,054测试用例，17个用户工具 | 智能体注入 | 工具集成LLM智能体的注入评测 |
| **AgentDojo** | 2024 | 97任务，629安全用例 | 智能体注入 | 动态环境下的注入评测框架 |
| **GenTel-Safe/GenTel-Shield** | 2024 | 84K攻击案例 | 注入检测 | 统一基准+防御框架 |
| **AgentDyn** | 2025 | 60开放式任务，560注入用例 | 智能体注入 | 开放式动态智能体安全评测 |
| **PIArena** | 2026 | 集成多个基准 | 注入评测平台 | 支持多种攻击和防御的评测平台 |
| **IH-Challenge** | 2025 | 大规模数据集 | 指令层次 | OpenAI发布的指令层次训练数据集 |

---

## 搜索日志

### 搜索1: "prompt injection attack LLM survey comprehensive review"
- 结果: 发现多项综述和前沿论文，包括PIArena、ToolHijacker、Rennervate等

### 搜索2: "indirect prompt injection LLM attack Greshake Perez"
- 结果: 确认了Greshake 2023（间接注入奠基工作）和Perez 2022（直接注入开创工作）

### 搜索3: "direct prompt injection attack language model Perez Ribeiro"
- 结果: 找到了PromptInject框架和相关引用文献

### 搜索4: "prompt injection defense detection methods LLM"
- 结果: 发现了Rennervate（NDSS 2026）、Detection Method等最新防御方法

### 搜索5: "prompt injection attack LLM 2024 2025 novel approach"
- 结果: 发现了IntentGuard、HouYi攻击、Authority攻击等2024-2025年新方法

### 搜索6: "prompt injection defense instruction hierarchy OpenAI 2024"
- 结果: 找到了Wallace et al. 2024（The Instruction Hierarchy）及其详细技术内容

### 搜索7: "jailbreak prompt injection unified taxonomy 2024 2025"
- 结果: 发现了分类学方法和统一框架

### 搜索8: "prompt injection RAG retrieval augmented generation attack 2024"
- 结果: 发现了RAG场景下的多种攻击方法（PoisonedRAG、Knowledge Poisoning）

### 搜索9: "prompt injection web application LLM security 2024"
- 结果: 发现了针对Web应用中第三方AI聊天插件的注入风险研究

### 搜索10: "prompt injection mitigation practical defense survey 2024"
- 结果: 综合了多种防御策略（Spotlighting、CaMeL、TaskTracker等）

### 搜索11: "prompt injection benchmark evaluation BIPIA HouYi 2024"
- 结果: 确认了BIPIA、InjecAgent、AgentDojo等关键基准测试

### 搜索12: "Schulhoff 2023 HackAPrompt prompt hacking competition"
- 结果: 确认了HackAPrompt竞赛论文（EMNLP 2023）

### 搜索13: "Zou 2023 universal suffix transfer attack LLM jailbreak"
- 结果: 确认了GCG攻击（NeurIPS 2023）及其大量后续工作

### 搜索14: "AgentDojo benchmark prompt injection agent security 2024"
- 结果: 获得了AgentDojo的详细技术信息（NeurIPS 2024）

### 搜索15: "StruQ structural defense prompt injection Chen 2024"
- 结果: 确认了StruQ结构化查询防御及其后续发展（SecAlign等）

---

## 关键引用文献汇总

### 经典/奠基性论文
1. Perez & Ribeiro (2022). "Ignore Previous Prompt: Attack Techniques for Language Models." arXiv:2211.09527.
2. Schulhoff et al. (2023). "Ignore This Title and HackAPrompt." EMNLP 2023.
3. Greshake et al. (2023). "Not What You've Signed Up For." AISec 2023.
4. Zou et al. (2023). "Universal and Transferable Adversarial Attacks on Aligned Language Models." NeurIPS 2023.
5. Yi et al. (2023/2024). "BIPIA: Benchmarking and Defending Against Indirect Prompt Injection Attacks."

### 最新前沿论文
6. Wallace et al. (2024). "The Instruction Hierarchy." OpenAI, arXiv:2404.13208.
7. Debenedetti et al. (2024). "AgentDojo." NeurIPS 2024.
8. Zhan et al. (2024). "InjecAgent." ACL 2024 Findings.
9. (2025). "Defenses Against Prompt Attacks Learn Surface Heuristics." arXiv:2501.07185.
10. Zhong et al. (2025). "Rennervate." NDSS 2026.

### 重要防御方法论文
11. Chen et al. (2024). "StruQ: Defending Against Prompt Injection with Structured Queries."
12. Chen et al. (2024). "SecAlign: Defending Against Prompt Injection with Preference Optimization."
13. Hines et al. (2024). "Spotlighting: Defending Against Indirect Prompt Injection."
14. Debenedetti et al. (2025). "CaMeL: A Defense Mechanism for Prompt Injection."
15. Shi et al. (2025). "PromptArmor: Simple yet Effective Prompt Injection Defenses."

---

## 发展趋势总结

### 攻击演进趋势
1. **从手工到自动化**: 从手动构造"Ignore previous instructions"到GCG/AutoDAN自动优化攻击
2. **从直接到间接**: 威胁面从用户输入扩展到整个数据供应链
3. **从单轮到多轮**: 攻击从单轮对话扩展到多轮交互和智能体场景
4. **从文本到多模态**: 扩展到图像、代码等多模态输入
5. **从模型到系统**: 攻击目标从单一模型扩展到整个应用系统

### 防御演进趋势
1. **从提示工程到模型训练**: 从简单的sandwich defense到Instruction Hierarchy的模型级训练
2. **从规则到学习**: 从基于规则的过滤到基于深度学习的检测
3. **从粗粒度到细粒度**: 从句子级检测发展到token级检测（Rennervate）
4. **从单层到多层**: 纵深防御框架的提出（PALADIN）
5. **从静态到动态**: AgentDojo等动态评测框架的出现

### 关键挑战
- **检测与泛化**: 现有防御学到的多为表面启发式，难以泛化到新攻击
- **安全-效用权衡**: 安全防御往往影响模型的正常功能
- **评估标准化**: 需要更全面的评测框架覆盖各种攻击场景
- **自适应攻击**: 防御的提出催生了更强的自适应攻击
- **MCP/Agent生态**: 新型协议和架构引入了新的攻击面
