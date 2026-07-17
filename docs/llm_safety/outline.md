# LLM Safety 学习路线：从越狱到Agent安全的系统指南

## 1. 越狱攻击与防御 (~4000字, 2张表)
### 1.1 经典论文推荐
#### 1.1.1 Jailbroken: How Does LLM Safety Training Fail? (Wei et al., NeurIPS 2023) - 竞争目标与泛化错配理论
#### 1.1.2 Universal and Transferable Adversarial Attacks on Aligned Language Models/GCG (Zou et al., 2023) - 贪心坐标梯度攻击
#### 1.1.3 AutoDAN: Automatic and Interpretable Adversarial Attacks on LLMs (Liu et al., ICLR 2024) - 遗传算法生成可读攻击
#### 1.1.4 PAIR: Prompt Automatic Iterative Refinement (Chao et al., 2023) - 黑盒LLM迭代攻击
#### 1.1.5 TAP: Tree of Attacks with Pruning (Mehrotra et al., ICLR 2024) - 树状搜索剪枝攻击
### 1.2 最新前沿论文
#### 1.2.1 LatentBreak: Jailbreaking through Latent Space Feedback (NeurIPS 2025) - 潜在空间低困惑度攻击
#### 1.2.2 Reasoned Safety Alignment/ReSA (2025) - 先回答后检查的安全对齐
#### 1.2.3 Safety-Preserving Fine-Tuning/SPF (2026) - 低秩安全子空间梯度投影
#### 1.2.4 OOD Jailbreak: Out-of-Distribution Strategy (2025) - 分布外输入攻击
#### 1.2.5 Jailbreak from Deep Safety Attention Heads (2026) - 注意力头层面攻击
### 1.3 学习笔记：核心概念与理论
#### 1.3.1 Jailbreak定义与四大攻击原理：竞争目标、泛化错配、对抗鲁棒性、混合攻击
#### 1.3.2 攻击方法体系：白盒(GCG/AutoDAN/LatentBreak) vs 黑盒(PAIR/TAP/PAP) vs 基于模板 vs 基于优化
#### 1.3.3 防御方法体系：输入检测(困惑度/Guard Models)、输出过滤(SafeDecoding)、对齐强化(激活引导/对抗训练)、系统级多层防御
#### 1.3.4 关键理论：拒绝向量、安全梯度低秩性、表示空间几何、OOD脆弱性
### 1.4 学习路径建议
#### 1.4.1 入门路线：从手工模板攻击到自动化攻击的理解递进
#### 1.4.2 实验环境推荐：JailbreakBench、AdvBench、HarmBench

## 2. 后门攻击与防御 (~4000字, 2张表)
### 2.1 经典论文推荐
#### 2.1.1 Sleeper Agents: Training Deceptive LLMs that Persist through Safety Training (Hubinger et al., Anthropic, 2024) - 后门持久性研究
#### 2.1.2 BadChain: Backdoor Chain-of-Thought Prompting (Xiang et al., ICLR 2024) - CoT推理后门攻击
#### 2.1.3 ProAttack: Prompt as Triggers for Backdoor Attack (Zhao et al., ACL 2023) - Clean-label提示后门
#### 2.1.4 BadPre: Task-Agnostic Backdoor Attacks to Pre-trained NLP Models (Chen et al., NeurIPS 2021) - 预训练阶段后门
#### 2.1.5 ONION: A Simple and Effective Defense against Textual Backdoor Attacks (Qi et al., EMNLP 2020) - 困惑度防御基线
### 2.2 最新前沿论文
#### 2.2.1 Triggers Hijack Language Circuits: Mechanistic Analysis of Backdoor Behaviors (2026) - 机制可解释性分析
#### 2.2.2 BadStyle: Stealthy Backdoor Attacks Based on Natural Style Triggers (2025) - 自然风格触发器
#### 2.2.3 ConfGuard: Simple and Effective Backdoor Detection (2025) - 轻量级实时检测
#### 2.2.4 DarkMind: Latent Chain-of-Thought Backdoor in Customized LLMs (2025) - 潜在推理链后门
#### 2.2.5 AutoBackdoor: Automating Backdoor Attacks via LLM Agents (2025) - 自动化后门攻击
### 2.3 学习笔记：核心概念与理论
#### 2.3.1 Backdoor定义与形式化：与Data Poisoning的区别、触发器层级分类(character/word/sentence/style/semantic)
#### 2.3.2 攻击方法体系：输入触发器攻击、训练数据投毒、权重操控(PEFT/模型编辑)、Chain-of-Thought劫持
#### 2.3.3 防御方法体系：触发器检测(ONION/ConfGuard)、模型检查(Fine-Pruning/BEAR)、输入净化(回译改写)、对抗训练
#### 2.3.4 关键理论：后门持久性原理(Sleeper Agents)、安全对齐冲突、神经元后门机制(触发器劫持语言回路)
### 2.4 学习路径建议
#### 2.4.1 入门路线：从BadNets到Sleeper Agents的理解递进
#### 2.4.2 实验环境推荐：BackdoorLLM、AgentPoison评估框架

