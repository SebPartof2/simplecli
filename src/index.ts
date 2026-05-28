#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { execSync } from "node:child_process";
import { wrangler } from "./commands/wrangler/index.js";
import { pnpm, npm, bun } from "./commands/pm.js";
import { install } from "./commands/install.js";

// `sli <n|p|b> <script>` falls through to `<pm> run <script>` when <script>
// isn't a known pm subcommand. citty would otherwise reject the unknown name.
const pmMap: Record<string, string> = { n: "npm", p: "pnpm", b: "bun" };
const pmSubcommands = new Set(["i", "a", "r", "u", "l", "d", "aud"]);
const argv = process.argv.slice(2);
if (
  argv.length >= 2 &&
  pmMap[argv[0]] &&
  !pmSubcommands.has(argv[1]) &&
  !argv[1].startsWith("-")
) {
  const pm = pmMap[argv[0]];
  const rest = argv.slice(1).join(" ");
  execSync(`${pm} run ${rest}`, { stdio: "inherit" });
  process.exit(0);
}

const main = defineCommand({
  meta: {
    name: "sli",
    version: "0.1.0",
    description: "simplecli — shorten common dev commands",
  },
  subCommands: {
    w: wrangler,
    p: pnpm,
    n: npm,
    b: bun,
    install,
  },
});

runMain(main);
