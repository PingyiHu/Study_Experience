# LLM Agent 安全与防御 研究探索

> 本文档系统整理了LLM-based AI Agent安全与防御领域的经典论文（2022-2024早期奠基性工作）和最新论文（2024-2025前沿进展），涵盖核心概念、攻击方法、防御策略和关键理论框架。
> 
> 生成日期: 2025年7月 | 搜索次数: 14次独立搜索 | 覆盖论文: 50+

---

## 经典论文（2022-2024早期奠基性工作）

### 1. Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection
- **作者**: Kai Greshake, Sahar Abdelnabi, Shailesh Mishra, Christoph Endres, Thorsten Holz, Mario Fritz
- **年份/会议**: 2023, ACM AISec Workshop
- **核心贡献**: 首次系统性地提出和分析间接提示注入攻击（Indirect Prompt Injection），证明LLM集成应用可通过第三方内容中的恶意指令被攻陷
- **一句话总结**: 间接提示注入攻击的开山之作，奠定了LLM Agent安全研究的基础威胁模型
- **为什么经典**: 这是第一篇系统分析LLM集成应用中提示注入攻击的论文，定义了直接注入和间接注入的分类，开创了整个Agent提示注入安全研究方向。被后续几乎所有Agent安全论文引用作为基础威胁模型

### 2. ToolEmu: Identifying Risks of LM Agents with an LM-Emulated Sandbox
- **作者**: Yangjun Ruan, Hongseok Namkoong, Yuanzhi Li
- **年份/会议**: 2023/2024, NeurIPS 2024
- **核心贡献**: 提出ToolEmu框架，使用LM模拟沙箱识别Agent安全风险，覆盖36个工具包、144个高风险任务和9种风险类型
- **一句话总结**: 首个针对LLM Agent风险识别的系统化沙箱仿真框架，奠定了Agent安全评测的基础设施
- **为什么经典**: 这是Agent安全评测领域的里程碑工作，开创了使用模拟沙箱进行Agent安全测试的方法论，后续众多Benchmark（如AgentDojo、ASB）都受其影响

### 3. ReAct: Synergizing Reasoning and Acting in Language Models
- **作者**: Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao
- **年份/会议**: 2023, ICLR
- **核心贡献**: 提出ReAct范式，将推理（Reasoning）和行动（Acting）结合在语言模型中，成为Agent架构的基础
- **一句话总结**: 定义了LLM Agent的基本架构范式（推理+行动循环），几乎所有Agent安全研究都基于此架构分析
- **为什么经典**: ReAct定义了现代LLM Agent的基本架构——思考-观察-行动的循环模式。理解Agent安全攻击必须理解ReAct架构，因为大多数攻击都针对其中的某个环节（如工具调用、观察篡改等）

### 4. BadAgent: Inserting and Activating Backdoor Attacks in LLM Agents
- **作者**: Yifei Wang, Dizhan Xue, Shengjie Zhang, Shengsheng Qian
- **年份/会议**: 2024, ACL
- **核心贡献**: 首次系统研究LLM Agent中的后门攻击，提出在Agent的训练数据和工具链中插入和激活后门的完整方法
- **一句话总结**: 开创了LLM Agent后门攻击研究，证明Agent工具链和训练数据可被植入持久性后门
- **为什么经典**: 这是Agent后门攻击领域的奠基之作，首次证明Agent的自主性可以被后门利用，为后续AgentPoison、BadChain等工作奠定基础

### 5. InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated LLM Agents
- **作者**: Qiusi Zhan, et al.
- **年份/会议**: 2024, ACL Findings
- **核心贡献**: 提出首个针对工具集成LLM Agent的间接提示注入基准测试，评估30个LLM Agent在工具调用场景下的脆弱性
- **一句话总结**: 首个专门针对工具集成Agent的间接提示注入Benchmark，量化了Agent在工具调用场景下的安全脆弱性
- **为什么经典**: InjecAgent定义了工具集成Agent中间接提示注入的评测标准，是后续AgentDojo、ASB等更复杂Benchmark的前身

