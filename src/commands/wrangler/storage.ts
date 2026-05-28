import { defineCommand } from "citty";
import { execSync } from "node:child_process";

const kvCreate = defineCommand({
  meta: { name: "c", description: "Create a KV namespace (wrangler kv:namespace create)" },
  args: {
    name: { type: "positional", description: "Namespace name", required: true },
  },
  run({ args }) {
    execSync(`wrangler kv:namespace create ${args.name}`, { stdio: "inherit" });
  },
});

export const kv = defineCommand({
  meta: { name: "kv", description: "KV namespace commands" },
  subCommands: {
    c: kvCreate,
  },
});

const r2Create = defineCommand({
  meta: { name: "c", description: "Create an R2 bucket (wrangler r2 bucket create)" },
  args: {
    name: { type: "positional", description: "Bucket name", required: true },
  },
  run({ args }) {
    execSync(`wrangler r2 bucket create ${args.name}`, { stdio: "inherit" });
  },
});

export const r2 = defineCommand({
  meta: { name: "r2", description: "R2 bucket commands" },
  subCommands: {
    c: r2Create,
  },
});
