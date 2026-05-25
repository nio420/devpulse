import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm"],
  target: "esnext",
  platform: "node",
  bundle: true,
  minify: true,
  outDir: "dist",
  banner: {
    js: `import { createRequire } from 'module';
    const require = createRequire(import.meta.url);`,
  },
});
