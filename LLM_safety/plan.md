# LLM Safety 学习路线调研计划

## 目标
为用户生成一份全面的 LLM Safety 学习路线文档，涵盖四大方向：
1. 越狱攻击与防御 (Jailbreak Attacks & Defenses)
2. 后门攻击与防御 (Backdoor Attacks & Defenses)
3. 提示注入攻击与防御 (Prompt Injection Attacks & Defenses)
4. Agent 安全与防御 (Agent Safety & Defenses)

每个方向包含：
- 3-5 篇经典论文
- 3-5 篇最新发表论文
- 详细学习笔记（概念、理论、方法）

## 执行阶段

### Stage 1: 深度研究（Deep Research Swarm）
- 加载 `deep-research-swarm` 技能
- 部署多个研究子代理，每个方向一个研究组
- 每个研究组负责：
  - 搜索该方向的经典/奠基性论文
  - 搜索该方向的最新（2024-2025）论文
  - 调研核心概念、理论框架、方法论
- 输出：四个方向的研究简报

### Stage 2: 报告撰写（Report Writing）
- 加载 `report-writing` 技能
- 基于 Stage 1 的研究结果，撰写结构化学习路线文档
- 包含论文推荐、学习笔记、概念解释
- 输出：Markdown 格式的完整报告

### Stage 3: 文档格式化（DOCX）
- 加载 `docx` 技能
- 将 Markdown 报告转换为专业排版的 Word 文档
- 输出：.docx 文件

## 研究代理分配
- 研究员_越狱：负责 Jailbreak Attacks & Defenses
- 研究员_后门：负责 Backdoor Attacks & Defenses
- 研究员_提示注入：负责 Prompt Injection Attacks & Defenses
- 研究员_Agent：负责 Agent Safety & Defenses
