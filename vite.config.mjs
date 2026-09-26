import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

// JSX lives in .js files under src/ (a CRA convention), and Vite parses .js files as
// plain JS — Rolldown's build transform ignores `oxc.lang`. Compile that JSX before
// Vite's own transform runs, until the files are renamed in the TypeScript migration.
function jsxInJs() {
  let development = false;
  return {
    name: "rate-it:jsx-in-js",
    enforce: "pre",
    configResolved(config) {
      development = config.command === "serve" && !config.isProduction;
    },
    async transform(code, id) {
      if (!/\/src\/.*\.js$/.test(id.split("?")[0])) return null;
      const result = await transformWithOxc(code, id, {
        lang: "jsx",
        jsx: { runtime: "automatic", development },
      });
      return { code: result.code, map: result.map };
    },
  };
}

export default defineConfig({
  plugins: [jsxInJs(), react()],
  optimizeDeps: {
    // The dependency scan crawls src/ with its own Rolldown pass, outside the plugins.
    rolldownOptions: {
      moduleTypes: { ".js": "jsx" },
    },
  },
  server: {
    // The API's CORS allowlist and .claude/launch.json expect port 3000.
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    // scripts/heroku-start.js serves build/.
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    include: ["src/**/*.test.{js,jsx}"],
  },
});
