# Dunes

> Context accumulates like sand — shaped by wind, reshaped by work.

Dunes is a convention for organizing AI agent workspaces. No CLI, no dependencies, no build step. Just a folder structure and markdown files that AI tools read natively.

Your AI starts every session cold. Dunes gives it memory.

---

## Why This Exists

Today's AI coding tools (Claude Code, Cursor, Windsurf) discover context by harvesting files from your workspace. They look for `CLAUDE.md`, `.cursorrules`, and similar files and load them automatically. That's the only mechanism — there's no API to feed context, no way to say "read this before you start."

This works great for single projects. But if you manage multiple projects, the question becomes: **how do you organize context so your AI sees the full picture?**

Dunes is a workaround. It structures your workspace so the harvester naturally finds everything it needs — who you are, what projects exist, how they're built, what decisions were made. It's an opinionated folder convention, nothing more.

**This should eventually be unnecessary.** When AI tools ship proper features like `.claudeignore` (to control what the harvester sees), scoped context loading (load only what's relevant), or native multi-project support — the need for a convention like this shrinks. Until then, Dunes solves the problem with folders and markdown.

---

## Why "Dunes"

A dune isn't engineered. It forms naturally — grain by grain, shaped by wind and time. It shifts when conditions change. It's distinct, but part of a larger landscape.

That's how project context works. You don't design it upfront. It accumulates through work — decisions made, architecture chosen, people involved, terms defined. Each project is its own dune: shaped by different forces, different terrain, but following the same physics.

A dune is also **visible from a distance**. An AI agent landing in your workspace should see the landscape immediately — what exists, what matters, where to look. That's what the convention provides: legibility at a glance.

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

That's it. Create the folders, write the markdown, open your AI tool in the workspace root. It reads everything automatically.

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

**5. Open in your AI tool:**

```bash
cd ~/my-workspace
claude  # or cursor, windsurf, etc.
```

Your AI reads the CLAUDE.md files and knows everything.

---

## Sharing Context

The workspace (minus `repos/`) is lightweight markdown. Share it however you want:

- **Git** — make the workspace a repo, `.gitignore` the `repos/` folders. Push to GitHub. Your team clones it.
- **Syncthing** — real-time peer-to-peer sync between machines. Add `repos/` to `.stignore`. No cloud, no account.
- **Dropbox/iCloud** — works if you can exclude `repos/` from sync.
- **Just copy the files** — it's markdown.

The convention doesn't care how files move between machines. It only cares that they're in the right place when your AI tool opens.

> **How the author uses it:** I run multiple agent machines (laptop + Mac Mini with [OpenClaw](https://github.com/nichochar/open-claw)) and use [Syncthing](https://syncthing.net/) to keep the workspace in sync across all of them. Context files propagate in seconds, repos are excluded via `.stignore`. No git ceremony, no manual sync — edit a CLAUDE.md on any machine and every agent sees it immediately.

---

## Making `repos/` Invisible to the Harvester

This is the main technical challenge. AI tools harvest context by walking the file tree, typically respecting `.gitignore`. You want the harvester to read your CLAUDE.md files but **not** crawl into `repos/` (which contain node_modules, build artifacts, and thousands of irrelevant files).

**Current workaround:** Make the workspace a git repo and gitignore the repos:

```bash
cd my-workspace
git init
echo "dunes/*/repos/" > .gitignore
git add -A && git commit -m "init workspace"
```

The harvester respects `.gitignore` and skips `repos/`. Your context files are visible. Your code repos are not.

**Why this is a workaround:** You're creating a git repo just to get a `.gitignore`. The workspace doesn't really need version control (that's what your code repos are for). A dedicated `.claudeignore` file — respected by the harvester independently from git — would make this unnecessary. But that feature doesn't exist yet.

If your workspace IS already a git repo (e.g., you push context to GitHub for sharing), this isn't a workaround at all — it's just how it works.

---

## FAQ

**Do I need a CLI tool?**
No. Dunes is just folders and files. Create them however you want.

**Does it work with Cursor / Windsurf / other tools?**
Yes. Rename `CLAUDE.md` to `.cursorrules` or whatever your tool reads. The convention is the same — only the filename changes.

**Can I nest dunes?**
Keep it flat. One level of `dunes/project-name/` is enough. If a project is complex, add more detail to its CLAUDE.md rather than creating sub-dunes.

**What if my AI tool doesn't read CLAUDE.md?**
The convention still works as documentation for humans. But the real value comes from AI tools that auto-discover context files.

**How is this different from just having a docs/ folder?**
Placement and naming. AI tools look for specific files (CLAUDE.md, .cursorrules) in specific locations. Dunes puts context where AI tools expect to find it, following their native discovery patterns.

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

---

## License

MIT
