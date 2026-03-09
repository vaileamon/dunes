#!/usr/bin/env bun

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "init": {
    const { runInit } = await import("./commands/init.ts");
    await runInit(args.slice(1));
    break;
  }
  case "update": {
    const { runUpdate } = await import("./commands/update.ts");
    const force = args.includes("--force") || args.includes("-f");
    await runUpdate({ force });
    break;
  }
  case "mcp": {
    const { runMcp } = await import("./mcp/server.ts");
    await runMcp();
    break;
  }
  case "--help":
  case "-h":
  case undefined: {
    console.log(`
dunelin — scaffold and manage agentic workspaces

Usage:
  dunelin init [name]    Set up a new workspace (interactive)
  dunelin update         Pull latest context from shadow repo
  dunelin update --force Apply all changes without prompting
  dunelin mcp            Start the MCP server (stdio)
  dunelin --help         Show this help

Learn more: https://dunelin.com
`);
    break;
  }
  default: {
    console.error(`Unknown command: ${command}`);
    console.error(`Run "dunelin --help" for usage.`);
    process.exit(1);
  }
}
