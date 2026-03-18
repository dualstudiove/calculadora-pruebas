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
