import { defineConfig } from "vite";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export default defineConfig({
  publicDir: false,
  resolve: { preserveSymlinks: true },
  server: {
    fs: {
      strict: true,
      allow: ["index.html", "gda_cloud_terminal_live/public"],
      deny: ["**/.env*", "**/*.b64", "**/secrets/**"],
    },
  },
  plugins: [
    {
      name: "gda-workspace",
      configureServer(server) {
        const { createApp } = require("./gda_cloud_terminal_live/server.js");
        server.middlewares.use("/api", createApp());
      },
    },
  ],
  build: { rollupOptions: { input: "index.html" } },
});
