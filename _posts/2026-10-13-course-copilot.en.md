---
title: "Keeping textbooks, questions, and learning materials together"
description: "An introduction to VeryMath Course Copilot, a local study workspace organized around reading a textbook."
categories: [AI and Tools]
tags: [Learning, AI, Open Source]
lang: en
permalink: /blog/course-copilot/
date: 2026-10-13 00:00:00 +0800
---

Reading a textbook that requires careful reasoning naturally leads to many side questions. What does this concept mean? How is a condition from the previous chapter being used? Is there a concrete example? Where should an insight be recorded once it becomes clear?

VeryMath Course Copilot brings these activities into one workspace: the textbook stays visible while questions and learning materials remain connected to what is being read.

## Start with a textbook, then a conversation

The project is designed for personal deployment. Users import their own textbook PDFs, read them in a browser, and connect a coding agent they already use.

The textbook provides the structure. A task can refer to the current page, a selected passage, a chapter, or the whole book, giving explanations and notes a concrete context.

Compared with repeatedly copying fragments into separate conversations, this arrangement offers a more continuous starting point for study.

## Several kinds of learning in one workspace

According to the public project documentation, the workspace supports explanations, exercises, mind maps, knowledge graphs, and LaTeX slides based on the textbook.

These serve different purposes:

- **Explanations** unpack the important steps in concepts, theorems, and examples.
- **Exercises** turn a feeling of understanding into an actual attempt.
- **Mind maps and knowledge graphs** help review chapter structure and relationships between concepts.
- **Slides and notes** organize an understanding into material that can be revisited.

The connected agent performs the teaching tasks. Results depend on the deployment, chosen model, and available tools. Generated formulas, derivations, and important numbers still need to be checked against the original text.

## Materials stay in a personal workspace

Textbooks, reading positions, conversations, and generated materials are saved in local course directories. Supplementary notes, exercise solutions, and references can be stored with the corresponding course for later use.

Local storage and model processing are separate considerations. Local storage describes where course materials are kept. When a remote agent is used, the content sent to that service depends on the user's selected agent and request.

The workspace also requires a local service to connect to the agent. Uploading a static web page alone is not enough to run the complete application.

## Keep the tool centered on a real question

A useful study tool does more than offer buttons. It should help the learner stay with the question at hand.

Where the reading stopped, what was cited, and which chapter a generated note belongs to all affect whether a single question can become part of an ongoing learning process. VeryMath uses the textbook and course directory to connect these activities.

## Further reading

This article is an introduction based on the public README.

- [VeryMath Course Copilot repository](https://github.com/ConanXu-math/course-copilot)
- [Installation and user guide](https://github.com/ConanXu-math/course-copilot/blob/main/docs/user-guide.md)

Before getting started, read the installation instructions and choose an agent you are already comfortable using.
