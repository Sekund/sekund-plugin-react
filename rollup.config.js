import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";

const isProd = process.env.BUILD === "production";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

export default {
  input: "src/main.tsx",
  output: [
    {
      file: "main.js",
      sourcemap: true,
      format: "cjs",
      exports: "default",
      banner,
      compact: true,
    },
  ],
  external: ["obsidian"],
  plugins: [
    json(),
    postcss({
      config: {
        path: "./postcss.config.js",
      },
      extensions: [".css"],
      minimize: true,
      inject: {
        insertAt: "top",
      },
    }),
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    nodePolyfills(),
  ],
};
