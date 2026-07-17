#!/usr/bin/env python3
"""
同步脚本：将原始 Markdown 笔记同步到 docs/ 目录，供 MkDocs 构建使用。

使用方法:
    python scripts/sync_docs.py

这会将以下内容复制到 docs/ 目录：
- LLM_study.md -> docs/llm_study.md（自动添加 H1 标题 + 修复行内公式）
- Things that... -> docs/research_standard.md
- LLM_safety/llm_safety_sec*.md -> docs/llm_safety/sec*.md
- LLM_safety/llm_safety_learning_path.agent.final.md -> docs/llm_safety/complete.md
- LLM_safety/llm_safety_learning_path.agent.outline.md -> docs/llm_safety/outline.md
- LLM_safety/plan.md -> docs/llm_safety/plan.md
- LLM_safety/research/*.md -> docs/llm_safety/research/*.md
"""

import hashlib
import re
import shutil
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

PROJECT_ROOT = Path(__file__).parent.parent
DOCS_DIR = PROJECT_ROOT / "docs"

# 定义文件映射关系：(源文件相对路径, 目标文件相对路径, 是否添加H1标题, H1标题内容, 是否修复公式)
FILE_MAPPINGS = [
    ("LLM_study.md", "llm_study.md", True, "LLM 通用学习笔记", True),
    ("Things that You Should Follow to Save Everyone's Time (Esp. Yours).md", "research_standard.md", False, None, False),
    ("research_how_to_read.md", "research/how_to_read.md", False, None, False),
    ("research_code_standard.md", "research/code_standard.md", False, None, False),
    ("research_how_to_write.md", "research/how_to_write.md", False, None, False),
    ("LLM_safety/llm_safety_sec01.md", "llm_safety/sec01.md", False, None, False),
    ("LLM_safety/llm_safety_sec02.md", "llm_safety/sec02.md", False, None, False),
    ("LLM_safety/llm_safety_sec03.md", "llm_safety/sec03.md", False, None, False),
    ("LLM_safety/llm_safety_sec04.md", "llm_safety/sec04.md", False, None, False),
    ("LLM_safety/llm_safety_sec05.md", "llm_safety/sec05.md", False, None, False),
    ("LLM_safety/llm_safety_learning_path.agent.final.md", "llm_safety/complete.md", False, None, False),
    ("LLM_safety/llm_safety_learning_path.agent.outline.md", "llm_safety/outline.md", False, None, False),
    ("LLM_safety/plan.md", "llm_safety/plan.md", False, None, False),
    ("LLM_safety/research/llm_safety_wide01_jailbreak.md", "llm_safety/research/wide01_jailbreak.md", False, None, False),
    ("LLM_safety/research/llm_safety_wide02_backdoor.md", "llm_safety/research/wide02_backdoor.md", False, None, False),
    ("LLM_safety/research/llm_safety_wide03_prompt_injection.md", "llm_safety/research/wide03_prompt_injection.md", False, None, False),
    ("LLM_safety/research/llm_safety_wide04_agent.md", "llm_safety/research/wide04_agent.md", False, None, False),
]


