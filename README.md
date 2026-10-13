# Conan Xu 的个人主页与博客

个人介绍、精选项目和 Markdown 博客，由 GitHub Pages 托管。

网站地址：https://conanxu-math.github.io/

## 写一篇新文章

在 GitHub 仓库的 `_posts` 目录中选择 **Add file → Create new file**，文件名使用 `年-月-日-英文短标题.md`，例如 `2026-10-14-my-new-note.md`。

开头填写：

```yaml
---
title: "文章标题"
description: "在列表中显示的一句话介绍。"
category: 数学与优化
tags: [数学, 学习笔记]
reading_time: 5
date: 2026-10-14 09:00:00 +0800
---
```

下面直接写 Markdown 正文，使用 `##` 作为章节标题。文章页的目录会自动收集这些标题。`reading_time` 是预计阅读分钟数，由作者填写。日期在未来的文章会等到日期到达后的下一次网站构建才显示；需要隐藏草稿时，可增加 `published: false`。

将文章提交到默认分支 `codex/personal-homepage` 后，GitHub Pages 会重新构建网站。文章列表和 RSS 会自动更新。

## 修改主页

- `index.html`：首页介绍和精选项目。
- `about/index.html`：完整自我介绍。
- `_config.yml`：站点标题、联系邮箱和 GitHub 链接。
- `assets/avatar.png`：头像。
- `assets/style.css`：版式和颜色。
- `_layouts/post.html`：所有文章共用的阅读页面。

## 发布设置

GitHub 仓库设置中的 **Pages → Build and deployment** 使用 **Deploy from a branch**，分支为 `codex/personal-homepage`，目录为 `/ (root)`。使用 GitHub 自带的 Jekyll 构建，无需自定义发布脚本。

## 内容来源

个人介绍根据 [GitHub 公开资料](https://github.com/ConanXu-math) 和公开项目整理；没有加入未确认的学历、职位或获奖经历。联系邮箱使用公开 GitHub bio 中的学术邮箱。

首批两篇文章为此次建站时根据公开 README 整理的项目导读，并非从既有博客转载。每篇文末保留来源。

- [三块 ADMM 反例](https://github.com/ConanXu-math/identity-slack-admm-cycle-certificate)
- [Adaptive ADMM in Lean](https://github.com/ConanXu-math/adaptive_admm)
- [VeryMath 智慧教材](https://github.com/ConanXu-math/course-copilot)

发布操作与文章格式可参考 [GitHub 官方说明](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-content-to-your-github-pages-site-using-jekyll)。
