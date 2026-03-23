/** biome-ignore-all lint/complexity/noUselessTernary: better readability */
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import type { Exam, ExamCategory, ExamProfile, Profile } from "@root/lab";
import tailwindcssPlugin from "@tailwindcss/vite";
import solidDevtoolsPlugin from "solid-devtools/vite";
import { defineConfig, loadEnv, type Rollup } from "vite";
import solidPlugin from "vite-plugin-solid";
import xlsx from "xlsx";

/// NOTE: Keep in sync with ./data/data.meta.ts
interface LabData {
    data: ExamProfile[];
    last_updated: string;
}

// NOTE: Keep in sync with ./data/data.xlsx
function labDataFromWorkBook(wb: xlsx.WorkBook): LabData {
    const toJson = xlsx.utils.sheet_to_json;

    assert(wb.Sheets.Meta);
    const meta = toJson(wb.Sheets.Meta)[0] as Omit<LabData, "data">;

    assert(wb.Sheets.Examenes);
    const exams_wb = toJson(wb.Sheets.Examenes) as {
        id: number;
        name: string;
        reference: number;
        aliases?: string;
        category?: string;
    }[];

    assert(wb.Sheets.Perfiles);
    const profiles_wb = toJson(wb.Sheets.Perfiles) as {
        id: number;
        name: string;
        examIds: string;
        aliases?: string;
        specialPrice?: number;
    }[];

    const data_result: ExamProfile[] = [];
    for (const exam_wb of exams_wb) {
        const category = exam_wb.category?.slice(0, 1) as ExamCategory | undefined;
        const exam: Exam = {
            id: exam_wb.id.toString(),
            name: exam_wb.name,
            price: exam_wb.reference,
            aliases: exam_wb.aliases?.split(","),
            category: category,
        };
        data_result.push({ exam: exam });
    }
    for (const profile_wb of profiles_wb) {
        // Fix differences with workbook
        const indexes = (profile_wb.examIds || "").split(",");
        let total_price = 0;

        for (const id of indexes) {
            const exam_profile = data_result.find((e) => (e.exam as Exam).id === id);
            assert(exam_profile, `Exam 'id=${id}' does not exists`);
            total_price += (exam_profile.exam as Exam).price;
        }

        const profile: Profile = {
            id: profile_wb.id.toString(),
            name: profile_wb.name,
            exams_indexes: indexes.map(Number),
            aliases: profile_wb.aliases?.split(","),
            total_price: total_price,
            special_price: profile_wb.specialPrice,
        };
        data_result.push({ profile: profile as Profile });
    }

    return {
        data: data_result,
        last_updated: meta.last_updated,
    };
}

/// Integrates './data' into the build process
function labDataPlugin(): Rollup.Plugin {
    const module_name = "lab-data";
    const resolved_module_name = `\0${module_name}`;

    const real_data_path = path.resolve(__dirname, "./data/data.xlsx");
    const dummy_data_path = path.resolve(__dirname, "./data/dummyData.ts");

    // TODO: make possible to import the data into the program
    // see: https://rollupjs.org/plugin-development/#this-emitfile
    return {
        name: "lab-data-plugin",
        // Resolve module name
        async resolveId(source_id, _importer, _options) {
            if (source_id === module_name) {
                this.debug(`${module_name} intercepted`);
                if (process.env.USE_DUMMY_LABDATA) {
                    this.debug(`resolved dummy data`);
                    return dummy_data_path;
                } else {
                    this.debug(`resolved data.xlsx`);
                    return resolved_module_name;
                }
            }
            return null;
        },
        // Generate module from 'data/data.xlsx'
        async load(source_id) {
            if (source_id !== resolved_module_name) return;
            if (process.env.USE_DUMMY_LABDATA) return;
            this.info(`load data.xlsx`);

            const data = await fs.readFile(real_data_path);
            const wb = xlsx.read(data);
            const lab_data = labDataFromWorkBook(wb);

            const code = `export const last_updated = ${JSON.stringify(lab_data.last_updated)};
            export const data = ${JSON.stringify(lab_data.data)};`;
            this.debug(`code: ${code}`);
            return code;
        },
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, ".", "");
    console.info("environment: BASE_URL:", env.BASE_URL);
    return {
        base: env.BASE_URL,
        plugins: [
            labDataPlugin(),
            solidDevtoolsPlugin({
                autoname: true,
            }),
            solidPlugin(),
            tailwindcssPlugin(),
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
