---
title: "从梯度到变分：一阶条件、约束与离散化"
description: "从允许扰动出发，理解梯度为零、Euler–Lagrange 方程、KKT 与 Galerkin 离散化之间的关系。"
categories: [数学与优化]
tags: [优化, 变分法, Euler–Lagrange, KKT, Galerkin]
lang: zh-CN
permalink: /blog/optimization-variations-and-discretization/
date: 2026-10-14 00:00:00 +0800
math: true
---

在有限维优化中，我们经常写下 $$\nabla f(x)=0$$。到了变分法，条件变成 $$\delta\mathcal J/\delta x=0$$，随后又出现 Euler–Lagrange 方程。它们究竟是什么关系？约束优化中的 KKT 条件又该放在哪里？

理解这几个对象，可以从同一个动作开始：**选定一个候选对象，沿允许的方向作小扰动，再看目标的一阶变化。** 候选对象可以是向量，也可以是一整条函数。对象空间改变了，一阶条件的表达方式也随之改变。

这篇笔记沿着这条主线，把方向导数、第一变分、Euler–Lagrange、约束乘子和 Galerkin 离散化连接起来。

## 1. 共同起点是允许扰动的一阶变化

设一个扰动方向为 $$h$$，并且对正负足够小的 $$\varepsilon$$，$$x+\varepsilon h$$ 都是允许的候选对象。如果 $$x^\star$$ 是局部极值点，那么一元函数

$$
\varepsilon\longmapsto f(x^\star+\varepsilon h)
$$

在 $$\varepsilon=0$$ 处也取得局部极值。因此它的导数为零：

$$
Df(x^\star)[h]=0.
$$

当这个结论对所有允许方向成立时，就得到驻点条件。这里的“正负扰动都允许”很关键：在不等式约束的边界上，可行方向可能只有一侧，一阶条件就不一定是等式。

整条推导可以按四步理解：

1. 选定候选对象所在的空间。
2. 明确允许的扰动方向。
3. 计算目标的一阶变化。
4. 要求该变化满足相应的一阶最优性条件。

驻点条件通常是局部最优的必要条件。要进一步判定最小值，还需要凸性、二阶条件等信息。

## 2. 有限维优化为什么得到梯度为零

考虑可微的无约束问题

$$
\min_{x\in\mathbb R^n} f(x).
$$

对任意 $$h\in\mathbb R^n$$，定义

$$
Df(x)[h]
=
\left.
\frac{\mathrm d}{\mathrm d\varepsilon}
f(x+\varepsilon h)
\right|_{\varepsilon=0}.
$$

在欧氏内积下，导数可以写成

$$
Df(x)[h]=\nabla f(x)^\top h.
$$

如果 $$x^\star$$ 是局部极小点，那么

$$
\nabla f(x^\star)^\top h=0,
\qquad \forall h\in\mathbb R^n.
$$

取 $$h=\nabla f(x^\star)$$，便得到

$$
\|\nabla f(x^\star)\|^2=0,
\qquad
\boxed{\nabla f(x^\star)=0}.
$$

比“梯度为零”更基本的说法是 **$$Df(x^\star)=0$$**。导数 $$Df(x)$$ 是作用在方向 $$h$$ 上的线性泛函；梯度则是借助内积对这个泛函作出的向量表示。

## 3. 变分法把优化对象换成整个函数

现在让候选对象是一整条函数 $$x(\cdot)$$，目标是一个泛函：

$$
\mathcal J[x]\in\mathbb R.
$$

这时需要区分三个符号：

| 符号 | 含义 |
| --- | --- |
| $$t$$ | 函数内部的独立坐标，常表示时间或空间位置 |
| $$x(t)$$ | 函数在位置 $$t$$ 的取值 |
| $$x(\cdot)$$ | 作为整体的函数，即优化问题的一个候选对象 |

令 $$\mathcal A$$ 表示候选函数集合，$$V$$ 表示允许扰动的线性空间。先考虑仿射形式

$$
\mathcal A=x_b+V.
$$