### 6. AgentPoison: Red-teaming LLM Agents via Poisoning Memory or Knowledge Bases
- **作者**: Zhaorun Chen, Zhen Xiang, Chaowei Xiao, Dawn Song, Bo Li
- **年份/会议**: 2024
- **核心贡献**: 首个针对RAG和记忆机制的LLM Agent后门攻击，提出约束优化方法生成触发器，在知识库中仅需注入<0.1%的恶意样本即可达到80%+攻击成功率
- **一句话总结**: 首次证明Agent的长期记忆/RAG知识库可被恶意投毒，开创了记忆层攻击的新方向
- **为什么经典**: 这是记忆层攻击的开创性工作，揭示了Agent依赖外部记忆带来的全新攻击面

### 7. Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- **作者**: Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, et al.
- **年份/会议**: 2022, NeurIPS
- **核心贡献**: 提出思维链（CoT）提示方法，使LLM能够进行多步推理
- **一句话总结**: 定义了LLM推理的基本范式，Agent的思考过程基于此构建，也为后续的CoT劫持攻击提供了理论基础
- **为什么经典**: CoT是所有Agent推理的基础，后续的链式思维劫持（BadChain）、CoT暴露攻击等都直接与此相关

---

## 最新论文（2024-2025前沿进展）

### 1. Self-Propagating Attacks Across LLM Agent Ecosystems (ClawWorm)
- **作者**: Zeming Wei, et al.
- **年份/会议**: 2026/03 (arXiv), 研究前沿
- **核心贡献**: 提出首个自复制蠕虫攻击ClawWorm，针对生产级Agent框架OpenClaw，实现完全自主的感染循环：劫持配置→建立持久化→执行payload→传播到对等节点
- **一句话总结**: 证明了LLM Agent生态系统可被蠕虫式攻击自主传播，攻击成功率64.5%，揭示了Agent间信任边界的根本性缺陷
- **新颖之处**: 首次证明了Agent生态系统中的自传播攻击可行性，类似生物学传染病的传播模式。揭示了多Agent系统中信任链的脆弱性

### 2. A Survey on Trustworthy LLM Agents: Threats and Countermeasures
- **作者**: Miao Yu, et al.
- **年份/会议**: 2025, KDD
- **核心贡献**: 首个全面综述可信LLM Agent的研究，系统分类了内在可信性（Brain、Memory、Action、Guardrail）和外在可信性（Agent协作、环境交互）
- **一句话总结**: 目前最全面的LLM Agent安全综述，建立了完整的Agent安全威胁和防御分类体系
- **新颖之处**: 建立了第一个系统化的Agent安全分类框架，涵盖从单Agent内部组件到多Agent系统再到环境交互的全栈威胁模型

### 3. ToolSafe: Enhancing Tool Invocation Safety via Proactive Step-level Guardrail
- **作者**: Yutao Mou, Zhangchi Xue, et al. (PKU & Shanghai AI Lab)
- **年份/会议**: 2026/01 (arXiv)
- **核心贡献**: 提出TS-Bench（首个步骤级工具调用安全检测基准）、TS-Guard（基于多任务RL的护栏模型）和TS-Flow（护栏反馈驱动的推理框架）
- **一句话总结**: 将Agent工具调用安全防护从"检测-终止"模式推进到"步骤级预防+反馈驱动"模式，减少65%的有害工具调用
- **新颖之处**: 首次实现了步骤级工具调用安全检测和主动干预，而非传统的在攻击发生后终止执行

### 4. ToolHijacker: Prompt Injection Attack to Tool Selection in LLM Agents
- **作者**: Jiawen Shi, Zenghui Yuan, et al. (HUST & Duke)
- **年份/会议**: 2025, NDSS 2026
- **核心贡献**: 首个针对工具选择环节的提示注入攻击，在黑盒场景下通过注入恶意工具文档操纵Agent的工具选择过程
- **一句话总结**: 证明Agent的工具选择环节（检索+选择）存在严重漏洞，现有防御措施均不足以应对此类攻击
- **新颖之处**: 首次将攻击面从工具调用扩展到工具选择阶段，揭示了工具库管理中的安全盲区

