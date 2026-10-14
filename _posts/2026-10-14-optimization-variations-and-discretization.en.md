---
title: "From gradients to variations: stationarity, constraints, and discretization"
description: "A common perturbation viewpoint connects zero gradients, Euler–Lagrange equations, KKT conditions, and Galerkin discretization."
categories: [Mathematics and Optimization]
tags: [Optimization, Calculus of Variations, Euler–Lagrange, KKT, Galerkin]
lang: en
permalink: /blog/optimization-variations-and-discretization/
date: 2026-10-14 00:00:00 +0800
math: true
---

In finite-dimensional optimization, we often write $$\nabla f(x)=0$$. In the calculus of variations, we encounter $$\delta\mathcal J/\delta x=0$$ and then the Euler–Lagrange equation. How are these conditions related? Where do the KKT conditions for constrained optimization belong?

A useful starting point is a single operation: **choose a candidate, perturb it in an admissible direction, and calculate the first-order change in the objective.** The candidate may be a vector or an entire function. Changing its space changes how the first-order condition is represented.

This note follows that viewpoint through directional derivatives, first variations, Euler–Lagrange equations, constraint multipliers, and Galerkin discretization.

## 1. Start with the first-order change along admissible perturbations

Suppose a direction $$h$$ is admissible in both signs: $$x+\varepsilon h$$ remains feasible for sufficiently small positive and negative $$\varepsilon$$. If $$x^\star$$ is a local extremum, then

$$
\varepsilon\longmapsto f(x^\star+\varepsilon h)
$$

has a local extremum at zero. Consequently,

$$
Df(x^\star)[h]=0.
$$

Requiring this for every admissible direction gives stationarity. The availability of both signs matters. At the boundary of an inequality constraint, a feasible direction may be one-sided, and the first-order condition need not be an equality.

The reasoning has four steps:

1. Choose the space of candidate objects.
2. Identify the admissible perturbation directions.
3. Calculate the first-order change in the objective.
4. Impose the corresponding first-order optimality condition.

Stationarity is generally a necessary condition for local optimality. Establishing a minimum requires additional information, such as convexity or second-order conditions.

## 2. Why finite-dimensional optimization gives a zero gradient

Consider a differentiable, unconstrained problem

$$
\min_{x\in\mathbb R^n} f(x).
$$

For an arbitrary direction $$h\in\mathbb R^n$$, define

$$
Df(x)[h]
=
\left.
\frac{\mathrm d}{\mathrm d\varepsilon}
f(x+\varepsilon h)
\right|_{\varepsilon=0}.
$$

Under the Euclidean inner product,

$$
Df(x)[h]=\nabla f(x)^\top h.
$$

At a local minimum $$x^\star$$,

$$
\nabla f(x^\star)^\top h=0,
\qquad \forall h\in\mathbb R^n.
$$

Choosing $$h=\nabla f(x^\star)$$ yields

$$
\|\nabla f(x^\star)\|^2=0,
\qquad
\boxed{\nabla f(x^\star)=0}.
$$

The more fundamental statement is **$$Df(x^\star)=0$$**. The derivative is a linear functional acting on a direction; the gradient is its vector representation under an inner product.

## 3. Variational problems optimize an entire function

Now let the candidate be an entire function $$x(\cdot)$$, and let the objective be a functional

$$
\mathcal J[x]\in\mathbb R.
$$

Three symbols play different roles:

| Symbol | Meaning |
| --- | --- |
| $$t$$ | An independent coordinate within the function, often time or position |
| $$x(t)$$ | The function's value at that coordinate |
| $$x(\cdot)$$ | The entire function, viewed as one candidate object |

Let $$\mathcal A$$ be the admissible set and $$V$$ the linear space of allowed perturbations. Start with the affine setting

$$
\mathcal A=x_b+V.
$$

The fixed feasible function $$x_b$$ can carry nonzero boundary values, while perturbations $$\eta\in V$$ preserve the boundary conditions. For $$x\in\mathcal A$$, write

$$
x_\varepsilon(t)=x(t)+\varepsilon\eta(t).
$$

Assuming Fréchet differentiability with respect to these perturbations, the first variation is

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

The first-order condition at a local extremum is

$$
\boxed{
D\mathcal J[x^\star][\eta]=0,
\qquad \forall\eta\in V.
}
$$

Its structure is the same as $$Df(x^\star)[h]=0$$ in finite dimensions.