这里 $$x_b$$ 是一个固定的可行函数。它可以承担非零边界值，而扰动 $$\eta\in V$$ 保持边界条件。对 $$x\in\mathcal A$$ 作扰动：

$$
x_\varepsilon(t)=x(t)+\varepsilon\eta(t).
$$

假设 $$\mathcal J$$ 对这些扰动 Fréchet 可微，其第一变分为

$$
\delta\mathcal J[x;\eta]
:=
D\mathcal J[x][\eta]
=
\left.
\frac{\mathrm d}{\mathrm d\varepsilon}
\mathcal J[x+\varepsilon\eta]
\right|_{\varepsilon=0}.
$$

局部极值点的一阶条件是

$$
\boxed{
D\mathcal J[x^\star][\eta]=0,
\qquad \forall\eta\in V.
}
$$

它与有限维的 $$Df(x^\star)[h]=0$$ 具有相同结构。

### 第一变分与泛函导数的区别

首先得到的对象是

$$
D\mathcal J[x]\in V^*,
$$

即扰动空间上的连续线性泛函。如果 $$V$$ 是 Hilbert 空间，Riesz 表示给出相应的梯度：

$$
D\mathcal J[x][\eta]
=
\langle\operatorname{grad}_V\mathcal J[x],\eta\rangle_V.
$$

梯度因此依赖所选内积，而零导数这个驻点条件不依赖它的表示方式。

在常见的 $$L^2$$ 配对下，如果存在 $$g\in L^2$$ 满足

$$
D\mathcal J[x][\eta]
=
\int_{t_0}^{t_1}g(t)\eta(t)\,\mathrm dt,
\qquad \forall\eta\in V,
$$

就把这个代表函数记作

$$
g(t)=\frac{\delta\mathcal J}{\delta x}(t).
$$

当 $$V$$ 在 $$L^2$$ 中稠密时，对所有扰动第一变分为零便等价于 $$g=0$$ 几乎处处。固定端点问题中的光滑、紧支撑扰动就足以作出这样的判断。

一般的函数空间导数未必能由一个普通的 $$L^2$$ 函数表示。遇到这种情况，可以继续使用 $$D\mathcal J[x][\eta]$$ 或弱形式。

## 4. 从第一变分推导 Euler–Lagrange 方程

考虑标量函数的积分型泛函

$$
\mathcal J[x]
=
\int_{t_0}^{t_1}
\mathcal L\bigl(t,x(t),\dot x(t)\bigr)\,\mathrm dt,
\qquad
\dot x=\frac{\mathrm dx}{\mathrm dt}.
$$

设 $$\mathcal L$$ 为 $$C^2$$，端点固定：

$$
x(t_0)=a,\qquad x(t_1)=b.
$$

可以在满足这些端点条件的 $$C^1$$ 函数中考虑极值问题。允许的扰动满足

$$
\eta(t_0)=\eta(t_1)=0.
$$

若所讨论的极值函数进一步属于 $$C^2$$，可以进行下面的经典推导：

$$
\begin{aligned}
\delta\mathcal J[x;\eta]
&=
\left.
\frac{\mathrm d}{\mathrm d\varepsilon}
\int_{t_0}^{t_1}
\mathcal L(t,x+\varepsilon\eta,\dot x+\varepsilon\dot\eta)
\,\mathrm dt
\right|_{\varepsilon=0}
\\
&=
\int_{t_0}^{t_1}
\left(
\frac{\partial\mathcal L}{\partial x}\eta
+
\frac{\partial\mathcal L}{\partial\dot x}\dot\eta
\right)\,\mathrm dt.
\end{aligned}
$$

对含有 $$\dot\eta$$ 的项分部积分：

$$
\begin{aligned}
\int_{t_0}^{t_1}
\frac{\partial\mathcal L}{\partial\dot x}\dot\eta\,\mathrm dt
&=
\left[
\frac{\partial\mathcal L}{\partial\dot x}\eta
\right]_{t_0}^{t_1}
\\
&\quad-
\int_{t_0}^{t_1}
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right)
\eta\,\mathrm dt.
\end{aligned}
$$

固定端点使边界项消失，于是