### 5. A Systematization of Security Vulnerabilities in Computer Use Agents
- **作者**: Daniel Jones, Giorgio Severi, et al.
- **年份/会议**: 2025 (arXiv)
- **核心贡献**: 系统分析Computer Use Agents（CUAs）的七类安全风险：UI欺骗、RCE、CoT暴露、HiTL绕过、间接提示注入、身份模糊、内容危害
- **一句话总结**: 首次系统分析了CUAs的完整攻击面，揭示了从感知层到执行层的多维度安全漏洞
- **新颖之处**: 专门针对CUAs这一类新型Agent形式进行系统化威胁分析，填补了该领域的安全研究空白

### 6. MCPSecBench: A Systematic Security Benchmark for Model Context Protocols
- **作者**: Yang et al.
- **年份/会议**: 2026/02 (arXiv)
- **核心贡献**: 首个MCP安全基准测试，定义17种攻击类型跨4个攻击面（客户端、协议端、服务端、主机端），发现85%+攻击至少攻破一个主流平台
- **一句话总结**: 首次系统评估MCP生态系统的安全性，揭示了当前保护机制平均成功率不足30%
- **新颖之处**: MCP作为Agent工具连接的标准协议，其安全性此前缺乏系统评估。MCPSecBench填补了这一关键空白

### 7. From Thinker to Society: Security in Hierarchical Autonomy Evolution of AI Agents
- **作者**: 多作者综述
- **年份/会议**: 2026/03 (arXiv)
- **核心贡献**: 将Agent安全从个体Agent扩展到多Agent社会层面，分析从单Agent到多Agent协作再到Agent社会的分层自治进化中的安全风险
- **一句话总结**: 首次将Agent安全研究从单Agent层面扩展到Agent社会层面，提出了分层自治进化的安全框架
- **新颖之处**: 提出了Agent安全研究的新范式——不仅关注单个Agent的安全，更要关注Agent群体和社会的安全演化

### 8. Memory Poisoning Attack and Defense on Memory Based LLM-Agents
- **作者**: Balachandra Devarangadi Sunil, et al.
- **年份/会议**: 2026/01 (arXiv)
- **核心贡献**: 系统评估记忆投毒攻击在真实部署条件下的鲁棒性，发现预存合法记忆显著降低攻击效果，提出输入/输出审核和记忆消毒两种防御机制
- **一句话总结**: 首次在真实部署条件下评估记忆投毒攻击的鲁棒性，发现现实条件会显著降低攻击效果
- **新颖之处**: 揭示了理想实验条件与真实部署环境的差异，为防御设计提供了实用指导

### 9. The Dark Side of LLMs: Agent-based Attacks for Complete Computer Takeover
- **作者**: 多作者
- **年份/会议**: 2025 (arXiv)
- **核心贡献**: 系统评估17种SOTA LLM Agent的三种攻击面：直接提示注入（41.2% ASR）、RAG后门攻击（52.9% ASR）、Agent间信任利用（82.4% ASR）
- **一句话总结**: 揭示了Agent间信任利用是最严重的安全漏洞（82.4%成功率），远超直接提示注入
- **新颖之处**: 建立了Agent安全的漏洞层次结构，发现多Agent系统中同伴信任是一个被严重低估的攻击面

### 10. JARVIS or Ultron? A Survey on Safety and Security Threats of Computer-Using Agents
- **作者**: 多作者
- **年份/会议**: 2025 (arXiv)
- **核心贡献**: 全面综述CUAs的安全威胁，建立威胁分类体系（内在威胁+外在威胁），覆盖感知、推理、记忆、规划、工具使用等各环节
- **一句话总结**: 首个专门针对Computer-Using Agents的安全威胁全面综述
- **新颖之处**: 专门针对CUAs这一新兴Agent类型，建立了独特的威胁分类框架

---

## 核心概念与学习笔记

