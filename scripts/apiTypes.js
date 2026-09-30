const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SERVICE_SPEC = path.resolve(ROOT, "../rate-it-service/openapi.json");
const VENDORED_SPEC = path.join(ROOT, "src/types/openapi.json");
const GENERATED_TYPES = path.join(ROOT, "src/types/api.generated.ts");
// openapi-typescript needs TypeScript 5's compiler API; the app is on
// TypeScript 7, so the generator lives in its own package and lockfile.
const TOOL_DIR = path.join(ROOT, "tools/api-codegen");

const syncSpec = ({ from = SERVICE_SPEC, to = VENDORED_SPEC } = {}) => {
  if (!fs.existsSync(from)) {
    throw new Error(
      `Can't find ${from}.\n` +
        "api:sync copies the spec from a rate-it-service checkout next to this repo. " +
        "Clone anihadagali7/rate-it-service beside rate-it-ui, check out the branch " +
        "you want, and run `npm run api:sync` again."
    );
  }
  fs.copyFileSync(from, to);
};

const isToolInstalled = (toolDir = TOOL_DIR) => {
  const { devDependencies } = JSON.parse(
    fs.readFileSync(path.join(toolDir, "package.json"), "utf8")
  );
  return Object.entries(devDependencies).every(([name, version]) => {
    const installed = path.join(toolDir, "node_modules", name, "package.json");
    return (
      fs.existsSync(installed) &&
      JSON.parse(fs.readFileSync(installed, "utf8")).version === version
    );
  });
};

const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
};

const generateTypes = () => {
  if (!isToolInstalled()) {
    run("npm", [
      "ci",
      "--prefix",
      TOOL_DIR,
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
    ]);
  }
  const cli = path.join(TOOL_DIR, "node_modules/openapi-typescript/bin/cli.js");
  run(process.execPath, [cli, VENDORED_SPEC, "--output", GENERATED_TYPES]);
};

const main = (command) => {
  if (command === "sync") {
    syncSpec();
    console.log(
      `Copied ${path.relative(ROOT, SERVICE_SPEC)} to ${path.relative(
        ROOT,
        VENDORED_SPEC
      )}`
    );
  } else if (command !== "generate") {
    throw new Error("Usage: node scripts/apiTypes.js <sync|generate>");
  }
  generateTypes();
};

if (require.main === module) {
  try {
    main(process.argv[2]);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { syncSpec, isToolInstalled };
