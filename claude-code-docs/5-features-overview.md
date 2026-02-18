# Source: https://code.claude.com/docs/en/features-overview.md

# Extend Claude Code

> Understand when to use CLAUDE.md, Skills, subagents, hooks, MCP, and plugins.

Claude Code combines a model that reasons about your code with built-in tools for file operations, search, execution, and web access. The built-in tools cover most coding tasks. This guide covers the extension layer: features you add to customize what Claude knows, connect it to external services, and automate workflows.

> **Note**: For how the core agentic loop works, see [How Claude Code works](/en/how-claude-code-works).

**New to Claude Code?** Start with [CLAUDE.md](/en/memory) for project conventions. Add other extensions as you need them.

## Overview

Extensions plug into different parts of the agentic loop:

* **[CLAUDE.md](/en/memory)** adds persistent context Claude sees every session
* **[Skills](/en/skills)** add reusable knowledge and invocable workflows
* **[MCP](/en/mcp)** connects Claude to external services and tools
* **[Subagents](/en/sub-agents)** run their own loops in isolated context, returning summaries
* **[Agent teams](/en/agent-teams)** coordinate multiple independent sessions with shared tasks and peer-to-peer messaging
* **[Hooks](/en/hooks)** run outside the loop entirely as deterministic scripts
* **[Plugins](/en/plugins)** and **[marketplaces](/en/plugin-marketplaces)** package and distribute these features

[Skills](/en/skills) are the most flexible extension. A skill is a markdown file containing knowledge, workflows, or instructions. You can invoke skills with a slash command like `/deploy`, or Claude can load them automatically when relevant. Skills can run in your current conversation or in an isolated context via subagents.

## Match features to your goal

Features range from always-on context that Claude sees every session, to on-demand capabilities you or Claude can invoke, to background automation that runs on specific events. The table below shows what's available and when each one makes sense.

| Feature                            | What it does                                               | When to use it                                                                  | Example                                                                          |
| ---------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **CLAUDE.md**                      | Persistent context loaded every conversation               | Project conventions, "always do X" rules                                        | "Use pnpm, not npm. Run tests before committing."                                |
| **Skill**                          | Instructions, knowledge, and workflows Claude can use      | Reusable content, reference docs, repeatable tasks                              | `/review` runs your code review checklist; API docs skill with endpoint patterns |
| **Subagent**                       | Isolated execution context that returns summarized results | Context isolation, parallel tasks, specialized workers                          | Research task that reads many files but returns only key findings                |
| **Agent teams**                    | Coordinate multiple independent Claude Code sessions       | Parallel research, new feature development, debugging with competing hypotheses | Spawn reviewers to check security, performance, and tests simultaneously         |
| **MCP**                            | Connect to external services                               | External data or actions                                                        | Query your database, post to Slack, control a browser                            |
| **Hook**                           | Deterministic script that runs on events                   | Predictable automation, no LLM involved                                         | Run ESLint after every file edit                                                 |

**[Plugins](/en/plugins)** are the packaging layer. A plugin bundles skills, hooks, subagents, and MCP servers into a single installable unit. Plugin skills are namespaced (like `/my-plugin:review`) so multiple plugins can coexist. Use plugins when you want to reuse the same setup across multiple repositories or distribute to others via a **[marketplace](/en/plugin-marketplaces)**.

## Compare similar features

### Skill vs Subagent

Skills and subagents solve different problems:

* **Skills** are reusable content you can load into any context
* **Subagents** are isolated workers that run separately from your main conversation

| Aspect          | Skill                                          | Subagent                                                         |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **What it is**  | Reusable instructions, knowledge, or workflows | Isolated worker with its own context                             |
| **Key benefit** | Share content across contexts                  | Context isolation. Work happens separately, only summary returns |
| **Best for**    | Reference material, invocable workflows        | Tasks that read many files, parallel work, specialized workers   |

**Skills can be reference or action.** Reference skills provide knowledge Claude uses throughout your session (like your API style guide). Action skills tell Claude to do something specific (like `/deploy` that runs your deployment workflow).

**Use a subagent** when you need context isolation or when your context window is getting full. The subagent might read dozens of files or run extensive searches, but your main conversation only receives a summary. Custom subagents can have their own instructions and can preload skills.

**They can combine.** A subagent can preload specific skills (`skills:` field). A skill can run in isolated context using `context: fork`. See [Skills](/en/skills) for details.

### CLAUDE.md vs Skill

Both store instructions, but they load differently and serve different purposes.

| Aspect                    | CLAUDE.md                    | Skill                                   |
| ------------------------- | ---------------------------- | --------------------------------------- |
| **Loads**                 | Every session, automatically | On demand                               |
| **Can include files**     | Yes, with `@path` imports    | Yes, with `@path` imports               |
| **Can trigger workflows** | No                           | Yes, with `/<name>`                     |
| **Best for**              | "Always do X" rules          | Reference material, invocable workflows |

**Put it in CLAUDE.md** if Claude should always know it: coding conventions, build commands, project structure, "never do X" rules.

**Put it in a skill** if it's reference material Claude needs sometimes (API docs, style guides) or a workflow you trigger with `/<name>` (deploy, review, release).

**Rule of thumb:** Keep CLAUDE.md under ~500 lines. If it's growing, move reference content to skills.

