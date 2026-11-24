#!/usr/bin/env node
// Post-step for the GitHub Pages build: pages.html -> index.html (+ 404.html),
// drop the platform-only __grok folder and disable Jekyll processing.
import { copyFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = "docs";
renameSync(join(out, "pages.html"), join(out, "index.html"));
copyFileSync(join(out, "index.html"), join(out, "404.html"));
rmSync(join(out, "__grok"), { recursive: true, force: true });
writeFileSync(join(out, ".nojekyll"), "");
console.log("[pages] docs/ ready for GitHub Pages");