$$
\delta\mathcal J[x;\eta]
=
\int_{t_0}^{t_1}
\left[
\frac{\partial\mathcal L}{\partial x}
-
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right)
\right]\eta\,\mathrm dt.
$$

该式必须对所有允许的扰动为零。由变分基本引理，

$$
\boxed{
\frac{\partial\mathcal L}{\partial x}
-
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right)=0.
}
$$

这就是 Euler–Lagrange 方程。整体乘以 $$-1$$，也可以写成常见的

$$
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right)
-
\frac{\partial\mathcal L}{\partial x}=0.
$$

在上述光滑、固定端点的设定下，

$$
\frac{\delta\mathcal J}{\delta x}
=
\frac{\partial\mathcal L}{\partial x}
-
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right).
$$

因此，Euler–Lagrange 是这个积分型泛函的驻点条件的具体展开。若端点可变，分部积分产生的边界项就要一起处理，并给出相应的自然边界条件。

## 5. 对速度求偏导是什么意思

把积分密度先写成一个普通的多元函数

$$
\mathcal L(t,q,v).
$$

求偏导时，$$t,q,v$$ 是独立自变量。先对第三个变量 $$v$$ 求偏导，再代入 $$q=x(t)$$、$$v=\dot x(t)$$，就得到 $$\partial\mathcal L/\partial\dot x$$。

例如，质量 $$m>0$$ 为常数，取力学中的

$$
\mathcal L(x,\dot x)=\frac12m\dot x^2-V(x).
$$

那么

$$
\frac{\partial\mathcal L}{\partial\dot x}=m\dot x,
\qquad
\frac{\partial\mathcal L}{\partial x}=-V'(x).
$$

Euler–Lagrange 方程给出

$$
m\ddot x+V'(x)=0.
$$

势能对应的力为

$$
F(x)=-V'(x),
$$

所以它正是 $$m\ddot x=F(x)$$。这里导出的是作用量的驻点方程；驻点是否为最小值还要另外判断。

## 6. 维数取决于自由度，坐标的角色也要分清

对象写成函数、带有 $$t$$，并不意味着它一定是无限维的。例如

$$
V_n=\operatorname{span}\{\phi_1(t),\ldots,\phi_n(t)\},
$$

其中基函数线性无关。任意元素都可写成

$$
x_n(t)=\sum_{k=1}^n c_k\phi_k(t).
$$

自由变量只有 $$n$$ 个系数，所以 $$V_n$$ 是 $$n$$ 维空间。所有二次多项式

$$
x(t)=c_0+c_1t+c_2t^2
$$

就构成一个三维函数空间。相反，序列空间 $$\ell^2$$ 中的对象虽然没有写出连续变量 $$t$$，仍然是无限维的。

**维数由独立自由度决定，而不是由符号中有没有 $$t$$ 决定。**

坐标 $$t$$ 用来读取函数内部的取值。一个函数 $$x(\cdot)$$ 可以作为整体固定下来，而其不同位置的值 $$x(t)$$ 仍然不同，这与固定向量的不同分量取值不同是同一个道理。

当目标含有 $$\dot x$$ 时，导数还会把相邻位置耦合起来：

$$
\dot x(t)\approx
\frac{x(t+\Delta t)-x(t)}{\Delta t}.
$$

如果还要描述优化过程自身的演化，可以另用参数 $$\tau$$。在 $$L^2$$ 梯度存在、且相应演化有意义时，梯度流形式上写成

$$
\frac{\partial x_\tau(t)}{\partial\tau}
=
-
\frac{\delta\mathcal J}{\delta x}[x_\tau](t).
$$

这里 $$t$$ 是对象内部的坐标，$$\tau$$ 是优化过程的演化参数。改变表示梯度所用的内积，也会改变下降方向。

## 7. KKT 与函数空间乘子的位置

无约束有限维问题和无约束变分问题，分别得到梯度驻点条件和第一变分驻点条件。引入约束以后，还要把可行性及约束的对偶变量纳入一阶系统。

### 有限维约束与 KKT

考虑

$$
\min_x f(x),
\qquad
g_i(x)\leq 0,\quad h_j(x)=0.
$$

