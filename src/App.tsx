import { FileDown, Search, Trash2 } from "lucide-solid";
import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";

import LeftList from "./components/LeftList";
// import Bcv from "./external-apis/Bcv";
// import ILovePdf from "./external-apis/ILovePdf";
import type { MenuItem } from "./lab";

const App: Component<{ last_updated: string; lab_data: MenuItem[] }> = (props) => {
    const last_updated = () => props.last_updated;
    const labData = () => props.lab_data;

    //-- Signals & reactives --------------------------------------------------------------------

    // Search query
    const [searchQuery, setSearchQuery] = createSignal<string>("");
    // Items showed (left)
    const [shownItems, setShownItems] = createSignal<MenuItem[]>([]);
    // Items selected (right)
    const [selectedItems, setSelectedItems] = createSignal<MenuItem[]>([]);

    // TODO: tab indexes
    // const [focusedIndex, setFocusedIndex] = createSignal<number>(-1);

    const addSelectedItem = (item: MenuItem) => {
        setSelectedItems("items", (currentItems) => [...currentItems, item]);
        setSearchQuery("");
    };

    const removeSelectedItem = (item: LabItem) => {
        setSelectedItems("items", (currentItems) => currentItems.filter(item));
    };

    const generatePDF = () => {};

    //-- Effects --------------------------------------------------------------------------------

    // Update shown items when searchQuery changes using fuzzing algorithm
    createEffect(() => {
        const query = searchQuery();
        console.log(`search: ${query}`);
        // TODO: add fuzzing algorithm. see: https://www.npmjs.com/package/fuzzball
    });

    //-- Components -----------------------------------------------------------------------------

    const KbdSpan: Component<{ key: string; tag: string }> = (props) => {
        return (
            <span class="flex items-center gap-1">
                <kbd class="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">
                    {props.key}
                </kbd>
                {` ${props.tag}`}
            </span>
        );
    };

    const SearchBarDiv: Component<{ placeholder: string }> = (props) => {
        // TODO: Add ref for key 's'
        // TODO: Go down on key down ( onKeyDown={handleSearchKeyDown} )
        return (
            <div class="relative mb-6">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search class="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
                    placeholder={props.placeholder}
                    value={searchQuery()}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        );
    };

    return (
        <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
            {/* Left Panel: Search */}
            <div class="w-full md:w-1/2 lg:w-7/12 p-6 md:p-8 flex flex-col border-r border-slate-200 bg-white h-screen overflow-hidden">
                <div class="mb-6 flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900 mb-2">
                            Buscar Exámenes y Perfiles
                        </h1>
                        <p class="text-sm text-slate-500 flex items-center gap-4 flex-wrap">
                            <KbdSpan
                                key="B"
                                tag="Buscar"
                            />
                            <KbdSpan
                                key="B"
                                tag="Buscar"
                            />
                            <KbdSpan
                                key="L"
                                tag="Limpiar todo"
                            />
                            <KbdSpan
                                key="↑↓"
                                tag="Navegar"
                            />
                            <KbdSpan
                                key="Enter"
                                tag="Agregar"
                            />
                        </p>
                    </div>
                </div>
                <SearchBarDiv placeholder="Escriba el nombre del examen, perfil o alias..." />

                <LeftList
                    shownItems={shownItems}
                    noItemsPlaceholder={
                        <div class="text-center py-10 text-slate-500">
                            No se encontraron resultados para "{searchQuery()}"
                        </div>
                    }
                    handleAddItem={(_exam_profile) => {}}
                />
            </div>

            {/* Right Panel: Selected Items */}
            <div class="w-full md:w-1/2 lg:w-5/12 p-6 md:p-8 flex flex-col bg-slate-50 h-screen overflow-hidden">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-slate-900">Presupuesto</h2>
                    {selectedItems.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShownItems([])}
                            class="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Limpiar todo (L)"
                        >
                            <Trash2 class="h-4 w-4" />
                            Limpiar
                        </button>
                    )}
                </div>

                {
                    // rightListUI({})
                }

                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <p class="text-sm text-slate-500 mb-1">Total a pagar</p>
                            <p class="text-xs text-slate-400">
                                Precios actualizados el: {last_updated}
                            </p>
                        </div>
                        <div class="text-right">
                            {
                                // <div class="text-3xl font-bold text-blue-700">
                                //     {total().toFixed(2)}{" "}
                                //     <span class="text-xl text-blue-500 font-medium">REF</span>
                                // </div>
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
                        onClick={generatePDF}
                        disabled={selectedItems.length === 0}
                        class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <FileDown class="h-5 w-5" />
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