### Subagent vs Agent team

Both parallelize work, but they're architecturally different:

* **Subagents** run inside your session and report results back to your main context
* **Agent teams** are independent Claude Code sessions that communicate with each other

| Aspect            | Subagent                                         | Agent team                                          |
| ----------------- | ------------------------------------------------ | --------------------------------------------------- |
| **Context**       | Own context window; results return to the caller | Own context window; fully independent               |
| **Communication** | Reports results back to the main agent only      | Teammates message each other directly               |
| **Coordination**  | Main agent manages all work                      | Shared task list with self-coordination             |
| **Best for**      | Focused tasks where only the result matters      | Complex work requiring discussion and collaboration |
| **Token cost**    | Lower: results summarized back to main context   | Higher: each teammate is a separate Claude instance |

**Use a subagent** when you need a quick, focused worker: research a question, verify a claim, review a file. The subagent does the work and returns a summary. Your main conversation stays clean.

**Use an agent team** when teammates need to share findings, challenge each other, and coordinate independently. Agent teams are best for research with competing hypotheses, parallel code review, and new feature development where each teammate owns a separate piece.

> **Note**: Agent teams are experimental and disabled by default. See [agent teams](/en/agent-teams) for setup and current limitations.

### MCP vs Skill

MCP connects Claude to external services. Skills extend what Claude knows, including how to use those services effectively.

| Aspect         | MCP                                                  | Skill                                                   |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| **What it is** | Protocol for connecting to external services         | Knowledge, workflows, and reference material            |
| **Provides**   | Tools and data access                                | Knowledge, workflows, reference material                |
| **Examples**   | Slack integration, database queries, browser control | Code review checklist, deploy workflow, API style guide |

These solve different problems and work well together:

**MCP** gives Claude the ability to interact with external systems. Without MCP, Claude can't query your database or post to Slack.

**Skills** give Claude knowledge about how to use those tools effectively, plus workflows you can trigger with `/<name>`. A skill might include your team's database schema and query patterns, or a `/post-to-slack` workflow with your team's message formatting rules.

## Understand how features layer

Features can be defined at multiple levels: user-wide, per-project, via plugins, or through managed policies. You can also nest CLAUDE.md files in subdirectories or place skills in specific packages of a monorepo. When the same feature exists at multiple levels, here's how they layer:

* **CLAUDE.md files** are additive: all levels contribute content to Claude's context simultaneously.
* **Skills and subagents** override by name: when the same name exists at multiple levels, one definition wins based on priority (managed > user > project for skills; managed > CLI flag > project > user > plugin for subagents).
* **MCP servers** override by name: local > project > user.
* **Hooks** merge: all registered hooks fire for their matching events regardless of source.

## Combine features

Each extension solves a different problem. Real setups combine them based on your workflow.

| Pattern                | How it works                                                                     | Example                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Skill + MCP**        | MCP provides the connection; a skill teaches Claude how to use it well           | MCP connects to your database, a skill documents your schema and query patterns                    |
| **Skill + Subagent**   | A skill spawns subagents for parallel work                                       | `/review` skill kicks off security, performance, and style subagents that work in isolated context |
| **CLAUDE.md + Skills** | CLAUDE.md holds always-on rules; skills hold reference material loaded on demand | CLAUDE.md says "follow our API conventions," a skill contains the full API style guide             |
| **Hook + MCP**         | A hook triggers external actions through MCP                                     | Post-edit hook sends a Slack notification when Claude modifies critical files                      |

## Understand context costs

Every feature you add consumes some of Claude's context. Understanding these trade-offs helps you build an effective setup.

### Context cost by feature

| Feature         | When it loads             | What loads                                    | Context cost                                 |
| --------------- | ------------------------- | --------------------------------------------- | -------------------------------------------- |
| **CLAUDE.md**   | Session start             | Full content                                  | Every request                                |
| **Skills**      | Session start + when used | Descriptions at start, full content when used | Low (descriptions every request)*            |
| **MCP servers** | Session start             | All tool definitions and schemas              | Every request                                |
| **Subagents**   | When spawned              | Fresh context with specified skills           | Isolated from main session                   |
| **Hooks**       | On trigger                | Nothing (runs externally)                     | Zero, unless hook returns additional context |

*By default, skill descriptions load at session start so Claude can decide when to use them. Set `disable-model-invocation: true` in a skill's frontmatter to hide it from Claude entirely until you invoke it manually.

**Put it in CLAUDE.md** if Claude should always know it. **Keep CLAUDE.md under ~500 lines.** Move reference material to skills.

## Learn more

Each feature has its own guide with setup instructions, examples, and configuration options.

- **[CLAUDE.md](/en/memory)**: Store project context, conventions, and instructions
- **[Skills](/en/skills)**: Give Claude domain expertise and reusable workflows
- **[Subagents](/en/sub-agents)**: Offload work to isolated context
- **[Agent teams](/en/agent-teams)**: Coordinate multiple sessions working in parallel
- **[MCP](/en/mcp)**: Connect Claude to external services
- **[Hooks](/en/hooks-guide)**: Automate workflows with hooks
- **[Plugins](/en/plugins)**: Bundle and share feature sets
- **[Marketplaces](/en/plugin-marketplaces)**: Host and distribute plugin collections
