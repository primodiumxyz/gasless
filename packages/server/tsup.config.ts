import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts", "react/index": "src/react/index.ts", "bin/cli": "bin/cli.ts" },
  outDir: "dist",
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  tsconfig: "tsconfig.build.json",
});
