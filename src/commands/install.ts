import { defineCommand } from "citty";
import { execSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { platform } from "node:process";

type OS = "win" | "mac" | "linux";

function getOS(): OS {
  if (platform === "win32") return "win";
  if (platform === "darwin") return "mac";
  return "linux";
}

function isInstalled(cmd: string): boolean {
  const check = spawnSync(platform === "win32" ? "where" : "which", [cmd], {
    stdio: "pipe",
  });
  return check.status === 0;
}

function run(cmd: string) {
  execSync(cmd, { stdio: "inherit" });
}

function log(msg: string) {
  console.log(`\n→ ${msg}`);
}

function skip(name: string) {
  console.log(`  ✓ ${name} already installed, skipping`);
}

function warn(msg: string) {
  console.warn(`  ⚠ ${msg}`);
}

// ─── Node check ──────────────────────────────────────────────────────────────

function checkNode() {
  if (!isInstalled("node")) {
    warn("Node.js is not installed. sli requires Node.js — install it from https://nodejs.org before continuing.");
    process.exit(1);
  }
}

// ─── CLI tools ───────────────────────────────────────────────────────────────

function installPnpm() {
  if (isInstalled("pnpm")) { skip("pnpm"); return; }
  log("Installing pnpm...");
  run("npm install -g pnpm");
}

function installBun(os: OS) {
  if (isInstalled("bun")) { skip("bun"); return; }
  log("Installing bun...");
  if (os === "win") {
    run("powershell -c \"irm bun.sh/install.ps1 | iex\"");
  } else {
    run("curl -fsSL https://bun.sh/install | bash");
  }
}

function installWrangler() {
  if (isInstalled("wrangler")) { skip("wrangler"); return; }
  log("Installing wrangler...");
  run("npm install -g wrangler");
}

// ─── Desktop apps ────────────────────────────────────────────────────────────

function installVSCode(os: OS) {
  if (isInstalled("code")) { skip("VSCode"); return; }
  log("Installing VSCode...");
  if (os === "win") run("winget install Microsoft.VisualStudioCode");
  else if (os === "mac") run("brew install --cask visual-studio-code");
  else run("snap install code --classic");
}

function isChromeInstalled(os: OS): boolean {
  if (os === "win") {
    return (
      existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe") ||
      existsSync("C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe")
    );
  }
  if (os === "mac") {
    return existsSync("/Applications/Google Chrome.app");
  }
  return isInstalled("google-chrome") || isInstalled("google-chrome-stable");
}

function installChrome(os: OS) {
  if (isChromeInstalled(os)) { skip("Chrome"); return; }
  log("Installing Chrome...");
  if (os === "win") run("winget install Google.Chrome");
  else if (os === "mac") run("brew install --cask google-chrome");
  else run("snap install google-chrome");
}

function installGit(os: OS) {
  if (isInstalled("git")) { skip("git"); return; }
  log("Installing git...");
  if (os === "win") run("winget install Git.Git");
  else if (os === "mac") run("brew install git");
  else run("sudo apt install -y git");
}

// ─── GitHub CLI ─────────────────────────────────────────────────────────────

function installGitHubCLI(os: OS) {
  if (isInstalled("gh")) { skip("GitHub CLI"); return; }
  log("Installing GitHub CLI...");
  if (os === "win") run("winget install GitHub.cli");
  else if (os === "mac") run("brew install gh");
  else run("sudo apt install -y gh");
}

// ─── Discord ─────────────────────────────────────────────────────────────────

function installDiscord(os: OS) {
  log("Installing Discord...");
  if (os === "win") run("winget install Discord.Discord");
  else if (os === "mac") run("brew install --cask discord");
  else run("snap install discord");
}

// ─── Command ─────────────────────────────────────────────────────────────────

export const install = defineCommand({
  meta: { name: "install", description: "Install tools and apps on a new system" },
  args: {
    d: { type: "boolean", description: "Also install Discord", default: false },
  },
  run({ args }) {
    const os = getOS();

    console.log(`\nsli install — detected OS: ${os}`);
    console.log("─".repeat(40));

    checkNode();

    console.log("\n[ CLI Tools ]");
    installPnpm();
    installBun(os);
    installWrangler();
    installGitHubCLI(os);

    console.log("\n[ Desktop Apps ]");
    installGit(os);
    installVSCode(os);
    installChrome(os);

    if (args.d) {
      console.log("\n[ Discord ]");
      installDiscord(os);
    }

    console.log("\n✓ Done!\n");
  },
});
