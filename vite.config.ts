/** biome-ignore-all lint/complexity/noUselessTernary: better readability */
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig, loadEnv, type Rollup } from "vite";
import solidPlugin from "vite-plugin-solid";

/// Integrates './data' into the build process
function labData(): Rollup.Plugin {
    const module_name = "lab-data";
    const dummy_data_path = `${__dirname}/data/dummyData.ts`;

    let _exams: string;
    let _profiles: string;
    let _meta: string;

    // TODO: make possible to import the data into the program
    // see: https://rollupjs.org/plugin-development/#this-emitfile
    return {
        name: "lab-data",
        // Generate module from 'data/data.xlsx'
        async buildStart(_options) {
            if (process.env.USE_DUMMY_LABDATA) return;
            // TODO: Generate actual data
        },
        // Resolve module name
        async resolveId(source, _importer, _options) {
            if (source === module_name) {
                return dummy_data_path;
            }
            return null;
        },
    };
}

export default defineConfig(({ mode }) => {
    const _env = loadEnv(mode, ".", "");
    return {
        plugins: [
            labData(),
            devtools({
                autoname: true,
            }),
            solidPlugin(),
            tailwindcss(),
        ],
        define: {},
        resolve: {
            alias: {
                "@root": path.resolve(__dirname, "src"),
            },
        },
        server: {
            port: 3000,
            // HMR is disabled in AI Studio via DISABLE_HMR env var.
            // Do not modify. file watching is disabled to prevent flickering during agent edits.
            hmr: process.env.DISABLE_HMR ? false : true,
        },
        build: {
            outDir: "dist",
            target: "ESNext",
        },
    };
});
