import { defineCommand } from "citty";
import { execSync } from "node:child_process";

export const tail = defineCommand({
  meta: { name: "t", description: "Tail a worker's logs (wrangler tail)" },
  run() {
    execSync("wrangler tail", { stdio: "inherit" });
  },
});

export const deploy = defineCommand({
  meta: { name: "d", description: "Deploy a worker (wrangler deploy)" },
  run() {
    execSync("wrangler deploy", { stdio: "inherit" });
  },
});
