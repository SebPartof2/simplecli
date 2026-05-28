#!/usr/bin/env node
import { execSync } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

const rl = readline.createInterface({ input, output });
const raw = (await rl.question("Bump level (patch/minor/major) [patch]: ")).trim().toLowerCase();
rl.close();

const level = raw || "patch";
if (!["patch", "minor", "major"].includes(level)) {
  console.error(`\n✗ Invalid bump level: ${level}`);
  process.exit(1);
}

console.log(`\n→ Bumping ${level}...`);
run(`npm version ${level}`);

console.log("\n→ Pushing commit and tag...");
run("git push");
run("git push --tags");

console.log("\n→ Publishing to npm...");
run("npm publish");

console.log("\n✓ Released!\n");
