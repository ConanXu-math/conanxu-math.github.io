---
title: Projects
icon: fas fa-code
order: 1
lang: en
permalink: /projects/
description: Public projects on optimization, formal mathematics, and AI tools for learning.
---

## Counterexamples for three-block ADMM

For direct three-block ADMM with the identity matrix as its third constraint block, this project provides non-KKT periodic orbits on two fixed convex quadratic programs, together with mathematical arguments and exact verification materials.

The period-66 result concerns a specified initialization. The period-23 result additionally establishes local attraction within an invariant set for one fixed problem.

[Repository](https://github.com/ConanXu-math/identity-slack-admm-cycle-certificate) · [Project introduction](/blog/admm-counterexample/) · [Paper](https://arxiv.org/abs/2608.14396)

## Adaptive ADMM in Lean

A Lean 4 formalization of convergence analysis for adaptive ADMM. Its public core includes convergence theorems under stated conditions, a typed policy interface, and reusable parameter-sequence templates.

Each result depends on its mathematical assumptions; it does not automatically provide convergence guarantees for arbitrary adaptive policies.

[Repository](https://github.com/ConanXu-math/adaptive_admm)

## VeryMath Course Copilot

A personally deployed workspace for studying textbooks: read the book on one side and interact with an AI assistant on the other. It supports chapter-based questions, explanations, exercises, mind maps, knowledge graphs, and LaTeX slides.

Course materials are stored locally. Agent connections and processing depend on the user's chosen deployment and service.

[Repository](https://github.com/ConanXu-math/course-copilot) · [Project introduction](/blog/course-copilot/)

---

More projects are available in my [GitHub repositories](https://github.com/ConanXu-math?tab=repositories).
