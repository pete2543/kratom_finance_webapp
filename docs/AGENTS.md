<page url="/en/docs/react/getting-started/agents-md">
# AGENTS.md

**Category**: react
**URL**: https://www.heroui.com/en/docs/react/getting-started/agents-md
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/en/react/getting-started/(ui-for-agents)/agents-md.mdx
> Download HeroUI v3 React documentation for AI coding agents


***

Download HeroUI v3 React documentation directly into your project for AI assistants to reference.

<Callout>
  **Note:** The `agents-md` command is specifically for HeroUI React v3. Other CLI commands (like `add`, `init`, `upgrade`, etc.) are for HeroUI v2 (for now).
</Callout>

<DocsImage
  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/agents-md.jpg"
  darkSrc="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/agents-md-dark.jpg"
  alt="HeroUI React v3 AGENTS.md"
/>

### Usage

```bash
npx heroui-cli@latest agents-md --react

```

Or specify output file:

```bash
npx heroui-cli@latest agents-md --react --output AGENTS.md

```

### What It Does

- Downloads latest HeroUI v3 React docs to `.heroui-docs/react/`
- Generates an index in `AGENTS.md` or `CLAUDE.md`
- Includes demo files for code examples
- Adds `.heroui-docs/` to `.gitignore` automatically

### Options

- `--react` - Download React docs only
- `--output <files...>` - Target file(s) (e.g., `AGENTS.md` or `AGENTS.md CLAUDE.md`)
- `--ssh` - Use SSH for git clone

### Requirements

- Tailwind CSS >= v4
- React >= 19.0.0
- `@heroui/react >= 3.0.0` or `@latest`

### Related Documentation

- [AGENTS.md](https://agents.md/) - Learn about the AGENTS.md format for coding agents
- [CLAUDE.md](https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md) - Claude equivalent of AGENTS.md
- [AGENTS.md vs Skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) - AGENTS.md performance
</page>

<page url="/en/docs/react/getting-started/agent-skills">
# Agent Skills

**Category**: react
**URL**: https://www.heroui.com/en/docs/react/getting-started/agent-skills
**Source**: https://raw.githubusercontent.com/heroui-inc/heroui/refs/heads/v3/apps/docs/content/docs/en/react/getting-started/(ui-for-agents)/agent-skills.mdx
> Enable AI assistants to build UIs with HeroUI v3 components


***

HeroUI Skills give your AI assistant comprehensive knowledge of HeroUI v3 components, patterns, and best practices.

<DocsImage
  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/agent-skills.jpg"
  darkSrc="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/agent-skills-dark.jpg"
  alt="HeroUI v3 MCP Server"
/>

### Installation

```bash
curl -fsSL https://heroui.com/install | bash -s heroui-react

```

Or using the skills package:

```bash
npx skills add heroui-inc/heroui

```

<span className="text-sm text-muted">
Support Claude Code, Cursor, OpenCode and more.
</span>

### Usage

Skills are **automatically discovered** by your AI assistant, or call it directly using `/heroui-react` command.

Simply ask your AI assistant to:
- Build components using HeroUI v3
- Create pages with HeroUI components
- Customize themes and styles
- Access component documentation

<Callout>
  For more complex use cases, use the [MCP Server](/docs/react/getting-started/mcp-server) which provides real-time access to component documentation and source code.
</Callout>

### What's Included

- HeroUI v3 installation guide
- All HeroUI v3 components with props, examples, and usage patterns
- Theming and styling guidelines
- Design principles and composition patterns

### Structure

```

skills/heroui-react/
├── SKILL.md              # Main skill documentation
├── LICENSE.txt           # Apache License 2.0
└── scripts/              # Utility scripts
    ├── list_components.mjs
    ├── get_component_docs.mjs
    ├── get_source.mjs
    ├── get_styles.mjs
    ├── get_theme.mjs
    └── get_docs.mjs

```

### Related Documentation

- [Agent Skills Specification](https://agentskills.io/home) - Learn about the Agent Skills format
- [Claude Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) - Claude's Skills documentation
- [Cursor Skills](https://cursor.com/docs/context/skills) - Using Skills in Cursor
- [OpenCode Skills](https://opencode.ai/docs/skills) - Using Skills in OpenCode
</page>