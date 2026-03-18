import { FileDown, Search } from "lucide-solid";
import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import LeftList from "./components/LeftList";
// import Bcv from "./external-apis/Bcv";
// import ILovePdf from "./external-apis/ILovePdf";
import type { MenuItem } from "./lab";

const App: Component<{ last_updated: string; lab_data: MenuItem[] }> = (props) => {
    const last_updated = () => props.last_updated;
    const labData = () => props.lab_data;

    const [searchQuery, setSearchQuery] = createSignal<string>("");
    const [shownItems, setShownItems] = createStore<MenuItem[]>({ items: [] });
    const [selectedItems, setSelectedItems] = createStore<MenuItem[]>({ items: [] });
    // TODO: tab indexes
    // const [focusedIndex, setFocusedIndex] = createSignal<number>(-1);

    const addSelectedItem = (item: MenuItem) => {
        setSelectedItems("items", (currentItems) => [...currentItems, item]);
        setSearchQuery("");
    };
    const removeSelectedItem = (item: LabItem) => {
        setSelectedItems("items", (currentItems) => currentItems.filter(item));
    };

    // Update available items when searchQuery changes using fuzzing algorithm
    createEffect(() => {
        const query = searchQuery();
        console.log(`search: ${query}`);
        // TODO: add fuzzing algorithm. see: https://www.npmjs.com/package/fuzzball
    });

    const generatePDF = () => { };

    // function rightListUI({}) {
    //     return (
    //         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6 bg-white rounded-xl border border-slate-200 shadow-sm">
    //             {selectedItems.length === 0 ? (
    //                 <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
    //                     <div className="bg-slate-100 p-4 rounded-full mb-4">
    //                         <Search className="h-8 w-8 text-slate-300" />
    //                     </div>
    //                     <p className="text-lg font-medium text-slate-600 mb-1">
    //                         Ningún examen seleccionado
    //                     </p>
    //                     <p className="text-sm">
    //                         Busque y seleccione exámenes o perfiles en el panel izquierdo para
    //                         agregarlos al presupuesto.
    //                     </p>
    //                 </div>
    //             ) : (
    //                 <ul className="divide-y divide-slate-100">
    //                     {selectedItems.map((item) => {
    //                         const isProfile = item.itemType === "profile";
    //                         const isExpanded = expandedProfiles.has(item.id);
    //                         const profile = item as LabProfile;
    //
    //                         let includedNames = "";
    //                         if (isProfile) {
    //                             includedNames = profile.examIds
    //                                 .map((id) => labExams.find((e) => e.id === id)?.name)
    //                                 .filter(Boolean)
    //                                 .join(", ");
    //                         }
    //
    //                         return (
    //                             <li
    //                                 key={`${item.itemType}-${item.id}`}
    //                                 className="p-4 hover:bg-slate-50 transition-colors group"
    //                             >
    //                                 <div className="flex justify-between items-start">
    //                                     <div className="flex-1 pr-4">
    //                                         <div className="flex items-center gap-2">
    //                                             {isProfile && (
    //                                                 <Layers className="w-4 h-4 text-purple-500 shrink-0" />
    //                                             )}
    //                                             <div className="font-medium text-slate-900">
    //                                                 {item.name}
    //                                             </div>
    //                                             {!isProfile && (
    //                                                 <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
    //                                                     {(item as LabExam).category
    //                                                         ? `${(item as LabExam).category}-${item.id}`
    //                                                         : item.id}
    //                                                 </span>
    //                                             )}
    //                                         </div>
    //                                         {item.aliases && (
    //                                             <div
    //                                                 className="text-xs text-slate-500 truncate"
    //                                                 title={item.aliases}
    //                                             >
    //                                                 {item.aliases}
    //                                             </div>
    //                                         )}
    //
    //                                         {isProfile && (
    //                                             <div className="mt-1">
    //                                                 {isExpanded ? (
    //                                                     <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded mt-2">
    //                                                         <span className="font-medium block mb-1">
    //                                                             Incluye:
    //                                                         </span>
    //                                                         <ul className="list-disc pl-4 space-y-0.5">
    //                                                             {profile.examIds.map((id) => {
    //                                                                 const exam = labExams.find(
    //                                                                     (e) => e.id === id,
    //                                                                 );
    //                                                                 return exam ? (
    //                                                                     <li key={id}>
    //                                                                         {exam.name}
    //                                                                     </li>
    //                                                                 ) : null;
    //                                                             })}
    //                                                         </ul>
    //                                                         <button
    //                                                             onClick={() =>
    //                                                                 toggleExpand(item.id)
    //                                                             }
    //                                                             className="text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center gap-1"
    //                                                         >
    //                                                             Ocultar{" "}
    //                                                             <ChevronUp className="w-3 h-3" />
    //                                                         </button>
    //                                                     </div>
    //                                                 ) : (
    //                                                     <div className="text-xs text-slate-500">
    //                                                         <span className="truncate block max-w-[250px]">
    //                                                             Incluye: {includedNames}
    //                                                         </span>
    //                                                         <button
    //                                                             onClick={() =>
    //                                                                 toggleExpand(item.id)
    //                                                             }
    //                                                             className="text-blue-600 hover:text-blue-800 font-medium mt-0.5 flex items-center gap-1"
    //                                                         >
    //                                                             Ver más{" "}
    //                                                             <ChevronDown className="w-3 h-3" />
    //                                                         </button>
    //                                                     </div>
    //                                                 )}
    //                                             </div>
    //                                         )}
    //                                     </div>
    //
    //                                     <div className="flex items-center gap-4 pt-1">
    //                                         <div className="flex flex-col items-end">
    //                                             {isProfile &&
    //                                                 getProfileRealTotal(profile) >
    //                                                     profile.specialPrice && (
    //                                                     <span className="text-[10px] text-slate-400 line-through leading-none mb-0.5">
    //                                                         {getProfileRealTotal(profile).toFixed(
    //                                                             2,
    //                                                         )}
    //                                                     </span>
    //                                                 )}
    //                                             <span className="font-semibold text-slate-700 leading-none">
    //                                                 {isProfile
    //                                                     ? profile.specialPrice.toFixed(2)
    //                                                     : (item as LabExam).price.toFixed(2)}{" "}
    //                                                 REF
    //                                             </span>
    //                                         </div>
    //                                         <button
    //                                             onClick={() => removeItem(item.id, item.itemType)}
    //                                             className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
    //                                             aria-label="Eliminar"
    //                                         >
    //                                             <X className="h-4 w-4" />
    //                                         </button>
    //                                     </div>
    //                                 </div>
    //                             </li>
    //                         );
    //                     })}
    //                 </ul>
    //             )}
    //         </div>
    //     );
    // }

    const KbdSpan: Component = (props: { key: string; tag: string }) => {
        return (
            <span className="flex items-center gap-1">
                <kbd className="bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono">
                    {props.key}
                </kbd>
                {" " + props.tag}
            </span>
        );
    };

    const SearchBarDiv: Component = (props: { placeholder: string }) => {
        // TODO: Add ref for key 's'
        // TODO: Go down on key down ( onKeyDown={handleSearchKeyDown} )
        return (
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
                    placeholder={props.placeholder}
                    value={searchQuery()}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
            {/* Left Panel: Search */}
            <div className="w-full md:w-1/2 lg:w-7/12 p-6 md:p-8 flex flex-col border-r border-slate-200 bg-white h-screen overflow-hidden">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Buscar Exámenes y Perfiles
                        </h1>
                        <p className="text-sm text-slate-500 flex items-center gap-4 flex-wrap">
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
                    shownItems={labData}
                    noItemsPlaceholder={
                        <div className="text-center py-10 text-slate-500">
                            No se encontraron resultados para "{searchQuery()}"
                        </div>
                    }
                />
            </div>

            {/* Right Panel: Selected Items */}
            <div className="w-full md:w-1/2 lg:w-5/12 p-6 md:p-8 flex flex-col bg-slate-50 h-screen overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Presupuesto</h2>
                    {selectedItems.length > 0 && (
                        <button
                            onClick={() => setSelectedItems([])}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Limpiar todo (L)"
                        >
                            <Trash2 className="h-4 w-4" />
                            Limpiar
                        </button>
                    )}
                </div>

                {
                    // rightListUI({})
                }

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Total a pagar</p>
                            <p className="text-xs text-slate-400">
                                Precios actualizados el: {last_updated}
                            </p>
                        </div>
                        <div className="text-right">
                            {
                                // <div className="text-3xl font-bold text-blue-700">
                                //     {total().toFixed(2)}{" "}
                                //     <span className="text-xl text-blue-500 font-medium">REF</span>
                                // </div>
                                //     {bcvRate && (
                                //         <div className="text-lg font-medium text-slate-600 mt-1">
                                //             {(total * bcvRate).toLocaleString("es-VE", {
                                //                 minimumFractionDigits: 2,
                                //                 maximumFractionDigits: 2,
                                //             })}{" "}
                                //             <span className="text-sm text-slate-500">Bs</span>
                                //         </div>
                                //     )}
                            }
                        </div>
                    </div>

                    <button
                        onClick={generatePDF}
                        disabled={selectedItems.length === 0}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <FileDown className="h-5 w-5" />
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