### 1. Agent 安全定义与威胁模型

#### 定义
LLM Agent安全是指保护基于大语言模型的自主智能体免受恶意攻击、误用和意外危害的系统性研究。Agent安全不仅涉及模型本身的安全性，更关键的是Agent与外部环境（工具、记忆、其他Agent）交互时引入的新攻击面。

#### 与传统LLM安全的区别
| 维度 | 传统LLM安全 | LLM Agent安全 |
|------|-----------|-------------|
| 攻击面 | 输入文本、模型参数 | 工具调用、记忆存储、Agent通信、环境交互 |
| 攻击目标 | 诱导有害输出 | 操纵工具执行、窃取数据、持久化控制 |
| 持久性 | 单轮攻击 | 多轮持久化（记忆投毒、后门激活） |
| 传播性 | 单次影响 | 可跨Agent传播（蠕虫、多Agent信任利用） |
| 危害范围 | 内容层面 | 系统层面（RCE、数据泄露、权限提升） |

#### 威胁模型
Agent安全威胁模型通常包含以下要素：
- **攻击者目标**: 操纵Agent执行恶意工具调用、窃取用户数据、建立持久化控制
- **攻击者能力**: 从仅能通过查询交互（黑盒）到完全控制工具响应（白盒）
- **攻击面**: 用户输入、工具描述、工具响应、记忆存储、系统提示、Agent通信
- **攻击向量**: 直接提示注入（DPI）、间接提示注入（IPI/OPI）、记忆投毒、后门攻击、通信篡改

#### 攻击面分类（按ASB框架）
1. **用户提示层**: 攻击者直接向Agent输入恶意指令
2. **工具使用层**: 恶意工具描述、工具响应注入
3. **记忆层**: 长期记忆投毒、RAG知识库污染
4. **系统提示层**: 系统提示后门、隐藏指令
5. **多Agent通信层**: Agent间消息篡改、信任利用
6. **环境层**: 物理/数字环境操控

### 2. 主要攻击方法

#### 工具/插件滥用
- **间接提示注入（IPI/OPI）**: 攻击者在工具响应中嵌入恶意指令，Agent处理响应时执行攻击者意图（Greshake et al., 2023）
- **工具选择劫持（ToolHijacker）**: 攻击者注入恶意工具文档操纵工具检索和选择过程（Shi et al., 2025）
- **工具投毒**: 在MCP等工具生态系统中，恶意服务器在工具描述中嵌入隐藏指令（Hou et al., 2025）
- **恶意工具诱导（AMA）**: 诱导Agent调用攻击者控制的恶意工具（2025）

#### 记忆层攻击
- **记忆投毒（Memory Poisoning）**: 攻击者通过查询交互向Agent的长期记忆中注入恶意指令，影响未来响应（MINJA攻击，Dong et al., 2025）
- **RAG后门（AgentPoison）**: 在知识库中注入少量恶意样本（<0.1%），当查询包含特定触发器时检索恶意内容（Chen et al., 2024）
- **记忆注入**: 利用桥梁步骤和指示提示逐步引导Agent生成并存储有毒记忆条目
- **记忆提取**: 通过精心设计的提示从Agent记忆中提取历史查询和敏感数据

#### 跨Agent攻击
- **Agent间信任利用**: Agent将同伴Agent视为可信实体，执行来自同伴的恶意命令（成功率82.4%）
- **通信篡改**: 在多Agent系统中篡改Agent间消息传递
- **传播性攻击（CORBA）**: 通过递归阻塞攻击在多Agent系统中传播
- **自传播蠕虫（ClawWorm）**: 完全自主的感染循环，跨Agent传播payload

#### 环境操控攻击
- **UI欺骗**: 通过视觉覆盖元素误导CUA的界面级推理
- **CoT暴露**: 操纵隐式界面框架劫持多步推理
- **感知-执行不匹配**: 利用Agent感知和真实环境状态之间的差异
- **人类在环（HiTL）绕过**: 诱导Agent自主绕过确认提示

