// Static build for GitHub Pages: `npm run build:pages` -> docs/
// Pages serves the repo at https://<user>.github.io/<repo>/, so the base path
// must match the repository name. Override with PAGES_BASE if it differs.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: process.env.PAGES_BASE ?? "/avilon-genesis-site/",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [tailwindcss(), viteReact()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
    rollupOptions: { input: "pages.html" },
  },
});
