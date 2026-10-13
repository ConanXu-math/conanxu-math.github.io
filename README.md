# Conan Xu · 个人主页与博客

采用 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 原版主题，通过 [Polyglot](https://github.com/untra/polyglot) 提供中文与英文页面。

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

- `_tabs/about.zh-CN.md` / `_tabs/about.en.md`：中英文个人介绍。
- `_tabs/projects.zh-CN.md` / `_tabs/projects.en.md`：中英文项目介绍。
- `_config.yml`：标题、简介、邮箱、GitHub 账号与主题设置。
- `assets/avatar.png`：头像。

## 主题与双语设置

布局、文章目录、深浅色模式、归档、分类与标签使用 Chirpy 主题提供的实现。本站仅增加语言切换入口，并让搜索数据和 RSS 跟随当前语言。

GitHub Pages 的发布来源使用 **GitHub Actions**。发布流程位于 `.github/workflows/pages-deploy.yml`，不需要在电脑上安装 Ruby 才能写文章。

如需本地预览，安装 Ruby 3.4 后执行 `bundle install`，然后运行 `bundle exec jekyll serve`。

## 内容与许可

个人介绍来自 [GitHub 公开资料](https://github.com/ConanXu-math) 和公开项目。两篇初始文章是建站时整理的项目导读及其译文，每篇保留来源链接。

Chirpy 模板代码保留其 MIT 许可，见 `LICENSE`。该许可不自动适用于文章、头像及其他个人内容；引用的项目资料按原始来源的许可使用。