### A first variation is not the same object as a functional derivative

The initial object is

$$
D\mathcal J[x]\in V^*,
$$

a continuous linear functional on the perturbation space. If $$V$$ is a Hilbert space, the Riesz representation gives a gradient satisfying

$$
D\mathcal J[x][\eta]
=
\langle\operatorname{grad}_V\mathcal J[x],\eta\rangle_V.
$$

The gradient depends on the inner product. The statement that the derivative is zero does not depend on how that derivative is represented.

For the common $$L^2$$ pairing, suppose there is a function $$g\in L^2$$ such that

$$
D\mathcal J[x][\eta]
=
\int_{t_0}^{t_1}g(t)\eta(t)\,\mathrm dt,
\qquad \forall\eta\in V.
$$

We write this representative as

$$
g(t)=\frac{\delta\mathcal J}{\delta x}(t).
$$

If $$V$$ is dense in $$L^2$$, vanishing first variation for every perturbation is equivalent to $$g=0$$ almost everywhere. Smooth, compactly supported perturbations already suffice for this conclusion in a fixed-endpoint problem.

A general function-space derivative need not have an ordinary $$L^2$$ representative. In that case, the derivative acting on perturbations, or its weak form, remains the appropriate object.

## 4. Deriving the Euler–Lagrange equation

Consider the integral functional for a scalar function

$$
\mathcal J[x]
=
\int_{t_0}^{t_1}
\mathcal L\bigl(t,x(t),\dot x(t)\bigr)\,\mathrm dt,
\qquad
\dot x=\frac{\mathrm dx}{\mathrm dt}.
$$

Let $$\mathcal L$$ be $$C^2$$, and fix the endpoints:

$$
x(t_0)=a,\qquad x(t_1)=b.
$$

The problem can be posed over $$C^1$$ functions with these endpoint values. Admissible perturbations satisfy

$$
\eta(t_0)=\eta(t_1)=0.
$$

If the extremal under consideration is additionally $$C^2$$, the classical calculation gives

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

Integrate the term containing $$\dot\eta$$ by parts:

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

The endpoint conditions eliminate the boundary term, leaving

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

This expression must vanish for every admissible perturbation. The fundamental lemma of the calculus of variations therefore gives

$$
\boxed{
\frac{\partial\mathcal L}{\partial x}
-
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right)=0.
}
$$

This is the Euler–Lagrange equation. Multiplying by $$-1$$ gives the equivalent convention

$$
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right)
-
\frac{\partial\mathcal L}{\partial x}=0.
$$

In this smooth, fixed-endpoint setting,

$$
\frac{\delta\mathcal J}{\delta x}
=
\frac{\partial\mathcal L}{\partial x}
-
\frac{\mathrm d}{\mathrm dt}
\left(\frac{\partial\mathcal L}{\partial\dot x}\right).
$$

The Euler–Lagrange equation is thus an explicit form of stationarity for this particular integral functional. With free endpoints, the boundary term must also be considered, producing the corresponding natural boundary conditions.

## 5. What does differentiation with respect to velocity mean?

First write the integrand as an ordinary multivariable function

$$
\mathcal L(t,q,v).
$$

The variables $$t,q,v$$ are independent when taking partial derivatives. Differentiate with respect to the third argument, then substitute $$q=x(t)$$ and $$v=\dot x(t)$$. This is what $$\partial\mathcal L/\partial\dot x$$ denotes.

For example, let the mass $$m>0$$ be constant and take

$$
\mathcal L(x,\dot x)=\frac12m\dot x^2-V(x).
$$

Then

$$
\frac{\partial\mathcal L}{\partial\dot x}=m\dot x,
\qquad
\frac{\partial\mathcal L}{\partial x}=-V'(x).
$$

The Euler–Lagrange equation becomes

$$
m\ddot x+V'(x)=0.
$$

The force associated with the potential is

$$
F(x)=-V'(x),
$$

so this is precisely $$m\ddot x=F(x)$$. The calculation establishes stationarity of the action; whether that stationary path minimizes the action is a separate question.

## 6. Dimension depends on degrees of freedom, and coordinates have different roles

An object written as a function of $$t$$ need not be infinite-dimensional. For example,

$$
V_n=\operatorname{span}\{\phi_1(t),\ldots,\phi_n(t)\},
$$

where the basis functions are linearly independent. Every element has the form