### 3. 主要防御方法

#### 权限控制与沙箱
- **沙箱隔离**: AgentBay等平台的VM级隔离，每次会话独立文件系统和网络
- **权限最小化**: 基于策略的工具访问控制（Progent）
- **零信任架构**: 默认不信任任何输入，包括工具响应和Agent间通信
- **委托授权**: 任务范围内的授权机制，控制Agent行动权限

#### 行为监控
- **步骤级护栏（TS-Guard）**: 在工具调用前实时检测不安全行为
- **AgentMonitor**: 实时行为监控系统
- **拓扑引导安全（G-Safeguard）**: 基于多Agent系统拓扑结构的安全分析
- **GuardAgent**: 通过知识启用的推理保护LLM Agent

#### 输入/输出过滤
- **PromptGuard**: 基于分类器的提示注入检测
- **PIGuard**: 专门针对提示注入的检测器
- **perplexity检测**: 基于困惑度异常检测恶意输入
- **FATH认证**: 使用HMAC标签验证用户指令完整性

#### 安全对齐
- **安全微调（SecAlign）**: 通过安全对齐训练增强Agent内在防御能力
- **知识启用的推理（GuardAgent）**: 利用外部安全知识指导Agent推理
- **选择性退出机制**: Agent在不确定时选择退出而非冒险执行
- **DRIFT动态验证**: 初始计划生成安全约束+动态验证器保持功能

### 4. 关键理论与原理

#### Agent能力边界理论
- **能力-风险权衡**: Agent能力的增强（工具使用、多步推理）直接扩大攻击面
- **自主性悖论**: Agent自主性越高，安全措施越容易被绕过（如HiTL绕过）
- **能力差距≠安全差距**: 某些Agent不能完成恶意任务是因为能力不足而非安全机制有效

#### 工具使用的安全风险
- **工具作为信任边界**: 每次工具调用都是一次信任决策
- **语义差距**: 工具名称/描述与实际行为之间的语义差距可被利用
- **供应链风险**: MCP等工具生态中的第三方服务器引入供应链攻击
- **能力放大效应**: 工具使用将LLM的内容生成能力放大为系统级操作能力

#### 多Agent系统的信任问题
- **同伴信任偏见**: LLM对来自其他Agent的请求应用比人类更宽松的安全策略
- **信任传递**: 多Agent系统中的信任关系可被传递和滥用
- **身份模糊**: 难以区分用户行为和Agent行为，导致归因失败
- **委托漂移**: Agent保留超出预期时间或上下文范围的权限假设

#### MCP安全架构
- **四方模型**: MCP生态涉及Host、Client、Server、Protocol四个组件
- **生命周期威胁**: MCP Server的创建、部署、运行、维护各阶段存在不同威胁
- **17种攻击类型**: MCPSecBench定义的完整攻击分类
  - 客户端: 提示注入、工具/服务误用
  - 协议端: 中间人攻击、MCP重绑定
  - 服务端: 工具投毒、数据泄露、Rug Pull
  - 主机端: 配置漂移、沙箱逃逸、漏洞利用
- **保护机制平均成功率<30%**: 当前MCP安全防御严重不足

---

## 关键Benchmark和工具汇总

| Benchmark | 年份 | 类型 | 规模 | 核心特点 |
|-----------|------|------|------|---------|
| ToolEmu | 2023 | 沙箱仿真 | 36工具包, 144任务, 9风险类型 | LM模拟沙箱，风险识别 |
| InjecAgent | 2024 | 提示注入 | 330工具, 36工具包 | 首个工具集成Agent注入基准 |
| AgentDojo | 2024 | 端到端安全 | 97任务, 629安全测试用例 | 动态可扩展评估框架 |
| AgentHarm | 2024 | 有害行为 | 110恶意任务, 11类别 | 评估Agent有害行为合规性 |
| ASB (Agent Security Bench) | 2024/ICLR 2025 | 综合安全 | 10场景, 10 Agent, 400+工具 | 统一攻击/防御Benchmark |
| AgentPoison (Backdoor) | 2024 | 后门攻击 | 3类Agent | 记忆/RAG后门攻击评估 |
| OSWorld | 2024/NeurIPS | 多模态Agent | 开放式任务 | 真实计算机环境评测 |
| MCPSecBench | 2025 | MCP安全 | 17攻击类型, 4攻击面 | 首个MCP安全系统Benchmark |
| TS-Bench (ToolSafe) | 2026 | 步骤级安全 | 步骤级工具调用安全 | 首个步骤级安全检测基准 |
| AgentDyn | 2026 | 动态评估 | 动态开放式任务 | 针对动态规划场景的安全评估 |