## 3. 提示注入攻击与防御 (~4000字, 2张表)
### 3.1 经典论文推荐
#### 3.1.1 Ignore Previous Prompt: Attack Techniques for Language Models (Perez & Ribeiro, 2022) - 提示注入开山之作
#### 3.1.2 Ignore This Title and HackAPrompt (Schulhoff et al., EMNLP 2023) - 大规模竞赛实证研究
#### 3.1.3 Not What You've Signed Up For: Indirect Prompt Injection (Greshake et al., AISec 2023) - 间接注入奠基
#### 3.1.4 Universal and Transferable Adversarial Attacks/GCG (Zou et al., NeurIPS 2023) - 通用对抗后缀攻击
#### 3.1.5 JailbreakBench (Chao et al., 2024) - 越狱鲁棒性评测基准
### 3.2 最新前沿论文
#### 3.2.1 The Instruction Hierarchy (Wallace et al., OpenAI, 2024) - 指令层次结构防御
#### 3.2.2 AgentDojo: Dynamic Environment for PI Evaluation (Debenedetti et al., NeurIPS 2024) - 智能体动态评测
#### 3.2.3 Defenses Against Prompt Attacks Learn Surface Heuristics (2025) - 防御表面启发式分析
#### 3.2.4 Rennervate: Attention is All You Need to Defend Against IPI (Zhong et al., NDSS 2026) - Token级注意力防御
#### 3.2.5 Prompt Injection Attacks: A Comprehensive Review (Gulyamov et al., 2025) - 最全面系统性综述
### 3.3 学习笔记：核心概念与理论
#### 3.3.1 Prompt Injection定义与分类：直接注入vs间接注入、与Jailbreak的区别、完整分类树
#### 3.3.2 攻击方法体系：Context Ignoring、Delimiter Escape、Fake Completion、Web/Document/RAG注入、工具/插件注入
#### 3.3.3 防御方法体系：输入验证过滤、指令层次结构(Instruction Hierarchy)、提示硬化(Spotlighting/StruQ)、输出监控、系统级纵深防御
#### 3.3.4 关键理论：指令与数据混淆的根本原因、信任边界理论、防御的不可能性定理
### 3.4 学习路径建议
#### 3.4.1 入门路线：从手工注入到自动化注入的递进
#### 3.4.2 实验环境推荐：AgentDojo、BIPIA、HackAPrompt数据集

## 4. Agent安全与防御 (~4000字, 2张表)
### 4.1 经典论文推荐
#### 4.1.1 Not What You've Signed Up For: Indirect Prompt Injection (Greshake et al., AISec 2023) - Agent注入攻击基础
#### 4.1.2 ToolEmu: Identifying Risks of LM Agents (Ruan et al., NeurIPS 2024) - 沙箱仿真评测框架
#### 4.1.3 ReAct: Synergizing Reasoning and Acting (Yao et al., ICLR 2023) - Agent基础架构范式
#### 4.1.4 BadAgent: Backdoor Attacks in LLM Agents (Wang et al., ACL 2024) - Agent后门攻击
#### 4.1.5 AgentPoison: Red-teaming via Poisoning Memory (Chen et al., 2024) - 记忆层攻击
### 4.2 最新前沿论文
#### 4.2.1 Self-Propagating Attacks Across LLM Agent Ecosystems/ClawWorm (Wei et al., 2026) - 自传播蠕虫攻击
#### 4.2.2 A Survey on Trustworthy LLM Agents (Yu et al., KDD 2025) - 最全面Agent安全综述
#### 4.2.3 ToolSafe: Step-level Tool Invocation Safety (Mou et al., 2026) - 步骤级主动防护
#### 4.2.4 ToolHijacker: PI Attack to Tool Selection (Shi et al., NDSS 2026) - 工具选择劫持
#### 4.2.5 MCPSecBench: Security Benchmark for MCP (Yang et al., 2026) - MCP安全基准
### 4.3 学习笔记：核心概念与理论
#### 4.3.1 Agent安全定义与威胁模型：与传统LLM安全的区别、六层攻击面分类、威胁模型要素
#### 4.3.2 攻击方法体系：工具/插件滥用(间接注入/工具劫持/供应链投毒)、记忆层攻击(投毒/RAG后门)、跨Agent攻击(信任利用/蠕虫传播)、环境操控(UI欺骗/CoT暴露)
#### 4.3.3 防御方法体系：权限控制与沙箱(零信任/最小权限)、行为监控(步骤级护栏)、输入/输出过滤、安全对齐(知识启用推理)
#### 4.3.4 关键理论：能力-风险权衡、自主性悖论、工具使用的信任边界、多Agent信任传递问题、MCP安全架构
### 4.4 学习路径建议
#### 4.4.1 入门路线：从ReAct架构理解到攻击面分析
#### 4.4.2 实验环境推荐：AgentDojo、ASB、MCPSecBench、ToolEmu

## 5. 综合学习路线图 (~1500字, 1张表)
### 5.1 整体学习路径规划
#### 5.1.1 第一阶段(基础)：LLM基础+安全对齐(RLHF/DPO) -> 掌握越狱攻击基本原理
#### 5.1.2 第二阶段(深入)：后门攻击+提示注入 -> 理解训练时和推理时攻击
#### 5.1.3 第三阶段(前沿)：Agent安全 -> 理解系统级安全问题
### 5.2 关键资源汇总
#### 5.2.1 顶级会议跟踪列表：NeurIPS/ICML/ICLR/ACL/EMNLP/NDSS/S&P
#### 5.2.2 关键Benchmarks汇总表：跨四个方向的评测工具
#### 5.2.3 推荐阅读优先级排序