$$
x_n(t)=\sum_{k=1}^n c_k\phi_k(t).
$$

There are only $$n$$ independent coefficients, so $$V_n$$ has dimension $$n$$. All quadratic polynomials

$$
x(t)=c_0+c_1t+c_2t^2
$$

form a three-dimensional function space. Conversely, the sequence space $$\ell^2$$ is infinite-dimensional even though its elements need not be written using a continuous coordinate.

**Dimension is determined by independent degrees of freedom, not by the presence of $$t$$ in the notation.**

The coordinate $$t$$ indexes values within a function. An entire function $$x(\cdot)$$ can be fixed while its values at different coordinates differ, just as a fixed vector may have unequal components.

When the objective contains $$\dot x$$, differentiation also couples neighboring positions:

$$
\dot x(t)\approx
\frac{x(t+\Delta t)-x(t)}{\Delta t}.
$$

To describe the evolution of an optimization process itself, use another parameter, such as $$\tau$$. When an $$L^2$$ gradient exists and the evolution is meaningful, the formal gradient flow is

$$
\frac{\partial x_\tau(t)}{\partial\tau}
=
-
\frac{\delta\mathcal J}{\delta x}[x_\tau](t).
$$

Here $$t$$ is an internal coordinate of the candidate, while $$\tau$$ parametrizes the optimization process. Changing the inner product used to represent the gradient changes the descent direction.

## 7. Where KKT and function-space multipliers belong

Unconstrained finite-dimensional problems lead to gradient stationarity, and unconstrained variational problems lead to vanishing first variation. Constraints add feasibility conditions and dual variables to the first-order system.

### Finite-dimensional constraints and KKT

Consider

$$
\min_x f(x),
\qquad
g_i(x)\leq 0,\quad h_j(x)=0.
$$

Its Lagrangian is

$$
\mathscr L(x,\lambda,\nu)
=
f(x)+\sum_i\lambda_i g_i(x)+\sum_j\nu_j h_j(x).
$$

Under an appropriate constraint qualification, a local minimum satisfies the KKT conditions:

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

They express stationarity, primal feasibility, dual feasibility, and complementary slackness.

### Why a dynamic constraint introduces an adjoint function

Function-space problems also admit constraint multipliers. Finitely many scalar constraints have scalar multipliers; an operator constraint has a multiplier in the dual of its constraint-value space. For familiar smooth dynamic constraints, this multiplier appears as a time-dependent adjoint function.

Consider a fixed terminal time $$T$$, a fixed initial state $$x(0)=x_0$$, and a free terminal state:

$$
\min_{x(\cdot),u(\cdot)}
\Phi(x(T))+\int_0^T L(x,u,t)\,\mathrm dt,
\qquad
\dot x=F(x,u,t).
$$

Introduce $$\lambda(t)$$ and form

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

Using a minimization convention, define the Hamiltonian

$$
H(x,u,\lambda,t)=L(x,u,t)+\lambda^\top F(x,u,t).
$$

In the smooth, normal case with an interior control, stationarity with respect to $$\lambda,x,u$$ gives

$$
\boxed{
\dot x=H_\lambda=F,\qquad
\dot\lambda=-H_x,\qquad
H_u=0.
}
$$

Variation of $$x$$ also produces a terminal term. Because $$x(T)$$ is free, it yields

$$
\boxed{\lambda(T)=\nabla\Phi(x(T)).}
$$

This calculation shows the origin of the state equation, adjoint equation, and interior-control stationarity condition. With a constrained control set, the control condition must be adjusted; $$H_u=0$$ is not universal. The full Pontryagin principle also treats extrema over the control set and normal or abnormal multipliers.

The relationship is therefore: **Euler–Lagrange expands stationarity for an integral functional; KKT is a first-order multiplier system for constrained optimization.** Function-space multipliers lead further to adjoint variables in optimal control. They share a variational viewpoint, with the relevant object spaces and constraints specified in each case.

## 8. Galerkin connects function-space conditions to coefficient gradients

Choose a finite-dimensional subspace of the perturbation space,

$$
V_n=\operatorname{span}\{\phi_1,\ldots,\phi_n\}\subset V.
$$

For the admissible set $$\mathcal A=x_b+V$$, write

$$
x_n(t)=x_b(t)+\sum_{j=1}^n c_j\phi_j(t).
$$

In a fixed-endpoint problem, $$x_b$$ carries the prescribed endpoint values, and each $$\phi_j$$ vanishes at both endpoints. Varying the coefficients therefore preserves the boundary conditions.

