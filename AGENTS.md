# AGENTS.md — Study_Experience

> 个人 LLM 安全研究学习笔记库，MkDocs Material 静态站点，部署到 GitHub Pages。
> 语言：简体中文正文，论文元数据（标题/作者/会议）保留英文。
>
> mimo -s ses_0929c5e34ffeLFSLDjye6mXzo2

---

## 双目录结构：哪些文件在哪里编辑

```
根目录源文件（编辑这里）
  LLM_safety/*.md        LLM 安全笔记
  LLM_safety/research/   原始调研素材
  research_*.md          研究经验三篇
  LLM_study.md           LLM 通用学习
  Things that...md       代码规范（旧文件）

        ↓  python scripts/sync_docs.py

docs/                    ← MkDocs 构建源
  llm_safety/              同步生成，不要直接编辑
  research/                同步生成，不要直接编辑
  llm_study.md             同步生成
  research_standard.md     同步生成
  index.md                 ★ 直接编辑
  llm_safety/index.md      ★ 直接编辑
  research/index.md        ★ 直接编辑
  stylesheets/             ★ 直接编辑
  javascripts/             ★ 直接编辑
```

**规则**：
- 笔记内容 → 编辑 `LLM_safety/` 源文件 → 运行同步脚本。
- 站点首页、分类首页、自定义 CSS/JS → 直接编辑 `docs/` 下对应文件。
- `.docx` 和 `.converted.md` 是派生文件，不要手动编辑。
- `site/` 是 `mkdocs build` 的输出，不要编辑或提交。

---

## 关键命令

```bash
python scripts/sync_docs.py   # 同步笔记到 docs/（每次改内容后必须执行）
mkdocs serve                   # 本地预览 http://127.0.0.1:8000
mkdocs build                   # 构建到 site/

# 后台运行 mkdocs serve（推荐，避免阻塞终端）
Start-Process -FilePath "mkdocs" -ArgumentList "serve" -WindowStyle Hidden

# 依赖安装（首次）
pip install mkdocs-material pymdown-extensions mkdocs-minify-plugin
```

同步脚本自动处理：下载远程图片到 `docs/images/`、移除飞书 CDN 链接、修复行内公式（`$$...$$` → `$...$`）。

---

## 更新流程

1. 编辑 `LLM_safety/` 下源文件
2. `python scripts/sync_docs.py`
3. `mkdocs serve` 确认效果
4. 推送 → GitHub Actions 自动 `mkdocs gh-deploy --force` 到 `gh-pages`

---

## 写作规范

- 术语首次出现给中英文对照：`越狱攻击（Jailbreak Attack）`
- 引用格式：`[^1^]` 上标脚注，对应文末引用列表
- 表格用于横向对比，表头左对齐 `:---`
- 标题层级：`#` 章 → `##` 节 → `###` 论文条目 → `####` 子条目
- 公式：行内 `$...$`，块级 `$$...$$`（MathJax 渲染）

---

## 内容层级

修改流向：`research/*.md` → `sec01..05.md` → `llm_safety_learning_path.agent.final.md` → `outline.md`。结构变更时按此顺序同步。