---

## 搜索日志

### 搜索1: "LLM agent security survey comprehensive"
- 结果: 找到A Survey on Trustworthy LLM Agents: Threats and Countermeasures (KDD 2025) 等综述
- 关键发现: 建立了完整的Agent安全威胁分类体系

### 搜索2: "LLM agent safety attack defense tool augmentation"
- 结果: ToolSafe (TS-Bench/TS-Guard), ToolHijacker等
- 关键发现: 工具调用安全的步骤级防护是前沿方向

### 搜索3: "agent prompt injection attack tool manipulation"
- 结果: ToolHijacker (NDSS 2026), AgentDojo, ASB, InjecAgent
- 关键发现: 工具选择和工具调用都是关键攻击面

### 搜索4: "LLM agent security 2024 2025 NeurIPS ICLR ICML"
- 结果: ClawWorm, GuardAgent (ICML 2025), Multi-agent security论文
- 关键发现: 多Agent系统安全和自传播攻击是前沿

### 搜索5: "multi-agent system security attack vulnerability"
- 结果: 多Agent系统安全综述, G-Safeguard, 通信攻击
- 关键发现: Agent间信任利用是最危险的攻击向量(82.4% ASR)

### 搜索6: "agent backdoor attack tool manipulation LLM 2024"
- 结果: BadAgent (ACL 2024), AgentPoison, BackdoorChain
- 关键发现: 后门攻击可通过记忆/RAG和工具链两条路径

### 搜索7: "computer using agent security CUA vulnerability"
- 结果: JARVIS or Ultron? Survey, CUA漏洞系统分析
- 关键发现: CUAs存在7类独特安全风险

### 搜索8: "agent sandbox security defense isolation"
- 结果: AgentBay安全架构, CaMeL, Progent, DRIFT
- 关键发现: 沙箱+动态权限控制是核心防御策略

### 搜索9: "MCP model context protocol security vulnerability"
- 结果: MCPSecBench, MCP Guardian, ETDI, Tool Poisoning
- 关键发现: MCP生态存在17种攻击类型，当前防护不足30%

### 搜索10: "memory poisoning attack LLM agent long-term memory"
- 结果: MINJA, AgentPoison, Memory Injection Attack
- 关键发现: 记忆投毒在真实部署中效果降低，但需要专门防御

### 搜索11: "ToolEmu LLM agents risk identification sandbox 2023"
- 结果: ToolEmu详细技术细节和引用信息
- 关键发现: 确认了NeurIPS 2024的发表状态

### 搜索12: "indirect prompt injection LLM integrated applications 2023"
- 结果: Greshake et al.原始论文和引用网络
- 关键发现: 确认为间接提示注入的开创性工作

### 搜索13: "self-propagating attacks LLM agent ecosystems worm 2026"
- 结果: ClawWorm完整技术细节
- 关键发现: 64.5%的聚合攻击成功率，技能供应链普遍脆弱

### 搜索14: "BadAgent inserting activating backdoor attacks LLM agents ACL 2024"
- 结果: 完整论文引用和技术细节
- 关键发现: ACL 2024正式发表，被广泛引用

---

## 重要引用论文索引

### 基础理论
- [ReAct] Yao et al., "ReAct: Synergizing reasoning and acting in language models." ICLR 2023.
- [CoT] Wei et al., "Chain-of-thought prompting elicits reasoning in large language models." NeurIPS 2022.
- [AutoGen] Wu et al., "AutoGen: Enabling next-gen LLM applications via multi-agent conversations." COLM 2024.