Define the finite-dimensional objective

$$
F_n(c)=\mathcal J\!\left[x_b+\sum_{j=1}^n c_j\phi_j\right].
$$

The chain rule gives

$$
\boxed{
\frac{\partial F_n}{\partial c_i}
=D\mathcal J[x_n][\phi_i].
}
$$

Because the derivative is linear in the perturbation and the basis spans $$V_n$$,

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

This is the Galerkin stationarity condition for the variational problem. The residual first-order action vanishes on the chosen perturbation subspace. The equivalence is exact for each fixed $$V_n$$; convergence of discrete solutions as the space is refined requires additional analysis.

### Coefficient gradients still depend on the inner product

Equivalent stationary conditions do not imply that the Euclidean coefficient gradient equals the expansion coefficients of a function-space gradient.

Define the $$L^2$$ gradient $$g_n$$ on $$V_n$$ by

$$
D\mathcal J[x_n][\eta_n]
=\langle g_n,\eta_n\rangle_{L^2},
\qquad
g_n=\sum_{j=1}^n a_j\phi_j.
$$

Let

$$
M_{ij}=\langle\phi_j,\phi_i\rangle_{L^2}.
$$

Then

$$
(\nabla_c F_n)_i
=\sum_j M_{ij}a_j,
\qquad
\boxed{a=M^{-1}\nabla_c F_n.}
$$

The matrix $$M$$ is the Gram matrix of the basis, commonly called the mass matrix in finite elements. It equals the identity only when the basis is orthonormal under the chosen inner product. This explains how one stationary problem can produce different gradient descent directions.

## 9. Why this common viewpoint is useful

First, the Euler–Lagrange equation becomes something we can derive rather than memorize in isolation. Calculate the first variation and handle the boundary terms. The same procedure extends to higher derivatives and multiple fields.

Second, the connection between weak formulations and numerical methods becomes natural. The first variation initially acts on admissible test functions. Restricting the test space to finitely many basis functions yields a coefficient problem. Finite elements and variational spectral methods often follow this path.

Finally, derivatives, gradients, and multipliers have distinct roles: the derivative describes the objective's first-order response to perturbations, an inner product represents that response as a gradient, and multipliers incorporate constraints into the first-order system.

## 10. A dictionary between the two settings

| Structure | Finite-dimensional optimization | Function-space variations |
| --- | --- | --- |
| Candidate | $$x\in\mathbb R^n$$ | An entire function $$x(\cdot)\in\mathcal A$$ |
| Objective | $$f(x)\in\mathbb R$$ | $$\mathcal J[x]\in\mathbb R$$ |
| Perturbation | $$h\in\mathbb R^n$$ | $$\eta\in V$$ |
| First-order change | $$Df(x)[h]$$ | $$D\mathcal J[x][\eta]$$ |
| Stationarity | $$Df(x)[h]=0$$ for every $$h$$ | $$D\mathcal J[x][\eta]=0$$ for every $$\eta$$ |
| Inner-product representation | Euclidean gradient $$\nabla f$$ | A function-space gradient under the chosen inner product |
| Integral problems | Equations in finitely many variables | A weak form; Euler–Lagrange equations under sufficient smoothness |
| Constraints | KKT multiplier system | Function-space multipliers and adjoint conditions |
| Finite-dimensional approximation | A coefficient vector $$c$$ | $$x_n=x_b+\sum_i c_i\phi_i$$ |

The guiding order is: **identify the optimization object, identify admissible perturbations, then calculate the first-order change.** Zero gradients, Euler–Lagrange equations, KKT conditions, and Galerkin discretization address different parts of this common construction.

## Further reading

- Gilbert Strang, [Calculus of Variations, Section 7.2](https://ocw.mit.edu/courses/18-086-mathematical-methods-for-engineers-ii-spring-2006/e94c05947ed036cd6ad0150102087062_am72.pdf), for first variations and weak and strong forms.
- Stephen Boyd and Lieven Vandenberghe, [Convex Optimization, Section 5.5.3](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf), for KKT conditions and their context.
- Lawrence C. Evans, [An Introduction to Mathematical Optimal Control Theory, Chapter 4](https://math.berkeley.edu/~evans/control.course.pdf), for adjoints, the Pontryagin principle, and transversality conditions. Hamiltonian sign conventions differ across references.
