---
title: "Claude Code Settings"
titleKo: "Claude Code 설정"
description: "Configure Claude Code with global and project-level settings, and environment variables."
descriptionKo: "전역 및 프로젝트 수준 설정과 환경 변수로 Claude Code를 구성합니다."
category: "settings"
sourceUrl: "https://code.claude.com/docs/en/settings.md"
fetchedDate: "2026-02-19"
---

# Source: https://code.claude.com/docs/en/settings.md

# Claude Code Settings

Configure Claude Code with global and project-level settings, and environment variables.

Claude Code offers a variety of settings to configure its behavior to meet your needs. You can configure Claude Code by running the `/config` command when using the interactive REPL, which opens a tabbed Settings interface where you can view status information and modify configuration options.

## Configuration scopes

Claude Code uses a **scope system** to determine where configurations apply and who they're shared with. Understanding scopes helps you decide how to configure Claude Code for personal use, team collaboration, or enterprise deployment.

### Available scopes

| Scope       | Location                             | Who it affects                       | Shared with team?      |
| :---------- | :----------------------------------- | :----------------------------------- | :--------------------- |
| **Managed** | System-level `managed-settings.json` | All users on the machine             | Yes (deployed by IT)   |
| **User**    | `~/.claude/` directory               | You, across all projects             | No                     |
| **Project** | `.claude/` in repository             | All collaborators on this repository | Yes (committed to git) |
| **Local**   | `.claude/*.local.*` files            | You, in this repository only         | No (gitignored)        |

### When to use each scope

**Managed scope** is for:

* Security policies that must be enforced organization-wide
* Compliance requirements that can't be overridden
* Standardized configurations deployed by IT/DevOps

**User scope** is best for:

* Personal preferences you want everywhere (themes, editor settings)
* Tools and plugins you use across all projects
* API keys and authentication (stored securely)

**Project scope** is best for:

* Team-shared settings (permissions, hooks, MCP servers)
* Plugins the whole team should have
* Standardizing tooling across collaborators

**Local scope** is best for:

* Personal overrides for a specific project
* Testing configurations before sharing with the team
* Machine-specific settings that won't work for others

### How scopes interact

When the same setting is configured in multiple scopes, more specific scopes take precedence:

1. **Managed** (highest) - can't be overridden by anything
2. **Command line arguments** - temporary session overrides
3. **Local** - overrides project and user settings
4. **Project** - overrides user settings
5. **User** (lowest) - applies when nothing else specifies the setting

For example, if a permission is allowed in user settings but denied in project settings, the project setting takes precedence and the permission is blocked.

### What uses scopes

Scopes apply to many Claude Code features:

