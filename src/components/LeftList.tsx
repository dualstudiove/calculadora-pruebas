import type { ExamProfile } from "../lab";
import lab from "../lab";

const FlexWrapper: Component = (element) => {
    return <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">{element}</div>;
};

const ExamProfileCard: Component = (props: {
    exam_profile: ExamProfile;
    isProfile;
    onClick;
    onMouseEnter;
}) => (
    <li
        // key={`${item.itemType}-${item.id}`}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
            null
            // focusedIndex === index
            //     ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500"
            //     : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
        }`}
        // onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        // onClick={() => addItem(item)}
        // onMouseEnter={() => setFocusedIndex(index)}
        // TODO: Fix below
    >
        <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
                {isProfile && <Layers className="w-4 h-4 text-purple-500 shrink-0" />}
                <span className="font-semibold text-slate-900">{item.name}</span>
                {!isProfile && (
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {(item as LabExam).category
                            ? `${(item as LabExam).category}-${item.id}`
                            : item.id}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                {isProfile && realTotal > (item as LabProfile).specialPrice && (
                    <span className="text-xs text-slate-400 line-through">
                        {realTotal.toFixed(2)}
                    </span>
                )}
                <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm">
                    {isProfile
                        ? (item as LabProfile).specialPrice.toFixed(2)
                        : (item as LabExam).price.toFixed(2)}{" "}
                    REF
                </span>
            </div>
        </div>
        {item.aliases && (
            <div className="text-sm text-slate-500">
                <span className="font-medium text-slate-600">También llamada:</span> {item.aliases}
            </div>
        )}
        {isProfile && (
            <div className="text-xs text-slate-400 mt-1">
                Incluye {(item as LabProfile).examIds.length} exámenes
            </div>
        )}
    </li>
);

const LeftList: Component = (props: { shownItems: ExamProfile; noItemsPlaceholder: Component }) => {
    const items = props.shownItems();
    if (items.length === 0) {
        return FlexWrapper(props.noItemsPlaceholder);
    }

    return FlexWrapper(
        <ul className="space-y-3">
            <For each={shownItems()}>{(item, getIndex) => <Card></Card>}</For>
        </ul>,
    );
};

export default LeftList;

// function leftListUI({}) {
//     return (
//         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
//             {searchQuery.trim() && searchResults.length === 0 ? (
//                 <div className="text-center py-10 text-slate-500">
//                     No se encontraron resultados para "{searchQuery}"
//                 </div>
//             ) : (
//                 <ul
//                     ref={resultsListRef}
//                     className="space-y-3"
//                 >
//                     {searchResults.map((item, index) => {
//                         const isProfile = item.itemType === "profile";
//                         const realTotal = isProfile
//                             ? getProfileRealTotal(item as LabProfile)
//                             : 0;
//
//                         return (
//                             <li
//                                 key={`${item.itemType}-${item.id}`}
//                                 className={`p-4 rounded-xl border transition-all cursor-pointer ${
//                                     focusedIndex === index
//                                         ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500"
//                                         : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
//                                 }`}
//                                 onClick={() => addItem(item)}
//                                 onMouseEnter={() => setFocusedIndex(index)}
//                             >
//                                 <div className="flex justify-between items-start mb-1">
//                                     <div className="flex items-center gap-2">
//                                         {isProfile && (
//                                             <Layers className="w-4 h-4 text-purple-500 shrink-0" />
//                                         )}
//                                         <span className="font-semibold text-slate-900">
//                                             {item.name}
//                                         </span>
//                                         {!isProfile && (
//                                             <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
//                                                 {(item as LabExam).category
//                                                     ? `${(item as LabExam).category}-${item.id}`
//                                                     : item.id}
//                                             </span>
//                                         )}
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         {isProfile &&
//                                             realTotal > (item as LabProfile).specialPrice && (
//                                                 <span className="text-xs text-slate-400 line-through">
//                                                     {realTotal.toFixed(2)}
//                                                 </span>
//                                             )}
//                                         <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm">
//                                             {isProfile
//                                                 ? (item as LabProfile).specialPrice.toFixed(2)
//                                                 : (item as LabExam).price.toFixed(2)}{" "}
//                                             REF
//                                         </span>
//                                     </div>
//                                 </div>
//                                 {item.aliases && (
//                                     <div className="text-sm text-slate-500">
//                                         <span className="font-medium text-slate-600">
//                                             También llamada:
//                                         </span>{" "}
//                                         {item.aliases}
//                                     </div>
//                                 )}
//                                 {isProfile && (
//                                     <div className="text-xs text-slate-400 mt-1">
//                                         Incluye {(item as LabProfile).examIds.length} exámenes
//                                     </div>
//                                 )}
//                             </li>
//                         );
//                     })}
//                 </ul>
//             )}
//         </div>
//     );
// }
