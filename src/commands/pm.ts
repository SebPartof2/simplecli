import { defineCommand } from "citty";
import { execSync } from "node:child_process";

type PM = "pnpm" | "npm" | "bun";

function run(cmd: string) {
  execSync(cmd, { stdio: "inherit" });
}

function makeCommands(pm: PM) {
  // install (no args)
  const install = defineCommand({
    meta: { name: "i", description: `${pm} install` },
    run() {
      run(`${pm} install`);
    },
  });

  // add <pkg> [-d]
  const addCmd = pm === "npm" ? "install" : "add";
  const devFlag = pm === "npm" ? "--save-dev" : "-D";
  const add = defineCommand({
    meta: { name: pm === "npm" ? "i" : "a", description: `${pm} ${addCmd} <pkg>` },
    args: {
      pkg: { type: "positional", description: "Package name", required: true },
      d: { type: "boolean", description: "Add as dev dependency", default: false },
    },
    run({ args }) {
      const dev = args.d ? ` ${devFlag}` : "";
      run(`${pm} ${addCmd} ${args.pkg}${dev}`);
    },
  });

  // remove <pkg>
  const removeCmd = pm === "npm" ? "uninstall" : "remove";
  const remove = defineCommand({
    meta: { name: "r", description: `${pm} ${removeCmd} <pkg>` },
    args: {
      pkg: { type: "positional", description: "Package name", required: true },
    },
    run({ args }) {
      run(`${pm} ${removeCmd} ${args.pkg}`);
    },
  });

  // update <pkg>
  const update = defineCommand({
    meta: { name: "u", description: `${pm} update <pkg>` },
    args: {
      pkg: { type: "positional", description: "Package name", required: true },
    },
    run({ args }) {
      run(`${pm} update ${args.pkg}`);
    },
  });

  // list
  const listCmd = pm === "bun" ? "pm ls" : "list";
  const list = defineCommand({
    meta: { name: "l", description: `${pm} ${listCmd}` },
    run() {
      run(`${pm} ${listCmd}`);
    },
  });

  // dedupe
  const dedupe = defineCommand({
    meta: { name: "d", description: `${pm} dedupe` },
    run() {
      run(`${pm} dedupe`);
    },
  });

  // audit [-f]
  const audit = defineCommand({
    meta: { name: "aud", description: `${pm} audit` },
    args: {
      f: { type: "boolean", description: "Fix vulnerabilities", default: false },
    },
    run({ args }) {
      const fix = args.f ? " --fix" : "";
      run(`${pm} audit${fix}`);
    },
  });

  return { install, add, remove, update, list, dedupe, audit };
}

function makeRoot(pm: PM) {
  const { install, add, remove, update, list, dedupe, audit } = makeCommands(pm);

  // npm uses "i" for both install (no args) and install <pkg>
  // pnpm/bun use "i" for install and "a" for add
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subCommands: Record<string, any> =
    pm === "npm"
      ? { i: add, r: remove, u: update, l: list, d: dedupe, aud: audit }
      : { i: install, a: add, r: remove, u: update, l: list, d: dedupe, aud: audit };

  return defineCommand({
    meta: { name: pm === "pnpm" ? "p" : pm === "npm" ? "n" : "b", description: `${pm} commands` },
    args: {
      script: { type: "positional", description: "Run a package.json script", required: false },
    },
    subCommands,
    async run({ args, rawArgs }) {
      // If a positional script name was passed and no subcommand matched, run it
      if (args.script) {
        run(`${pm} run ${args.script}`);
      }
    },
  });
}

export const pnpm = makeRoot("pnpm");
export const npm = makeRoot("npm");
export const bun = makeRoot("bun");