对应的 Lagrangian 为

$$
\mathscr L(x,\lambda,\nu)
=
f(x)+\sum_i\lambda_i g_i(x)+\sum_j\nu_j h_j(x).
$$

在适当的约束正则条件下，局部极小点满足 KKT 条件：

$$
\begin{aligned}
\nabla_x\mathscr L(x^\star,\lambda^\star,\nu^\star)&=0,
\\
g_i(x^\star)&\leq 0,
&
h_j(x^\star)&=0,
\\
\lambda_i^\star&\geq 0,
&
\lambda_i^\star g_i(x^\star)&=0.
\end{aligned}
$$

这些条件分别表达驻点性、原始可行性、对偶可行性和互补松弛。

### 动态约束为什么引入伴随函数

函数空间中也可以引入约束乘子。有限个标量约束对应标量乘子；算子约束的乘子属于其约束值空间的对偶。对于常见的光滑动态约束，乘子表现为随时间变化的伴随函数。

考虑固定终止时刻 $$T$$、固定初始状态 $$x(0)=x_0$$、自由终端状态的问题：

$$
\min_{x(\cdot),u(\cdot)}
\Phi(x(T))+\int_0^T L(x,u,t)\,\mathrm dt,
\qquad
\dot x=F(x,u,t).
$$

引入 $$\lambda(t)$$，构造

$$
\begin{aligned}
\mathscr A[x,u,\lambda]
&=
\Phi(x(T))
\\
&\quad+
\int_0^T
\left[L(x,u,t)+\lambda^\top(F(x,u,t)-\dot x)\right]
\,\mathrm dt.
\end{aligned}
$$

使用最小化问题的符号约定，定义

$$
H(x,u,\lambda,t)=L(x,u,t)+\lambda^\top F(x,u,t).
$$

在正常乘子存在、各函数足够光滑、控制取内部值的情形，对 $$\lambda,x,u$$ 分别要求一阶驻点，得到

$$
\boxed{
\dot x=H_\lambda=F,\qquad
\dot\lambda=-H_x,\qquad
H_u=0.
}
$$

对 $$x$$ 的变分还产生终端项。由于 $$x(T)$$ 自由，它给出

$$
\boxed{\lambda(T)=\nabla\Phi(x(T)).}
$$

这展示了最优控制中状态方程、伴随方程和控制驻点条件的来源。若控制受集合约束，控制条件必须相应调整，不能一律使用 $$H_u=0$$；完整的 Pontryagin 原理还要处理控制集合上的极值条件及正常、异常乘子。

因此，两条路线应当这样理解：**Euler–Lagrange 是积分型泛函驻点条件的展开；KKT 是约束优化的一阶乘子系统。** 函数空间乘子进一步通向最优控制中的伴随变量。它们共享一阶变分的思路，但各自需要相应的对象空间与约束条件。

## 8. Galerkin 把函数空间条件连接到系数梯度

选取允许扰动空间中的有限维子空间

$$
V_n=\operatorname{span}\{\phi_1,\ldots,\phi_n\}\subset V.
$$

对于候选集合 $$\mathcal A=x_b+V$$，令

$$
x_n(t)=x_b(t)+\sum_{j=1}^n c_j\phi_j(t).
$$

固定端点问题中，$$x_b$$ 满足端点条件，$$\phi_j$$ 在两端为零。这样，无论系数如何变化，边界条件都保持成立。

定义关于系数的有限维目标

$$
F_n(c)=\mathcal J\!\left[x_b+\sum_{j=1}^n c_j\phi_j\right].
$$

链式法则给出

$$
\boxed{
\frac{\partial F_n}{\partial c_i}
=D\mathcal J[x_n][\phi_i].
}
$$

由于导数对扰动线性，而基函数张成 $$V_n$$，于是

$$
\begin{aligned}
\nabla_c F_n(c)=0
&\Longleftrightarrow
D\mathcal J[x_n][\phi_i]=0,\quad i=1,\ldots,n
\\
&\Longleftrightarrow
D\mathcal J[x_n][\eta_n]=0,\quad \forall\eta_n\in V_n.
\end{aligned}
$$