def fix_images(content: str, doc_rel_path: str) -> str:
    """
    修复图片链接：
    1. 清除无意义的 alt 文本 'img'（避免图片加载失败时页面显示难看的 'img' 文字）。
    2. 尝试将远程图片下载到本地 docs/images/ 目录，成功后替换为本地相对路径。
    对于飞书 CDN 等需要认证的图片，下载会失败，但至少 alt 文本会被清理。
    """
    images_dir = DOCS_DIR / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    def replace_image(match):
        alt_text = match.group(1)
        url = match.group(2)

        # 1. 清除无意义的 alt 文本
        if alt_text.strip().lower() == "img":
            alt_text = ""

        # 2. 尝试下载远程图片到本地（仅处理 http/https 链接）
        if url.startswith("http://") or url.startswith("https://"):
            # 飞书 CDN 链接在外部无法访问（需要认证），直接移除
            if "my.feishu.cn" in url or "feishu.cn" in url:
                print(f"    [IMG] 飞书图片（已移除）: {url[:60]}...")
                return ""

            # 生成基于 URL hash 的唯一文件名
            url_hash = hashlib.md5(url.encode("utf-8")).hexdigest()[:12]
            # 尝试从 URL 推断扩展名
            parsed = urlparse(url)
            path = parsed.path
            ext = Path(path).suffix
            if not ext or len(ext) > 5:
                ext = ".img"  # 未知扩展名，后续根据内容修正
            local_name = f"{url_hash}{ext}"
            local_path = images_dir / local_name

            if not local_path.exists():
                try:
                    req = urllib.request.Request(
                        url,
                        headers={
                            "User-Agent": (
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                                "AppleWebKit/537.36 (KHTML, like Gecko) "
                                "Chrome/120.0.0.0 Safari/537.36"
                            ),
                            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
                        },
                    )
                    with urllib.request.urlopen(req, timeout=15) as resp:
                        data = resp.read()
                        # 根据内容修正扩展名（如果是未知扩展名）
                        if ext == ".img":
                            magic = data[:8]
                            if magic[:4] == b"\x89PNG":
                                local_name = f"{url_hash}.png"
                            elif magic[:2] == b"\xff\xd8":
                                local_name = f"{url_hash}.jpg"
                            elif magic[:4] == b"GIF8":
                                local_name = f"{url_hash}.gif"
                            elif magic[:4] == b"RIFF" and magic[8:12] == b"WEBP":
                                local_name = f"{url_hash}.webp"
                            else:
                                local_name = f"{url_hash}.png"
                            local_path = images_dir / local_name
                        local_path.write_bytes(data)
                        print(f"    [IMG] 已下载: {url[:60]}... -> images/{local_name}")
                except Exception as e:
                    # 下载失败，转为文字链接展示（避免破碎图片框）
                    print(f"    [IMG] 下载失败（转为链接）: {url[:60]}... ({e})")
                    return f"[🔗 图片链接]({url})"

            # 计算从当前文档到 images/ 的相对路径
            doc_depth = len(Path(doc_rel_path).parent.parts)
            rel_prefix = "../" * doc_depth if doc_depth > 0 else ""
            return f"![{alt_text}]({rel_prefix}images/{local_name})"

        # 本地链接或其他，保持原样（仅清理 alt）
        return f"![{alt_text}]({url})"

    # 匹配 Markdown 图片语法: ![alt](url)
    return re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", replace_image, content)


def fix_inline_math(content: str) -> str:
    """
    将行内的 $$...$$ 替换为 $...$，使 pymdownx.arithmatex 能正确处理。
    真正的块级公式（独占一行，去掉缩进后以 $$ 开头和结尾）保持不变。
    """
    lines = content.split("\n")
    result = []
    for line in lines:
        stripped = line.strip()
        # 如果整行（去掉缩进）以 $$ 开头并以 $$ 结尾，视为块级公式，保持原样
        if stripped.startswith("$$") and stripped.endswith("$$"):
            result.append(line)
            continue
        # 否则，将行内的所有 $$...$$ 替换为 $...$
        # 使用非贪婪匹配，并去除内部首尾的多余空格
        new_line = re.sub(
            r"\$\$(.+?)\$\$",
            lambda m: f"${m.group(1).strip()}$",
            line
        )
        result.append(new_line)
    return "\n".join(result)


def sync():
    print("[SYNC] 开始同步笔记到 docs/ 目录...")

    for src_rel, dst_rel, add_h1, h1_title, fix_math in FILE_MAPPINGS:
        src = PROJECT_ROOT / src_rel
        dst = DOCS_DIR / dst_rel

        if not src.exists():
            print(f"  [WARN] 源文件不存在，跳过: {src_rel}")
            continue

        # 确保目标目录存在
        dst.parent.mkdir(parents=True, exist_ok=True)

        content = src.read_text(encoding="utf-8")

        # 始终处理图片（清理 alt + 尝试下载）
        content = fix_images(content, dst_rel)

        if fix_math:
            content = fix_inline_math(content)
            print(f"  [OK] 已同步（修复公式+图片）: {src_rel} -> {dst_rel}")
        elif add_h1:
            # 简单检查是否已经有 H1 标题
            if not content.strip().startswith("# "):
                content = f"# {h1_title}\n\n{content}"
                print(f"  [OK] 已同步（添加标题+图片）: {src_rel} -> {dst_rel}")
            else:
                print(f"  [OK] 已同步（修复图片）: {src_rel} -> {dst_rel}")
        else:
            print(f"  [OK] 已同步（修复图片）: {src_rel} -> {dst_rel}")

        dst.write_text(content, encoding="utf-8")

    print("\n[SYNC] 同步完成！可以运行 `mkdocs serve` 本地预览或 `mkdocs build` 构建。")


if __name__ == "__main__":
    sync()