| Feature         | User location             | Project location                   | Local location                 |
| :-------------- | :------------------------ | :--------------------------------- | :----------------------------- |
| **Settings**    | `~/.claude/settings.json` | `.claude/settings.json`            | `.claude/settings.local.json`  |
| **Subagents**   | `~/.claude/agents/`       | `.claude/agents/`                  | —                              |
| **MCP servers** | `~/.claude.json`          | `.mcp.json`                        | `~/.claude.json` (per-project) |
| **Plugins**     | `~/.claude/settings.json` | `.claude/settings.json`            | `.claude/settings.local.json`  |
| **CLAUDE.md**   | `~/.claude/CLAUDE.md`     | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md`              |

---

## Settings files

The `settings.json` file is our official mechanism for configuring Claude Code through hierarchical settings:

* **User settings** are defined in `~/.claude/settings.json` and apply to all projects.
* **Project settings** are saved in your project directory:
  * `.claude/settings.json` for settings that are checked into source control and shared with your team
  * `.claude/settings.local.json` for settings that are not checked in, useful for personal preferences and experimentation. Claude Code will configure git to ignore `.claude/settings.local.json` when it is created.
* **Managed settings**: For organizations that need centralized control, Claude Code supports `managed-settings.json` and `managed-mcp.json` files that can be deployed to system directories:

  * macOS: `/Library/Application Support/ClaudeCode/`
  * Linux and WSL: `/etc/claude-code/`
  * Windows: `C:\Program Files\ClaudeCode\`

  These are system-wide paths (not user home directories like `~/Library/...`) that require administrator privileges. They are designed to be deployed by IT administrators.

  See [Managed settings](/en/permissions#managed-settings) and [Managed MCP configuration](/en/mcp#managed-mcp-configuration) for details. For organizations without device management infrastructure, see [server-managed settings](/en/server-managed-settings).

  Managed deployments can also restrict **plugin marketplace additions** using `strictKnownMarketplaces`. For more information, see [Managed marketplace restrictions](/en/plugin-marketplaces#managed-marketplace-restrictions).

* **Other configuration** is stored in `~/.claude.json`. This file contains your preferences (theme, notification settings, editor mode), OAuth session, [MCP server](/en/mcp) configurations for user and local scopes, per-project state (allowed tools, trust settings), and various caches. Project-scoped MCP servers are stored separately in `.mcp.json`.

Claude Code automatically creates timestamped backups of configuration files and retains the five most recent backups to prevent data loss.

### Example settings.json

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  },
  "companyAnnouncements": [
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com",
    "Reminder: Code reviews required for all PRs",
    "New security policy in effect"
  ]
}
```