这就是变分问题的 Galerkin 驻点条件。它要求残余的一阶作用在所选扰动子空间上为零。对每个给定的 $$V_n$$，上述等价关系是精确的；离散解随空间加密是否收敛，则需要另外的分析。

### 系数梯度还受内积影响

即使驻点条件等价，系数的欧氏梯度也不一定就是函数梯度的展开系数。

用 $$L^2$$ 内积定义 $$V_n$$ 上的梯度 $$g_n$$：

$$
D\mathcal J[x_n][\eta_n]
=\langle g_n,\eta_n\rangle_{L^2},
\qquad
g_n=\sum_{j=1}^n a_j\phi_j.
$$

令

$$
M_{ij}=\langle\phi_j,\phi_i\rangle_{L^2}.
$$

那么

$$
(\nabla_c F_n)_i
=\sum_j M_{ij}a_j,
\qquad
\boxed{a=M^{-1}\nabla_c F_n.}
$$

这里 $$M$$ 是基函数的 Gram 矩阵，在有限元中通常称为质量矩阵。只有基函数关于该内积正交归一时，才有 $$M=I$$。这也解释了为什么“同一个驻点问题”可以对应不同的梯度下降方向。

## 9. 把这些语言放在一起的用处

首先，Euler–Lagrange 不必作为一个孤立公式记忆。先计算第一变分，再处理边界项，就能知道方程及边界条件从哪里来；遇到高阶导数或多个场变量，也可以沿同样的思路推导。

其次，弱形式与数值方法之间的联系变得自然。第一变分先作用在允许的测试函数上，再把测试空间限制到有限个基函数，就得到系数问题。有限元和变分型谱方法经常使用这条路径。

最后，导数、梯度和乘子的角色也更清楚：导数描述目标对扰动的一阶响应，内积把它表示成梯度，乘子则把约束纳入一阶系统。

## 10. 一张对应表

| 结构 | 有限维优化 | 函数空间变分 |
| --- | --- | --- |
| 候选对象 | $$x\in\mathbb R^n$$ | 整个函数 $$x(\cdot)\in\mathcal A$$ |
| 目标 | $$f(x)\in\mathbb R$$ | $$\mathcal J[x]\in\mathbb R$$ |
| 允许扰动 | $$h\in\mathbb R^n$$ | $$\eta\in V$$ |
| 一阶变化 | $$Df(x)[h]$$ | $$D\mathcal J[x][\eta]$$ |
| 驻点条件 | 对所有 $$h$$，$$Df(x)[h]=0$$ | 对所有 $$\eta$$，$$D\mathcal J[x][\eta]=0$$ |
| 内积表示 | 欧氏梯度 $$\nabla f$$ | 所选内积下的函数梯度 |
| 积分型问题 | 关于有限个变量的方程 | 弱形式；足够光滑时得到 Euler–Lagrange 方程 |
| 约束处理 | KKT 乘子系统 | 函数空间乘子、伴随条件 |
| 有限维近似 | 系数向量 $$c$$ | $$x_n=x_b+\sum_i c_i\phi_i$$ |

最值得记住的是：**先看优化对象，再看允许扰动，最后看一阶变化。** 梯度为零、Euler–Lagrange、KKT 和 Galerkin，各自回答了这条主线上的不同问题。

## 继续阅读

- Gilbert Strang：[Calculus of Variations，7.2 节](https://ocw.mit.edu/courses/18-086-mathematical-methods-for-engineers-ii-spring-2006/e94c05947ed036cd6ad0150102087062_am72.pdf)，可对照第一变分与弱、强形式。
- Stephen Boyd、Lieven Vandenberghe：[Convex Optimization，5.5.3 节](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf)，讨论 KKT 条件及其适用背景。
- Lawrence C. Evans：[An Introduction to Mathematical Optimal Control Theory，第 4 章](https://math.berkeley.edu/~evans/control.course.pdf)，可继续阅读伴随变量、Pontryagin 原理与横截条件。不同文献的 Hamiltonian 符号约定可能不同。
