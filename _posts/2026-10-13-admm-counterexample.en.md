---
title: "When an iteration comes full circle: counterexamples for three-block ADMM"
description: "An algorithm can keep moving without approaching a solution. Two periodic orbits illustrate how a numerical observation can become a precise mathematical counterexample."
categories: [Mathematics and Optimization]
tags: [ADMM, AI4Math, Optimization]
lang: en
permalink: /blog/admm-counterexample/
date: 2026-10-13 00:00:00 +0800
---

Some failures of iterative algorithms are easy to recognize: values grow larger and eventually overflow. Another kind is less obvious. The iterates stay in a bounded region and repeatedly visit the same states, yet never approach a solution.

This three-block ADMM project studies the latter situation.

## Where the question begins

ADMM splits an optimization problem into parts and updates them in turn. Using more blocks can make individual steps easier to compute, but it also changes the behavior of the complete iteration. A natural extension need not inherit the convergence guarantees of the original method.

The particular question here is whether an identity matrix in the third constraint block is enough to guarantee convergence of unmodified direct three-block ADMM.

The public repository gives two fixed convex quadratic programs. Both have a unique KKT point, yet direct three-block ADMM can produce bounded, non-KKT periodic orbits. The identity structure of the third block alone therefore does not rule out this failure.

## Two periods, two different statements

The first instance has an orbit with minimal period **66**. Starting from a specified initial state, the iteration returns exactly to that state after 66 steps and repeats.

The second instance has minimal period **23**. In addition to establishing the periodic orbit, the project gives a local attraction result: initial states in an open invariant set of the appropriate reduced state space converge to the non-KKT orbit phase by phase.

These statements answer different questions. The first concerns one deliberately chosen initialization. The second describes the behavior of a neighborhood for one fixed problem. Neither should be extended to all initializations or all problem data.

## From an apparent cycle to exact verification

Numerical experiments can help locate a candidate orbit. But states that appear to coincide in finite precision are not, by themselves, an exact proof of periodicity.

Turning the observation into a precise result requires answering several questions:

- Does every step follow the original algorithm?
- Are all conditions for the projection or branch choices satisfied?
- Does the state return exactly to its starting point after a full period?
- Could the period be shorter?
- Why are the states on the orbit not KKT points?

The project provides exact, recomputable verification materials for these questions. The period-66 instance also has cross-checks using different implementations. The period-23 instance uses rational data and includes verification of a local invariant set.

## What comes after AI-assisted discovery

The repository also documents AI-assisted searches for the counterexamples. One useful distinction runs throughout this process: finding a candidate, explaining a phenomenon, and verifying a conclusion are connected but different activities.

Computation can point toward promising directions. Mathematical analysis must then identify the conditions under which a statement holds. A clear research record should help readers distinguish exploratory work from established conclusions.

For this problem, the main result is a concrete counterexample that can be stated precisely and checked step by step, beyond a plot that merely appears not to converge.

## Further reading

This article is an introduction based on the public repository and does not present a new proof.

- [Project repository and verification instructions](https://github.com/ConanXu-math/identity-slack-admm-cycle-certificate)
- [Accompanying paper: arXiv:2608.14396](https://arxiv.org/abs/2608.14396)

A useful starting point is the repository's statement of scope, followed by either the mathematical argument or the verification code.
