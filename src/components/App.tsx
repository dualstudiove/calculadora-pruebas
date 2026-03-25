import type { DataIndex } from "@root/lab";
import { data_last_updated, InspectExamProfile, data as lab_data } from "@root/lab";

// import Bcv from "./external-apis/Bcv";
// import ILovePdf from "./external-apis/ILovePdf";

import { extract as fuzzExtract, token_set_ratio as fuzzingAlgorithm } from "fuzzball";
import { FileDown, Search, Trash2 } from "lucide-solid";
import type { Component, ParentComponent } from "solid-js";
import { children, createEffect, createMemo, createSignal, Show, splitProps } from "solid-js";
import { createStore } from "solid-js/store";
import LeftList from "./LeftList";
import RightList from "./RightList";
import SearchBarInput from "./SearchBarInput";

function* range(min: number, max: number, step: number = 1) {
    for (let i = min; i < max; i += step) {
        yield i;
    }
}

const KeyShortcutSpan: ParentComponent<{ key: string }> = (props) => {
    const getChildren = children(() => props.children);
    return (
        <span class="flex items-center gap-1">
            <kbd class="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">
                {props.key}
            </kbd>
            &nbsp;
            {getChildren()}
        </span>
    );
};

const App: Component = (_props) => {
    // Search query
    const [searchQuery, setSearchQuery] = createSignal<string>("");
    // Items selected (right)
    const [selectedItems, setSelectedItems] = createStore<DataIndex[]>([]);

    const addSelectedItem = (exam_profile: DataIndex) =>
        setSelectedItems(selectedItems.length, exam_profile);
    const removeSelectedItem = (exam_profile: DataIndex) =>
        setSelectedItems(selectedItems.filter((index) => index !== exam_profile));

    // Items showed (left)
    const shownItems = (): DataIndex[] =>
        range(0, lab_data.length)
            // This filter is O(n) in worse case but makes the implementation simpler
            // We are dealing with at most 100 items anyway
            .filter((index) => !selectedItems.includes(index))
            .toArray();

    const shownItemsSearchResult = createMemo<DataIndex[]>(() => {
        // Dependencies
        const query = searchQuery();
        const items = shownItems();

        const distance_from_highest_score = 50;
        if (query.length === 0) {
            return items;
        }

        const fuzz_result = fuzzExtract(query, items, {
            scorer: (query: string, choice: DataIndex, opts) => {
                const exam_profile = new InspectExamProfile(choice);
                const score_name = fuzzingAlgorithm(query, exam_profile.name());
                const score_alias = exam_profile
                    .aliases()
                    ?.map((alias) => fuzzingAlgorithm(query, alias, opts))
                    .reduce((prev, newer) => Math.max(prev, newer));

                return Math.max(score_name, score_alias || 0);
            },
            sortBySimilarity: true,
        });
        console.debug("fuzz result:", fuzz_result);
        const highest_score = fuzz_result[0][1];
        const result = fuzz_result
            .filter(
                ([_choice, score, _index]) => highest_score - score < distance_from_highest_score,
            )
            .map(([choice, _score, _index]) => choice);
        return result;
    });

    const totalPrice = () =>
        selectedItems
            .map((exam_profile) => new InspectExamProfile(exam_profile).effectivePrice())
            .reduce((total_before, price) => total_before + price, 0);

    // TODO: tab indexes
    // const [focusedIndex, setFocusedIndex] = createSignal<number>(-1);

    const generatePDF = () => {};

    //-- Effects -----------------------------------------------------------------------------

    // Get current Bcv rate
    createEffect(() => {});

    //-- Components -----------------------------------------------------------------------------

    const MenuLeft: Component = () => (
        <div class="w-full md:w-1/2 lg:w-7/12 p-6 md:p-8 flex flex-col border-r border-slate-200 bg-white h-screen overflow-hidden">
            <div class="mb-6 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 mb-2">
                        Buscar Exámenes y Perfiles
                    </h1>
                    <p class="text-sm text-slate-500 flex items-center gap-4 flex-wrap">
                        <KeyShortcutSpan key="B">Buscar</KeyShortcutSpan>
                        <KeyShortcutSpan key="L">Limpiar todo</KeyShortcutSpan>
                        <KeyShortcutSpan key="↑↓">navegar</KeyShortcutSpan>
                        <KeyShortcutSpan key="Enter">agregar</KeyShortcutSpan>{" "}
                    </p>
                </div>
            </div>

            <SearchBarInput
                placeholder="Escriba el nombre del examen, perfil o alias..."
                value={searchQuery()}
                onInput={(e) => {
                    const query = e.target.value;
                    console.debug(`search: ${query}`);
                    setSearchQuery(query);
                }}
            />

            <LeftList
                shownItems={shownItemsSearchResult()}
                noItemsPlaceholder={
                    <div class="text-center py-10 text-slate-500">
                        No se encontraron resultados para "{searchQuery()}"
                    </div>
                }
                handleAddItem={(exam_profile) => {
                    addSelectedItem(exam_profile);
                    console.debug("added:", new InspectExamProfile(exam_profile).exam_profile);
                }}
            />
        </div>
    );

    const MenuRight: Component = () => (
        <div class="w-full md:w-1/2 lg:w-5/12 p-6 md:p-8 flex flex-col bg-slate-50 h-screen overflow-hidden">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-900">Presupuesto</h2>
                <Show when={selectedItems.length > 0}>
                    <button
                        type="button"
                        onClick={() => setSelectedItems([])}
                        class="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Limpiar todo (L)"
                    >
                        <Trash2 class="h-4 w-4" />
                        Limpiar
                    </button>
                </Show>
            </div>

            <RightList
                // TODO
                selectedItems={selectedItems}
                handleRemoveItem={(exam_profile) => {
                    removeSelectedItem(exam_profile);
                    console.debug("removed:", new InspectExamProfile(exam_profile).exam_profile);
                }}
                noItemsPlaceholder={
                    <div class="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <div class="bg-slate-100 p-4 rounded-full mb-4">
                            <Search class="h-8 w-8 text-slate-300" />
                        </div>
                        <p class="text-lg font-medium text-slate-600 mb-1">
                            Ningún examen seleccionado
                        </p>
                        <p class="text-sm">
                            Busque y seleccione exámenes o perfiles en el panel izquierdo para
                            agregarlos al presupuesto.
                        </p>
                    </div>
                }
            />

            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div class="flex justify-between items-end mb-4">
                    <div>
                        <p class="text-sm text-slate-500 mb-1">Total a pagar</p>
                        <p class="text-xs text-slate-400">
                            Precios actualizados el: {data_last_updated}
                        </p>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold text-blue-700">
                            {totalPrice().toFixed(2)}{" "}
                            <span class="text-xl text-blue-500 font-medium">REF</span>
                        </div>
                        {
                            //     {bcvRate && (
                            //         <div class="text-lg font-medium text-slate-600 mt-1">
                            //             {(total * bcvRate).toLocaleString("es-VE", {
                            //                 minimumFractionDigits: 2,
                            //                 maximumFractionDigits: 2,
                            //             })}{" "}
                            //             <span class="text-sm text-slate-500">Bs</span>
                            //         </div>
                            //     )}
                        }
                    </div>
                </div>

                <button
                    type="button"
                    onClick={generatePDF}
                    disabled={selectedItems.length === 0}
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                    <FileDown class="h-5 w-5" />
                    Descargar PDF
                </button>
            </div>
        </div>
    );

    return (
        <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
            <MenuLeft />
            <MenuRight />
        </div>
    );
};

export default App;