The `$schema` line in the example above points to the [official JSON schema](https://json.schemastore.org/claude-code-settings.json) for Claude Code settings. Adding it to your `settings.json` enables autocomplete and inline validation in VS Code, Cursor, and any other editor that supports JSON schema validation.

### Available settings

`settings.json` supports a number of options:

| Key                               | Description                                                                                                                                                                                                                                                                     | Example                                                                 |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------- |
| `apiKeyHelper`                    | Custom script, to be executed in `/bin/sh`, to generate an auth value. This value will be sent as `X-Api-Key` and `Authorization: Bearer` headers for model requests                                                                                                            | `/bin/generate_temp_api_key.sh`                                         |
| `cleanupPeriodDays`               | Sessions inactive for longer than this period are deleted at startup. Setting to `0` immediately deletes all sessions. (default: 30 days)                                                                                                                                       | `20`                                                                    |
| `companyAnnouncements`            | Announcement to display to users at startup. If multiple announcements are provided, they will be cycled through at random.                                                                                                                                                     | `["Welcome to Acme Corp! Review our code guidelines at docs.acme.com"]` |
| `env`                             | Environment variables that will be applied to every session                                                                                                                                                                                                                     | `{"FOO": "bar"}`                                                        |
| `attribution`                     | Customize attribution for git commits and pull requests. See [Attribution settings](#attribution-settings)                                                                                                                                                                      | `{"commit": "Generated with Claude Code", "pr": ""}`                 |
| `includeCoAuthoredBy`             | **Deprecated**: Use `attribution` instead. Whether to include the `co-authored-by Claude` byline in git commits and pull requests (default: `true`)                                                                                                                             | `false`                                                                 |
| `permissions`                     | See table below for structure of permissions.                                                                                                                                                                                                                                   |                                                                         |
| `hooks`                           | Configure custom commands to run at lifecycle events. See [hooks documentation](/en/hooks) for format                                                                                                                                                                           | See [hooks](/en/hooks)                                                  |
| `disableAllHooks`                 | Disable all [hooks](/en/hooks) and any custom [status line](/en/statusline)                                                                                                                                                                                                     | `true`                                                                  |
| `allowManagedHooksOnly`           | (Managed settings only) Prevent loading of user, project, and plugin hooks. Only allows managed hooks and SDK hooks. See [Hook configuration](#hook-configuration)                                                                                                              | `true`                                                                  |
| `allowManagedPermissionRulesOnly` | (Managed settings only) Prevent user and project settings from defining `allow`, `ask`, or `deny` permission rules. Only rules in managed settings apply. See [Managed-only settings](/en/permissions#managed-only-settings)                                                    | `true`                                                                  |
| `model`                           | Override the default model to use for Claude Code                                                                                                                                                                                                                               | `"claude-sonnet-4-6"`                                                   |
| `availableModels`                 | Restrict which models users can select via `/model`, `--model`, Config tool, or `ANTHROPIC_MODEL`. Does not affect the Default option. See [Restrict model selection](/en/model-config#restrict-model-selection)                                                                | `["sonnet", "haiku"]`                                                   |
| `otelHeadersHelper`               | Script to generate dynamic OpenTelemetry headers. Runs at startup and periodically (see [Dynamic headers](/en/monitoring-usage#dynamic-headers))                                                                                                                                | `/bin/generate_otel_headers.sh`                                         |
| `statusLine`                      | Configure a custom status line to display context. See [`statusLine` documentation](/en/statusline)                                                                                                                                                                             | `{"type": "command", "command": "~/.claude/statusline.sh"}`             |
| `fileSuggestion`                  | Configure a custom script for `@` file autocomplete. See [File suggestion settings](#file-suggestion-settings)                                                                                                                                                                  | `{"type": "command", "command": "~/.claude/file-suggestion.sh"}`        |
| `respectGitignore`                | Control whether the `@` file picker respects `.gitignore` patterns. When `true` (default), files matching `.gitignore` patterns are excluded from suggestions                                                                                                                   | `false`                                                                 |
| `outputStyle`                     | Configure an output style to adjust the system prompt. See [output styles documentation](/en/output-styles)                                                                                                                                                                     | `"Explanatory"`                                                         |
| `forceLoginMethod`                | Use `claudeai` to restrict login to Claude.ai accounts, `console` to restrict login to Claude Console (API usage billing) accounts                                                                                                                                              | `claudeai`                                                              |
| `forceLoginOrgUUID`               | Specify the UUID of an organization to automatically select it during login, bypassing the organization selection step. Requires `forceLoginMethod` to be set                                                                                                                   | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`                                |
| `enableAllProjectMcpServers`      | Automatically approve all MCP servers defined in project `.mcp.json` files                                                                                                                                                                                                      | `true`                                                                  |
| `enabledMcpjsonServers`           | List of specific MCP servers from `.mcp.json` files to approve                                                                                                                                                                                                                  | `["memory", "github"]`                                                  |
| `disabledMcpjsonServers`          | List of specific MCP servers from `.mcp.json` files to reject                                                                                                                                                                                                                   | `["filesystem"]`                                                        |
| `allowedMcpServers`               | When set in managed-settings.json, allowlist of MCP servers users can configure. Undefined = no restrictions, empty array = lockdown. Applies to all scopes. Denylist takes precedence. See [Managed MCP configuration](/en/mcp#managed-mcp-configuration)                      | `[{ "serverName": "github" }]`                                          |
| `deniedMcpServers`                | When set in managed-settings.json, denylist of MCP servers that are explicitly blocked. Applies to all scopes including managed servers. Denylist takes precedence over allowlist. See [Managed MCP configuration](/en/mcp#managed-mcp-configuration)                           | `[{ "serverName": "filesystem" }]`                                      |
| `strictKnownMarketplaces`         | When set in managed-settings.json, allowlist of plugin marketplaces users can add. Undefined = no restrictions, empty array = lockdown. Applies to marketplace additions only. See [Managed marketplace restrictions](/en/plugin-marketplaces#managed-marketplace-restrictions) | `[{ "source": "github", "repo": "acme-corp/plugins" }]`                 |
| `awsAuthRefresh`                  | Custom script that modifies the `.aws` directory (see [advanced credential configuration](/en/amazon-bedrock#advanced-credential-configuration))                                                                                                                                | `aws sso login --profile myprofile`                                     |
| `awsCredentialExport`             | Custom script that outputs JSON with AWS credentials (see [advanced credential configuration](/en/amazon-bedrock#advanced-credential-configuration))                                                                                                                            | `/bin/generate_aws_grant.sh`                                            |
| `alwaysThinkingEnabled`           | Enable [extended thinking](/en/common-workflows#use-extended-thinking-thinking-mode) by default for all sessions. Typically configured via the `/config` command rather than editing directly                                                                                   | `true`                                                                  |
| `plansDirectory`                  | Customize where plan files are stored. Path is relative to project root. Default: `~/.claude/plans`                                                                                                                                                                             | `"./plans"`                                                             |
| `showTurnDuration`                | Show turn duration messages after responses (e.g., "Cooked for 1m 6s"). Set to `false` to hide these messages                                                                                                                                                                   | `true`                                                                  |
| `spinnerVerbs`                    | Customize the action verbs shown in the spinner and turn duration messages. Set `mode` to `"replace"` to use only your verbs, or `"append"` to add them to the defaults                                                                                                         | `{"mode": "append", "verbs": ["Pondering", "Crafting"]}`                |
| `language`                        | Configure Claude's preferred response language (e.g., `"japanese"`, `"spanish"`, `"french"`). Claude will respond in this language by default                                                                                                                                   | `"japanese"`                                                            |
| `autoUpdatesChannel`              | Release channel to follow for updates. Use `"stable"` for a version that is typically about one week old and skips versions with major regressions, or `"latest"` (default) for the most recent release                                                                         | `"stable"`                                                              |
| `spinnerTipsEnabled`              | Show tips in the spinner while Claude is working. Set to `false` to disable tips (default: `true`)                                                                                                                                                                              | `false`                                                                  |
| `terminalProgressBarEnabled`      | Enable the terminal progress bar that shows progress in supported terminals like Windows Terminal and iTerm2 (default: `true`)                                                                                                                                                  | `false`                                                                  |
| `prefersReducedMotion`            | Reduce or disable UI animations (spinners, shimmer, flash effects) for accessibility                                                                                                                                                                                            | `true`                                                                  |
| `teammateMode`                    | How [agent team](/en/agent-teams) teammates display: `auto` (picks split panes in tmux or iTerm2, in-process otherwise), `in-process`, or `tmux`. See [set up agent teams](/en/agent-teams#set-up-agent-teams)                                                                  | `"in-process"`                                                          |

### Permission settings

| Keys                           | Description                                                                                                                                                                                                                                      | Example                                                                |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `allow`                        | Array of permission rules to allow tool use. See [Permission rule syntax](#permission-rule-syntax) below for pattern matching details                                                                                                            | `[ "Bash(git diff *)" ]`                                               |
| `ask`                          | Array of permission rules to ask for confirmation upon tool use. See [Permission rule syntax](#permission-rule-syntax) below                                                                                                                     | `[ "Bash(git push *)" ]`                                               |
| `deny`                         | Array of permission rules to deny tool use. Use this to exclude sensitive files from Claude Code access. See [Permission rule syntax](#permission-rule-syntax) and [Bash permission limitations](/en/permissions#tool-specific-permission-rules) | `[ "WebFetch", "Bash(curl *)", "Read(./.env)", "Read(./secrets/**)" ]` |
| `additionalDirectories`        | Additional [working directories](/en/permissions#working-directories) that Claude has access to                                                                                                                                                  | `[ "../docs/" ]`                                                       |
| `defaultMode`                  | Default [permission mode](/en/permissions#permission-modes) when opening Claude Code                                                                                                                                                             | `"acceptEdits"`                                                        |
| `disableBypassPermissionsMode` | Set to `"disable"` to prevent `bypassPermissions` mode from being activated. This disables the `--dangerously-skip-permissions` command-line flag. See [managed settings](/en/permissions#managed-settings)                                      | `"disable"`                                                            |

### Permission rule syntax

Permission rules follow the format `Tool` or `Tool(specifier)`. Rules are evaluated in order: deny rules first, then ask, then allow. The first matching rule wins.

Quick examples:

| Rule                           | Effect                                   |
| :----------------------------- | :--------------------------------------- |
| `Bash`                         | Matches all Bash commands                |
| `Bash(npm run *)`              | Matches commands starting with `npm run` |
| `Read(./.env)`                 | Matches reading the `.env` file          |
| `WebFetch(domain:example.com)` | Matches fetch requests to example.com    |

For the complete rule syntax reference, including wildcard behavior, tool-specific patterns for Read, Edit, WebFetch, MCP, and Task rules, and security limitations of Bash patterns, see [Permission rule syntax](/en/permissions#permission-rule-syntax).

### Sandbox settings

Configure advanced sandboxing behavior. Sandboxing isolates bash commands from your filesystem and network. See [Sandboxing](/en/sandboxing) for details.

**Filesystem and network restrictions** are configured via Read, Edit, and WebFetch permission rules, not via these sandbox settings.

| Keys                          | Description                                                                                                                                                                                                                                                                                                                       | Example                         |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `enabled`                     | Enable bash sandboxing (macOS, Linux, and WSL2). Default: false                                                                                                                                                                                                                                                                   | `true`                          |
| `autoAllowBashIfSandboxed`    | Auto-approve bash commands when sandboxed. Default: true                                                                                                                                                                                                                                                                          | `true`                          |
| `excludedCommands`            | Commands that should run outside of the sandbox                                                                                                                                                                                                                                                                                   | `["git", "docker"]`             |
| `allowUnsandboxedCommands`    | Allow commands to run outside the sandbox via the `dangerouslyDisableSandbox` parameter. When set to `false`, the `dangerouslyDisableSandbox` escape hatch is completely disabled and all commands must run sandboxed (or be in `excludedCommands`). Useful for enterprise policies that require strict sandboxing. Default: true | `false`                         |
| `network.allowUnixSockets`    | Unix socket paths accessible in sandbox (for SSH agents, etc.)                                                                                                                                                                                                                                                                    | `["~/.ssh/agent-socket"]`       |
| `network.allowAllUnixSockets` | Allow all Unix socket connections in sandbox. Default: false                                                                                                                                                                                                                                                                      | `true`                          |
| `network.allowLocalBinding`   | Allow binding to localhost ports (macOS only). Default: false                                                                                                                                                                                                                                                                     | `true`                          |
| `network.allowedDomains`      | Array of domains to allow for outbound network traffic. Supports wildcards (e.g., `*.example.com`).                                                                                                                                                                                                                               | `["github.com", "*.npmjs.org"]` |
| `network.httpProxyPort`       | HTTP proxy port used if you wish to bring your own proxy. If not specified, Claude will run its own proxy.                                                                                                                                                                                                                        | `8080`                          |
| `network.socksProxyPort`      | SOCKS5 proxy port used if you wish to bring your own proxy. If not specified, Claude will run its own proxy.                                                                                                                                                                                                                      | `8081`                          |
| `enableWeakerNestedSandbox`   | Enable weaker sandbox for unprivileged Docker environments (Linux and WSL2 only). **Reduces security.** Default: false                                                                                                                                                                                                            | `true`                          |

**Configuration example:**

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowedDomains": ["github.com", "*.npmjs.org", "registry.yarnpkg.com"],
      "allowUnixSockets": [
        "/var/run/docker.sock"
      ],
      "allowLocalBinding": true
    }
  },
  "permissions": {
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)"
    ]
  }
}
```

### Attribution settings

Claude Code adds attribution to git commits and pull requests. These are configured separately:

* Commits use [git trailers](https://git-scm.com/docs/git-interpret-trailers) (like `Co-Authored-By`) by default, which can be customized or disabled
* Pull request descriptions are plain text

| Keys     | Description                                                                                |
| :------- | :----------------------------------------------------------------------------------------- |
| `commit` | Attribution for git commits, including any trailers. Empty string hides commit attribution |
| `pr`     | Attribution for pull request descriptions. Empty string hides pull request attribution     |

**Default commit attribution:**

```
Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**Default pull request attribution:**

```
Generated with [Claude Code](https://claude.com/claude-code)
```

**Example:**

```json
{
  "attribution": {
    "commit": "Generated with AI\n\nCo-Authored-By: AI <ai@example.com>",
    "pr": ""
  }
}
```

The `attribution` setting takes precedence over the deprecated `includeCoAuthoredBy` setting. To hide all attribution, set `commit` and `pr` to empty strings.

### File suggestion settings

Configure a custom command for `@` file path autocomplete. The built-in file suggestion uses fast filesystem traversal, but large monorepos may benefit from project-specific indexing such as a pre-built file index or custom tooling.

```json
{
  "fileSuggestion": {
    "type": "command",
    "command": "~/.claude/file-suggestion.sh"
  }
}
```

The command runs with the same environment variables as [hooks](/en/hooks), including `CLAUDE_PROJECT_DIR`. It receives JSON via stdin with a `query` field:

```json
{"query": "src/comp"}
```

Output newline-separated file paths to stdout (currently limited to 15):

```
src/components/Button.tsx
src/components/Modal.tsx
src/components/Form.tsx
```

**Example:**

```bash
#!/bin/bash
query=$(cat | jq -r '.query')
your-repo-file-index --query "$query" | head -20
```

### Hook configuration

**Managed settings only**: Controls which hooks are allowed to run. This setting can only be configured in [managed settings](#settings-files) and provides administrators with strict control over hook execution.

**Behavior when `allowManagedHooksOnly` is `true`:**

* Managed hooks and SDK hooks are loaded
* User hooks, project hooks, and plugin hooks are blocked

**Configuration:**

```json
{
  "allowManagedHooksOnly": true
}
```

### Settings precedence

Settings apply in order of precedence. From highest to lowest:

1. **Managed settings** (`managed-settings.json` or server-managed settings)
   * Policies deployed by IT/DevOps to system directories, or delivered from Anthropic's servers for Claude for Enterprise customers
   * Cannot be overridden by user or project settings

2. **Command line arguments**
   * Temporary overrides for a specific session

3. **Local project settings** (`.claude/settings.local.json`)
   * Personal project-specific settings

4. **Shared project settings** (`.claude/settings.json`)
   * Team-shared project settings in source control

5. **User settings** (`~/.claude/settings.json`)
   * Personal global settings

This hierarchy ensures that organizational policies are always enforced while still allowing teams and individuals to customize their experience.

### Key points about the configuration system

* **Memory files (`CLAUDE.md`)**: Contain instructions and context that Claude loads at startup
* **Settings files (JSON)**: Configure permissions, environment variables, and tool behavior
* **Skills**: Custom prompts that can be invoked with `/skill-name` or loaded by Claude automatically
* **MCP servers**: Extend Claude Code with additional tools and integrations
* **Precedence**: Higher-level configurations (Managed) override lower-level ones (User/Project)
* **Inheritance**: Settings are merged, with more specific settings adding to or overriding broader ones

### System prompt

Claude Code's internal system prompt is not published. To add custom instructions, use `CLAUDE.md` files or the `--append-system-prompt` flag.

### Excluding sensitive files

To prevent Claude Code from accessing files containing sensitive information like API keys, secrets, and environment files, use the `permissions.deny` setting in your `.claude/settings.json` file:

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

This replaces the deprecated `ignorePatterns` configuration. Files matching these patterns are excluded from file discovery and search results, and read operations on these files are denied.

## Subagent configuration

Claude Code supports custom AI subagents that can be configured at both user and project levels. These subagents are stored as Markdown files with YAML frontmatter:

* **User subagents**: `~/.claude/agents/` - Available across all your projects
* **Project subagents**: `.claude/agents/` - Specific to your project and can be shared with your team

Subagent files define specialized AI assistants with custom prompts and tool permissions. Learn more about creating and using subagents in the [subagents documentation](/en/sub-agents).

## Plugin configuration

Claude Code supports a plugin system that lets you extend functionality with skills, agents, hooks, and MCP servers. Plugins are distributed through marketplaces and can be configured at both user and repository levels.

### Plugin settings

Plugin-related settings in `settings.json`:

```json
{
  "enabledPlugins": {
    "formatter@acme-tools": true,
    "deployer@acme-tools": true,
    "analyzer@security-plugins": false
  },
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": "github",
      "repo": "acme-corp/claude-plugins"
    }
  }
}
```

#### `enabledPlugins`

Controls which plugins are enabled. Format: `"plugin-name@marketplace-name": true/false`

**Scopes**:

* **User settings** (`~/.claude/settings.json`): Personal plugin preferences
* **Project settings** (`.claude/settings.json`): Project-specific plugins shared with team
* **Local settings** (`.claude/settings.local.json`): Per-machine overrides (not committed)

#### `extraKnownMarketplaces`

Defines additional marketplaces that should be made available for the repository. Typically used in repository-level settings to ensure team members have access to required plugin sources.

**When a repository includes `extraKnownMarketplaces`**:

1. Team members are prompted to install the marketplace when they trust the folder
2. Team members are then prompted to install plugins from that marketplace
3. Users can skip unwanted marketplaces or plugins (stored in user settings)
4. Installation respects trust boundaries and requires explicit consent

#### `strictKnownMarketplaces`

**Managed settings only**: Controls which plugin marketplaces users are allowed to add. This setting can only be configured in [`managed-settings.json`](/en/permissions#managed-settings) and provides administrators with strict control over marketplace sources.

**Allowlist behavior**:

* `undefined` (default): No restrictions - users can add any marketplace
* Empty array `[]`: Complete lockdown - users cannot add any new marketplaces
* List of sources: Users can only add marketplaces that match exactly

### Managing plugins

Use the `/plugin` command to manage plugins interactively:

* Browse available plugins from marketplaces
* Install/uninstall plugins
* Enable/disable plugins
* View plugin details (commands, agents, hooks provided)
* Add/remove marketplaces

Learn more about the plugin system in the [plugins documentation](/en/plugins).

## Environment variables

Claude Code supports the following environment variables to control its behavior:

All environment variables can also be configured in [`settings.json`](#available-settings). This is useful as a way to automatically set environment variables for each session, or to roll out a set of environment variables for your whole team or organization.

| Variable                                       | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :--------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`                            | API key sent as `X-Api-Key` header, typically for the Claude SDK (for interactive usage, run `/login`)                                                                                                                                                                                                                                                                                                                                                                                                |
| `ANTHROPIC_AUTH_TOKEN`                         | Custom value for the `Authorization` header (the value you set here will be prefixed with `Bearer `)                                                                                                                                                                                                                                                                                                                                                                                                  |
| `ANTHROPIC_CUSTOM_HEADERS`                     | Custom headers to add to requests (`Name: Value` format, newline-separated for multiple headers)                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`                | See [Model configuration](/en/model-config#environment-variables)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`                 | See [Model configuration](/en/model-config#environment-variables)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ANTHROPIC_DEFAULT_SONNET_MODEL`               | See [Model configuration](/en/model-config#environment-variables)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ANTHROPIC_MODEL`                              | Name of the model setting to use (see [Model Configuration](/en/model-config#environment-variables))                                                                                                                                                                                                                                                                                                                                                                                                  |
| `BASH_DEFAULT_TIMEOUT_MS`                      | Default timeout for long-running bash commands                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `BASH_MAX_OUTPUT_LENGTH`                       | Maximum number of characters in bash outputs before they are middle-truncated                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `BASH_MAX_TIMEOUT_MS`                          | Maximum timeout the model can set for long-running bash commands                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`              | Set the percentage of context capacity (1-100) at which auto-compaction triggers. By default, auto-compaction triggers at approximately 95% capacity. Use lower values like `50` to compact earlier.                                                                                                                                                                                                                                                                                                  |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`     | Return to the original working directory after each Bash command                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | Set to `1` to load CLAUDE.md files from directories specified with `--add-dir`. By default, additional directories do not load memory files                                                                                                                                                                                                                                                                                                                                                           |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`         | Set to `1` to enable [agent teams](/en/agent-teams). Agent teams are experimental and disabled by default                                                                                                                                                                                                                                                                                                                                                                                             |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS`                | Set the maximum number of output tokens for most requests. Default: 32,000. Maximum: 64,000.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `CLAUDE_CODE_SUBAGENT_MODEL`                   | See [Model configuration](/en/model-config)                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `CLAUDE_CODE_USE_BEDROCK`                      | Use [Bedrock](/en/amazon-bedrock)                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `CLAUDE_CODE_USE_VERTEX`                       | Use [Vertex](/en/google-vertex-ai)                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `DISABLE_AUTOUPDATER`                          | Set to `1` to disable automatic updates.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `DISABLE_BUG_COMMAND`                          | Set to `1` to disable the `/bug` command                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `DISABLE_ERROR_REPORTING`                      | Set to `1` to opt out of Sentry error reporting                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `DISABLE_TELEMETRY`                            | Set to `1` to opt out of Statsig telemetry                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ENABLE_TOOL_SEARCH`                           | Controls [MCP tool search](/en/mcp#scale-with-mcp-tool-search). Values: `auto` (default, enables at 10% context), `auto:N` (custom threshold), `true` (always on), `false` (disabled)                                                                                                                                                                                                                                                                                                                |
| `HTTP_PROXY`                                   | Specify HTTP proxy server for network connections                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `HTTPS_PROXY`                                  | Specify HTTPS proxy server for network connections                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `MAX_MCP_OUTPUT_TOKENS`                        | Maximum number of tokens allowed in MCP tool responses. Claude Code displays a warning when output exceeds 10,000 tokens (default: 25000)                                                                                                                                                                                                                                                                                                                                                             |
| `MAX_THINKING_TOKENS`                          | Override the extended thinking token budget.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `MCP_TIMEOUT`                                  | Timeout in milliseconds for MCP server startup                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `MCP_TOOL_TIMEOUT`                             | Timeout in milliseconds for MCP tool execution                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET`               | Override the character budget for skill metadata shown to the Skill tool.                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Tools available to Claude

Claude Code has access to a set of powerful tools that help it understand and modify your codebase:

| Tool                | Description                                                                                                                                                                                                                                                                                                                                                                 | Permission Required |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------ |
| **AskUserQuestion** | Asks multiple-choice questions to gather requirements or clarify ambiguity                                                                                                                                                                                                                                                                                                  | No                  |
| **Bash**            | Executes shell commands in your environment                                                                                                                                                                                                                                                                                                                                 | Yes                 |
| **TaskOutput**      | Retrieves output from a background task (bash shell or subagent)                                                                                                                                                                                                                                                                                                            | No                  |
| **Edit**            | Makes targeted edits to specific files                                                                                                                                                                                                                                                                                                                                      | Yes                 |
| **ExitPlanMode**    | Prompts the user to exit plan mode and start coding                                                                                                                                                                                                                                                                                                                         | Yes                 |
| **Glob**            | Finds files based on pattern matching                                                                                                                                                                                                                                                                                                                                       | No                  |
