# Conan Xu · 个人主页与博客

采用 [al-folio](https://github.com/alshedivat/al-folio) 的学术排版，通过 [Polyglot](https://github.com/untra/polyglot) 提供中文与英文页面。首页展示个人介绍与精选研究，博客有独立入口。

- 中文：https://conanxu-math.github.io/
- English：https://conanxu-math.github.io/en/

## 写一篇双语文章

在 `_posts` 下分别创建中文和英文 Markdown 文件。两篇使用**同一个 permalink**，通过 `lang` 区分语言，例如：

中文：`2026-10-14-my-note.zh-CN.md`

```yaml
---
title: "我的笔记"
description: "这篇文章讲什么。"
date: 2026-10-14 09:00:00 +0800
lang: zh-CN
permalink: /blog/my-note/
categories: [数学与优化]
tags: [ADMM]
---
```

英文：`2026-10-14-my-note.en.md`

```yaml
---
title: "My note"
description: "What this article is about."
date: 2026-10-14 09:00:00 +0800
lang: en
permalink: /blog/my-note/
categories: [Mathematics and Optimization]
tags: [ADMM]
---
```

下面分别写各语言的正文。英文地址会自动加上 `/en`，**不要**在英文 `permalink` 中再手动加 `/en`。

两篇正文都支持 Markdown、代码高亮与数学公式。公式可写为行内 `$$x^2$$`，或单独一段 `$$ ... $$`。正文中的站内链接统一写 `/about/`、`/projects/` 等不带语言的路径，英文页面会链接到相应英文地址。

提交到 `codex/personal-homepage` 分支后，GitHub Actions 会构建并发布网站。文章不会自动翻译；缺少对应译文时，Polyglot 会使用中文正文。草稿可设置 `published: false`。

## 修改个人资料

- `_data/profile.yml`：中英文个人介绍与首页研究内容。
- `_data/ui.yml`：中英文导航与栏目名称。
- `_tabs/projects.zh-CN.md` / `_tabs/projects.en.md`：中英文项目介绍。
- `_config.yml`：标题、简介、邮箱、GitHub 账号与主题设置。
- `assets/avatar.png`：头像。

## 主题与双语设置

本站复用 al-folio core 1.0.15 的基础样式与代码高亮样式，保留简洁顶栏、个人介绍、研究条目和独立博客的结构；布局、双语导航、文章目录与搜索按本站内容调整。未引入模板中的演示文章、分析统计、评论、图片处理或自动升级功能。

文章的旧地址继续有效，`/about/` 会转到首页。明暗主题跟随系统，也可以通过顶栏切换；搜索与 RSS 跟随当前语言。

GitHub Pages 的发布来源使用 **GitHub Actions**。发布流程位于 `.github/workflows/pages-deploy.yml`，不需要在电脑上安装 Ruby 才能写文章。

如需本地预览，安装 Ruby 3.4 后执行 `bundle install`，然后运行 `bundle exec jekyll serve`。

## 内容与许可

个人介绍来自 [GitHub 公开资料](https://github.com/ConanXu-math) 和公开项目。两篇初始文章是建站时整理的项目导读及其译文，每篇保留来源链接。

al-folio 模板样式保留其 MIT 许可，历史 Chirpy 改动的署名也保留在 `LICENSE`。该许可不自动适用于文章、头像及其他个人内容；引用的项目资料按原始来源的许可使用。

尚未准备公开的学习路线与草稿应放在此仓库之外。`published: false` 只控制页面是否显示，不能让已提交到公开仓库的正文变成私人内容。
