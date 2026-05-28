#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { wrangler } from "./commands/wrangler/index.js";
import { pnpm, npm, bun } from "./commands/pm.js";
import { install } from "./commands/install.js";

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
