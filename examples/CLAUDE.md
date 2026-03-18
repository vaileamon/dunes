# My Workspace

## Me
[Your name], [your role] at [company].

## Preferences
- [How you like to work with AI — be specific, these are instructions]

## People
| Who | Role | Project |
|-----|------|---------|

## Projects
| Name | What | Status |
|------|------|--------|

> Each project has its own context in `dunes/{name}/CLAUDE.md`

## Terms
| Term | Meaning |
|------|---------|

## Tools
| Tool | Used for |
|------|----------|

## Dunes Convention
This workspace follows the [Dunes](https://github.com/vaileamon/dunelin) convention. Structure:

```
CLAUDE.md                          ← you are here (workspace context)
dunes/
  {project}/
    CLAUDE.md                      ← project context (architecture, stack)
    HUMANS.md                      ← team members
    dune.json                      ← metadata (repos, status, tags)
    changelog/                     ← decision log across sessions
    repos/                         ← code repositories (not context)
```

**Rules for AI agents:**
- Read project CLAUDE.md before working on any project
- After significant work, create a changelog entry in `dunes/{project}/changelog/`
- Changelog format: `YYYY-MM-DD-short-description.md` with sections: Context, What Was Done, Decisions Made, Open Questions
- Never modify files inside `repos/` without explicit instruction to work on code
- `dune.json` contains project metadata — repos, status, tags
