# Dunes

> Context accumulates like sand — shaped by wind, reshaped by work.

AI coding agents discover context by harvesting files from your workspace. Dunes is a folder convention that makes this work across multiple projects — your agent reads the structure and immediately knows who you are, what you're building, and what decisions were made.

No CLI. The AI harvest **is** the interface. You start your agent from the workspace root, it reads everything, and it knows.

---

## Why This Exists

Today's AI coding tools (Claude Code, Claude Workspace, OpenAI Codex, Google Jules, OpenClaw, Cursor, and more every week) discover context by harvesting files from your workspace. They look for `CLAUDE.md`, `.cursorrules`, and similar files and load them automatically. That's the only mechanism — there's no API to feed context, no way to say "read this before you start."

This works great for single projects. But if you manage multiple projects across multiple workers — agents on different machines, teammates, headless CI agents — the question becomes: **how do you organize context so everyone sees the full picture?**

Dunes is a workaround. It structures your workspace so the harvester naturally finds everything it needs — who you are, what projects exist, how they're built, what decisions were made. It's an opinionated folder convention, nothing more.

**This should eventually be unnecessary.** When AI tools ship proper features like `.claudeignore` (to control what the harvester sees), scoped context loading (load only what's relevant), or native multi-project support — the need for a convention like this shrinks. Until then, Dunes solves the problem with folders and markdown.

---

## Why "Dunes"

A dune isn't engineered. It forms naturally — grain by grain, shaped by wind and time. It shifts when conditions change. It's distinct, but part of a larger landscape.

That's how project context works with AI agents. You don't design it upfront. It accumulates **grain by grain, iteration by iteration** — every session adds a decision, refines an architecture description, logs a pivot. An agent updates the CLAUDE.md after a deep refactor. Another drops a changelog entry after a strategy discussion. The context grows organically, shaped by actual work, not by someone sitting down to write documentation.

Each project is its own dune: shaped by different forces, different terrain, but following the same physics. A dune is also **visible from a distance**. An AI agent landing in your workspace should see the landscape immediately — what exists, what matters, where to look. That's what the convention provides: legibility at a glance.

The workspace is the desert. Each project is a dune. The wind is you and your agents, reshaping context as you work.

---

## The Convention

```
my-workspace/
├── CLAUDE.md                    ← workspace context (you, your projects, terms)
└── dunes/
    ├── project-a/
    │   ├── CLAUDE.md            ← project context (architecture, stack, decisions)
    │   ├── HUMANS.md            ← who works on this
    │   ├── dune.json            ← project metadata (repos, status, tags)
    │   ├── changelog/           ← decision log, session summaries
    │   └── repos/               ← code repositories (cloned, not managed)
    └── project-b/
        ├── CLAUDE.md
        ├── dune.json
        └── repos/
```

That's it. Create the folders, write the markdown, and **always start your AI agent from the workspace root.** The harvester walks down from where you launch it — starting from the root means it discovers the workspace CLAUDE.md first, then every dune's context below it.

---

## Files

### `CLAUDE.md` (workspace root)

The entry point. Your AI reads this first. It should contain:

- **Who you are** — name, role, company
- **What projects exist** — table with name, description, status
- **Shared terms** — vocabulary your AI needs to understand
- **Tools & integrations** — what you use across projects
- **People** — who's who, across all projects
- **Preferences** — how you like to work with AI

This file also explains the Dunes convention to the AI, so it knows where to find project-specific context and how to maintain it.

See [examples/CLAUDE.md](examples/CLAUDE.md) for a starter template.

### `CLAUDE.md` (per dune)

Each dune has its own context file. Project-specific:

- **Overview** — what this project is, current status
- **Architecture** — how it's built, key patterns
- **Tech stack** — frameworks, languages, infrastructure
- **Key concepts** — project-specific terms and domain language
- **Dev commands** — how to run, test, deploy

### `HUMANS.md`

Optional. Who works on this project, their roles, contact info. Useful when your AI needs to know who to reference in tickets or decisions.

### `dune.json`

Project metadata. Not for AI context — for tooling and humans:

```json
{
  "name": "my-project",
  "description": "What this project does",
  "status": "active",
  "repos": [
    { "name": "api", "url": "git@github.com:company/api.git" },
    { "name": "web", "url": "git@github.com:company/web.git" }
  ],
  "tags": ["backend", "typescript"]
}
```

### `changelog/`

Decision log. After significant work — features, architecture changes, strategy shifts — drop a markdown file:

```
changelog/
  2026-03-04-auth-system-redesign.md
  2026-03-09-messaging-first-pivot.md
```

Format: `YYYY-MM-DD-short-description.md` with sections: Context, What Was Done, Decisions Made, Open Questions.

This is your AI's long-term memory across sessions. A new agent can read the changelog and understand *why* things are the way they are.

### `repos/`

Where code lives. Clone your repos here. These are heavy (node_modules, .git history, build artifacts) and should be invisible to the AI's context harvester.

---

## Getting Started

**1. Create the workspace:**

```bash
mkdir my-workspace && cd my-workspace
mkdir -p dunes
```

**2. Create the root context file:**

Copy [examples/CLAUDE.md](examples/CLAUDE.md) to your workspace root and edit it with your info.

**3. Add a project (dune):**

```bash
mkdir -p dunes/my-project/{changelog,repos}
```

Copy the templates from [examples/dune/](examples/dune/) into your project folder and edit them.

**4. Clone your repos:**

```bash
cd dunes/my-project/repos
git clone git@github.com:you/your-repo.git
```

**5. Start your agent from the workspace root:**

```bash
cd ~/my-workspace
claude  # or cursor, windsurf, etc.
```

This is key — always launch from the workspace root, not from inside a project. The harvester walks the tree from where you start. From the root, it picks up everything: your identity, your projects, their context, their changelogs.

---

## Sharing Context

The workspace (minus `repos/`) is lightweight markdown. Share it however you want:

- **Git** — push the workspace to GitHub. Your team clones it, then clones their repos separately into `repos/`.
- **Syncthing** — real-time peer-to-peer sync between machines. Add `repos/` to `.stignore`. No cloud, no account.
- **Dropbox/iCloud** — works if you can exclude `repos/` from sync.
- **Just copy the files** — it's markdown.

The convention doesn't care how files move between machines. It only cares that they're in the right place when your AI tool opens.

> **How I use it:** I run multiple agent machines (laptop + Mac Mini with [OpenClaw](https://github.com/nichochar/open-claw)) and use [Syncthing](https://syncthing.net/) to keep the workspace in sync across all of them. Context files propagate in seconds, repos are excluded via `.stignore`. No git ceremony, no manual sync — edit a CLAUDE.md on any machine and every agent sees it immediately.

---

## Making `repos/` Invisible to the Harvester

This is the main technical challenge. AI tools harvest context by walking the file tree, typically respecting `.gitignore`. You want the harvester to read your CLAUDE.md files but **not** crawl into `repos/` (which contain node_modules, build artifacts, and thousands of irrelevant files).

**This mostly works out of the box.** Each repo inside `repos/` is its own git repository with its own `.gitignore`. The harvester walks into the repo, respects its `.gitignore`, and skips `node_modules/`, `dist/`, etc. The workspace itself is just files — it doesn't need to be a git repo, and it doesn't need its own `.gitignore`.

**The remaining gap:** there's no way to tell the harvester "don't enter `repos/` at all." It still walks in and reads source code, which burns context tokens when you're just trying to have a workspace-level conversation. A dedicated `.claudeignore` file — respected by the harvester independently from git — would solve this. But that feature doesn't exist yet.

For now, this is a minor annoyance, not a blocker. The harvester reads your context files *and* some code. When you're working on a specific project, that code context is usually helpful anyway.

---

## FAQ

**Do I need a CLI tool?**
No. Your AI agent *is* the CLI. It reads the convention from the root CLAUDE.md, creates folders, writes changelogs, updates context files. You tell it "add a new dune for my-project" and it does it — no scaffolding tool needed. The convention is simple enough that any AI agent can follow it after reading the workspace context once.

**Does it work with Cursor / Windsurf / other tools?**
Yes. Most AI coding tools read `CLAUDE.md` natively at this point. The convention works as-is.

**Can I nest dunes?**
Keep it flat. One level of `dunes/project-name/` is enough. If a project is complex, add more detail to its CLAUDE.md rather than creating sub-dunes.

**What if my AI tool doesn't read CLAUDE.md?**
The convention still works as documentation for humans. But the real value comes from AI tools that auto-discover context files.

**How is this different from just having a docs/ folder?**
It's not, really. Dunes is just an opinionated workflow — which files to create, where to put them, what to put in them. The value is that someone already thought about it so you don't have to.

**Will this become obsolete?**
Hopefully. If AI tools evolve to handle multi-project context natively — scoped loading, `.claudeignore`, project-aware harvesters — the convention becomes unnecessary. That's fine. Dunes is a pragmatic solution for today's constraints, not an architecture for the future.

---

## Examples

See the [examples/](examples/) folder for starter templates:

- `examples/CLAUDE.md` — workspace root context
- `examples/dune/CLAUDE.md` — project context
- `examples/dune/HUMANS.md` — team file
- `examples/dune/dune.json` — project metadata
- `examples/dune/changelog/YYYY-MM-DD-example.md` — changelog entry

