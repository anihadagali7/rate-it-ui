// @vitest-environment node
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const { syncSpec, isToolInstalled } = require("./apiTypes");

describe("apiTypes", () => {
  let dir;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "api-types-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  describe("syncSpec", () => {
    it("copies the service spec byte for byte", () => {
      const from = path.join(dir, "service.json");
      const to = path.join(dir, "vendored.json");
      fs.writeFileSync(from, '{\n  "openapi": "3.0.3"\n}\n');

      syncSpec({ from, to });

      expect(fs.readFileSync(to, "utf8")).toBe('{\n  "openapi": "3.0.3"\n}\n');
    });

    it("explains how to fix a missing rate-it-service checkout", () => {
      const from = path.join(dir, "missing.json");
      const to = path.join(dir, "vendored.json");

      expect(() => syncSpec({ from, to })).toThrow(
        /Can't find .*missing\.json[\s\S]*Clone anihadagali7\/rate-it-service/
      );
      expect(fs.existsSync(to)).toBe(false);
    });
  });

  describe("isToolInstalled", () => {
    const writePackage = (file, contents) => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(contents));
    };

    beforeEach(() => {
      writePackage(path.join(dir, "package.json"), {
        devDependencies: { "openapi-typescript": "7.13.0", typescript: "5.9.3" },
      });
    });

    it("is false before the tool's dependencies are installed", () => {
      expect(isToolInstalled(dir)).toBe(false);
    });

    it("is false when an installed version doesn't match the pin", () => {
      writePackage(
        path.join(dir, "node_modules/openapi-typescript/package.json"),
        { version: "7.13.0" }
      );
      writePackage(path.join(dir, "node_modules/typescript/package.json"), {
        version: "7.0.2",
      });

      expect(isToolInstalled(dir)).toBe(false);
    });

    it("is true when every pinned version is installed", () => {
      writePackage(
        path.join(dir, "node_modules/openapi-typescript/package.json"),
        { version: "7.13.0" }
      );
      writePackage(path.join(dir, "node_modules/typescript/package.json"), {
        version: "5.9.3",
      });

      expect(isToolInstalled(dir)).toBe(true);
    });
  });
});
