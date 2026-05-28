import { defineCommand } from "citty";
import { d1 } from "./d1.js";
import { kv, r2 } from "./storage.js";
import { tail, deploy } from "./misc.js";

export const wrangler = defineCommand({
  meta: { name: "w", description: "Wrangler commands" },
  subCommands: {
    d1,
    kv,
    r2,
    t: tail,
    d: deploy,
  },
});
