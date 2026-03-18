import process from "node:process";

import tailwindcss from "@tailwindcss/vite";
// import devtools from "solid-devtools/vite";
import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";

/// Integrates './data' into the build process
function labData() {
  let _exams: string;
  let _profiles: string;
  let _meta: string;

  // TODO: make possible to import the data into the program
  // see: https://rollupjs.org/plugin-development/#this-emitfile
  return {
    name: "lab-data",
    buildStart() { },
    generateBundle() { },
  };
}

export default defineConfig(({ mode }) => {
  const _env = loadEnv(mode, ".", "");
  return {
    plugins: [
      labData(),
      // devtools({
      //   autoname: true,
      //   locator: {
      //     targetIDE: ({ file }: DevtoolsPluginOptions) => `file://${__dirname}/${file}`,
      //     jsxLocation: true,
      //     componentLocation: true,
      //   },
      // }),
      solidPlugin(),
      tailwindcss(),
    ],
    define: {},
    server: {
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify. file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
    },
    build: {
      target: "ESNext",
    },
  };
});