### 安全攻击
- [Greshake et al., 2023] "Not what you've signed up for: Compromising real-world LLM-integrated applications with indirect prompt injection." AISec 2023.
- [BadAgent] Wang et al., "BadAgent: Inserting and activating backdoor attacks in LLM agents." ACL 2024.
- [AgentPoison] Chen et al., "AgentPoison: Red-teaming LLM agents via poisoning memory or knowledge bases." 2024.
- [ToolHijacker] Shi et al., "Prompt injection attack to tool selection in LLM agents." NDSS 2026.
- [ClawWorm] Wei et al., "Self-propagating attacks across LLM agent ecosystems." 2026.
- [MINJA] Dong et al., "Memory injection attacks on LLM agents via query-only interaction." NeurIPS 2025.

### 安全防御
- [ToolSafe] Mou et al., "ToolSafe: Enhancing tool invocation safety of LLM-based agents." 2026.
- [GuardAgent] Xiang et al., "GuardAgent: Safeguard LLM agents via knowledge-enabled reasoning." ICML 2025.
- [CaMeL] Debenedetti et al., "CaMeL: Capability-aware information flow control." 2025.
- [DRIFT] Li et al., "DRIFT: Dynamic runtime information flow tracking." 2025.

### Benchmark和评估
- [ToolEmu] Ruan et al., "ToolEmu: Identifying risks of LM agents with an LM-emulated sandbox." NeurIPS 2024.
- [InjecAgent] Zhan et al., "InjecAgent: Benchmarking indirect prompt injections in tool-integrated LLM agents." ACL 2024.
- [AgentDojo] Debenedetti et al., "AgentDojo: A dynamic evaluation framework." 2024.
- [AgentHarm] Andriushchenko et al., "AgentHarm: A benchmark for measuring harmfulness of LLM agents." 2024.
- [ASB] Zhang et al., "Agent Security Bench (ASB)." ICLR 2025.
- [MCPSecBench] Yang et al., "MCPSecBench: A systematic security benchmark for MCP." 2026.
- [OSWorld] Xie et al., "OSWorld: Benchmarking multimodal agents for open-ended tasks." NeurIPS 2024.

### 综述论文
- [Trustworthy LLM Agents Survey] Yu et al., "A survey on trustworthy LLM agents: Threats and countermeasures." KDD 2025.
- [Full Stack Safety Survey] Wang et al., "A comprehensive survey in LLM(-agent) full stack safety." 2025.
- [JARVIS or Ultron] "A survey on safety and security threats of computer-using agents." 2025.
- [MCP Security SoK] "A first look at the security issues in the MCP ecosystem." 2025.

---

## 研究趋势与展望

### 当前热点
1. **MCP安全**: 随着MCP成为Agent工具连接的标准协议，其安全性研究正快速增长
2. **Computer Use Agent安全**: CUAs带来新的攻击面（视觉欺骗、UI操控等）
3. **多Agent系统安全**: Agent间信任和通信安全成为关键问题
4. **自传播攻击**: Agent生态系统中蠕虫式攻击的可行性已被证实
5. **记忆层安全**: 长期记忆的安全防护成为新的研究焦点

### 未来方向
1. **形式化安全验证**: 为Agent的工具使用提供可验证的安全保证（如Doshi et al., 2026的类型系统方法）
2. **运行时安全监控**: 从静态防护转向动态、细粒度的运行时监控
3. **跨Agent安全协议**: 为多Agent协作设计安全通信和信任建立协议
4. **生态级安全防护**: 从单个Agent安全扩展到整个Agent生态系统的安全
5. **人类在环安全**: 设计不可绕过的人类监督和确认机制

---

*本文档基于14次独立搜索，覆盖arXiv、NeurIPS、ICML、ICLR、ACL、KDD、NDSS等顶会论文，系统整理了LLM Agent安全与防御领域的研究进展。*
