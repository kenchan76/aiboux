#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const shouldCommit = process.argv.includes("--commit");
const ts = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const checkpointDir = "all_log/checkpoints";
const patchDir = "all_log/patches";
const deployDir = "all_log/deploys";

for (const dir of [checkpointDir, patchDir, deployDir]) mkdirSync(dir, { recursive: true });

function runText(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
    ...options,
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function writeCommand(filePath, command, args, options = {}) {
  const result = runText(command, args, options);
  writeFileSync(filePath, `${result.stdout}${result.stderr}`, "utf8");
  return result;
}

function writeValue(filePath, value) {
  writeFileSync(filePath, `${value.trimEnd()}\n`, "utf8");
}

const files = {
  statusBefore: path.join(checkpointDir, `${ts}_status_before.txt`),
  headBefore: path.join(checkpointDir, `${ts}_head_before.txt`),
  originMainBefore: path.join(checkpointDir, `${ts}_origin_main_before.txt`),
  diffBefore: path.join(patchDir, `${ts}_before_deploy.patch`),
  diffStagedBefore: path.join(patchDir, `${ts}_before_deploy_staged.patch`),
  logBefore: path.join(checkpointDir, `${ts}_log_before.txt`),
  wipCommit: path.join(checkpointDir, `${ts}_wip_commit.txt`),
  deploymentsBefore: path.join(deployDir, `${ts}_deployments_before.txt`),
};

writeCommand(files.statusBefore, "git", ["status", "--short"]);
writeCommand(files.headBefore, "git", ["rev-parse", "HEAD"]);

const originMain = runText("git", ["rev-parse", "origin/main"]);
writeValue(files.originMainBefore, originMain.status === 0 ? originMain.stdout : `origin/main unavailable\n${originMain.stderr}`);

writeCommand(files.diffBefore, "git", ["diff"]);
writeCommand(files.diffStagedBefore, "git", ["diff", "--staged"]);
writeCommand(files.logBefore, "git", ["log", "--oneline", "-10"]);

if (shouldCommit) {
  runText("git", ["add", "-A"]);
  const commit = runText("git", ["commit", "-m", `WIP shop aiboux tenant deploy checkpoint ${ts}`]);
  const headAfter = runText("git", ["rev-parse", "HEAD"]);
  writeValue(
    files.wipCommit,
    [
      `timestamp=${ts}`,
      `commit_status=${commit.status}`,
      `head_after=${headAfter.stdout.trim() || "unknown"}`,
      "commit_stdout:",
      commit.stdout,
      "commit_stderr:",
      commit.stderr,
    ].join("\n"),
  );
} else {
  const head = runText("git", ["rev-parse", "HEAD"]);
  writeValue(files.wipCommit, `timestamp=${ts}\ncommit_skipped=true\nhead_after=${head.stdout.trim() || "unknown"}`);
}

const cfEnv = "/home/pkkatsu/.aiboux-secrets/cloudflare.env";
const deployments = spawnSync(
  "bash",
  ["-lc", `set -a; [ -f ${cfEnv} ] && source ${cfEnv}; set +a; npx wrangler deployments list --name aiboux`],
  { encoding: "utf8", shell: false },
);
writeValue(files.deploymentsBefore, `${deployments.stdout || ""}${deployments.stderr || ""}`);

console.log(`SHOP_WIP_CHECKPOINT_CREATED timestamp=${ts}`);
for (const [key, filePath] of Object.entries(files)) console.log(`${key}=${filePath}`);
