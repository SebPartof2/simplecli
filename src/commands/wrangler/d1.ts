import { defineCommand } from "citty";
import { execSync } from "node:child_process";

const d1Create = defineCommand({
  meta: { name: "c", description: "Create a D1 database (wrangler d1 create)" },
  args: {
    name: { type: "positional", description: "Database name", required: true },
  },
  run({ args }) {
    execSync(`wrangler d1 create ${args.name}`, { stdio: "inherit" });
  },
});

const migrationsApply = defineCommand({
  meta: { name: "a", description: "Apply D1 migrations (wrangler d1 migrations apply)" },
  args: {
    remote: { type: "boolean", description: "Run against remote D1", default: false },
  },
  run({ args }) {
    const flag = args.remote ? " --remote" : "";
    execSync(`wrangler d1 migrations apply${flag}`, { stdio: "inherit" });
  },
});

const migrationsList = defineCommand({
  meta: { name: "l", description: "List D1 migrations (wrangler d1 migrations list)" },
  args: {
    remote: { type: "boolean", description: "Run against remote D1", default: false },
  },
  run({ args }) {
    const flag = args.remote ? " --remote" : "";
    execSync(`wrangler d1 migrations list${flag}`, { stdio: "inherit" });
  },
});

const migrationsCreate = defineCommand({
  meta: { name: "c", description: "Create a D1 migration file (wrangler d1 migrations create)" },
  args: {
    name: { type: "positional", description: "Migration name", required: true },
  },
  run({ args }) {
    execSync(`wrangler d1 migrations create ${args.name}`, { stdio: "inherit" });
  },
});

const migrations = defineCommand({
  meta: { name: "m", description: "D1 migrations" },
  subCommands: {
    a: migrationsApply,
    l: migrationsList,
    c: migrationsCreate,
  },
});

export const d1 = defineCommand({
  meta: { name: "d1", description: "D1 database commands" },
  subCommands: {
    c: d1Create,
    m: migrations,
  },
});
