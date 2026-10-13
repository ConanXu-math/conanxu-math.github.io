---
title: Projects
icon: fas fa-code
order: 1
lang: zh-CN
permalink: /projects/
description: 关于优化算法、形式化数学和 AI 学习工具的公开项目。
---

## 三块 ADMM 的反例

针对第三约束块为单位阵的直接三块 ADMM，公开项目给出两个固定凸二次规划上的非 KKT 周期轨道，以及相应的数学论证和精确验证材料。

周期 66 的结果针对指定初始化；周期 23 的结果进一步描述固定问题上一个局部不变集合内的吸引行为。

[项目仓库](https://github.com/ConanXu-math/identity-slack-admm-cycle-certificate) · [项目导读](/blog/admm-counterexample/) · [论文](https://arxiv.org/abs/2608.14396)

## Adaptive ADMM in Lean

使用 Lean 4 形式化自适应 ADMM 的收敛性分析。公开核心包含相应条件下的收敛定理、类型化策略接口和可复用的参数序列模板。

这些证明依赖各自明确的数学假设，不表示任意自适应策略都自动具有收敛保证。

[项目仓库](https://github.com/ConanXu-math/adaptive_admm)

## VeryMath 智慧教材

一个个人部署的课程学习工作台：一侧阅读教材，另一侧与 AI 交互。围绕章节提问、讲解、出题，并整理思维导图、知识图谱与 LaTeX 课件。

课程资料保存在本机；Agent 的连接与实际处理方式由使用者的部署环境决定。

[项目仓库](https://github.com/ConanXu-math/course-copilot) · [项目导读](/blog/course-copilot/)

---

更多项目见 [GitHub 仓库列表](https://github.com/ConanXu-math?tab=repositories)。
