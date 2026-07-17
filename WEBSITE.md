# 网站部署指南

本指南说明如何将你的学习笔记部署为 GitHub Pages 静态网站。

## 技术栈

- **[MkDocs](https://www.mkdocs.org/)**：静态网站生成器
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)**：现代化文档主题
- **GitHub Actions**：自动构建与部署

## 本地预览

### 1. 安装依赖

```bash
pip install mkdocs-material pymdown-extensions mkdocs-minify-plugin
```

### 2. 同步内容（修改笔记后执行）

如果你修改了原始 Markdown 文件（如 `LLM_safety/llm_safety_sec01.md`），需要同步到 `docs/` 目录：

```bash
python scripts/sync_docs.py
```

> 或者直接手动复制修改后的文件到 `docs/` 对应位置。

### 3. 启动本地服务器

```bash
mkdocs serve
```

打开浏览器访问 http://127.0.0.1:8000 即可预览。

### 4. 构建静态站点

```bash
mkdocs build
```

构建结果输出到 `site/` 目录。

## 部署到 GitHub Pages

### 方法一：自动部署（推荐）

1. **推送代码到 GitHub**

   确保以下文件已提交到仓库：
   ```
   mkdocs.yml
   docs/
   .github/workflows/ci.yml
   scripts/sync_docs.py
   ```

2. **启用 GitHub Pages**

   - 打开仓库的 **Settings > Pages**
   - **Source** 选择 "Deploy from a branch"
   - **Branch** 选择 `gh-pages`，文件夹选择 `/(root)`
   - 点击 Save

3. **触发自动部署**

   每次向 `main` 或 `master` 分支推送代码时，GitHub Actions 会自动构建并部署网站。

   部署完成后，访问 `https://<你的用户名>.github.io/Study_Experience/` 即可查看。

### 方法二：手动部署

```bash
# 确保已配置好 mkdocs.yml 和 docs/
mkdocs gh-deploy --force
```

这会直接将站点推送到 `gh-pages` 分支。

## 目录结构说明

```
Study_Experience/
├── mkdocs.yml              # 网站主配置文件
├── docs/                   # 网站内容源目录
│   ├── index.md            # 网站首页
│   ├── llm_study.md        # LLM 通用学习笔记
│   ├── research_standard.md # 研究规范与标准
│   ├── stylesheets/
│   │   └── extra.css       # 自定义样式
│   ├── javascripts/
│   │   └── mathjax.js      # MathJax 公式渲染配置
│   └── llm_safety/
│       ├── index.md        # LLM 安全专题首页
│       ├── sec01.md ~ sec05.md   # 分章正文
│       ├── complete.md     # 完整合并版
│       ├── outline.md      # 文档大纲
│       ├── plan.md         # 执行计划
│       └── research/       # 原始调研素材
├── scripts/
│   └── sync_docs.py        # 内容同步脚本
└── .github/workflows/
    └── ci.yml              # GitHub Actions 自动部署配置
```

## 更新内容后的操作流程

1. 修改原始 Markdown 文件（保持你原有的写作习惯）
2. 运行 `python scripts/sync_docs.py` 将修改同步到 `docs/`
3. 运行 `mkdocs serve` 本地预览确认无误
4. `git add . && git commit -m "更新笔记内容" && git push`
5. GitHub Actions 会自动完成部署（约 1-2 分钟）

## 自定义配置

### 修改网站标题/描述

编辑 `mkdocs.yml` 中的 `site_name` 和 `site_description`。

### 修改主题颜色

编辑 `mkdocs.yml` 中 `theme.palette` 部分的 `primary` 和 `accent` 值。

可选颜色：`red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `grey`, `blue-grey`, `black`, `white`

### 添加新的页面

1. 在 `docs/` 下创建新的 `.md` 文件
2. 在 `mkdocs.yml` 的 `nav` 部分添加导航项
3. 重新构建或推送即可

### 修改仓库地址

编辑 `mkdocs.yml` 中的 `repo_url` 和 `extra.social` 下的链接，替换为你自己的 GitHub 地址。

## 常见问题

**Q: 公式没有正确渲染？**
A: 本配置已集成 MathJax，支持 `$...$` 和 `$$...$$` 语法。如果个别公式显示异常，检查是否有特殊字符需要转义。

**Q: 图片无法显示？**
A: 你的笔记中使用了 Feishu 图床的外部链接，这些在网站中应该能正常显示。如果失效，需要更新图片链接。

**Q: 搜索不支持中文？**
A: 配置中已启用中文搜索支持（`plugins.search.lang: [zh, en]`）。
