import { Layers } from "lucide-solid";
import type { Accessor, Component, JSX } from "solid-js";
import { For, Show } from "solid-js";
import type { MenuItem, Exam, Profile } from "../lab";
import { itemAliases, itemName } from "../lab";

namespace Style {
    const Normal = "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50";
    const Selected = "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500";
}

const LeftList: Component<{
    shownItems: Accessor<MenuItem[]>;
    noItemsPlaceholder: JSX.Element;
    handleAddItem: (exam_profile: MenuItem) => void;
}> = (props) => (
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <ul class="space-y-3">
            <For
                each={props.shownItems()}
                fallback={props.noItemsPlaceholder}
            >
                {(exam_profile, _getIndex) => (
                    <Card
                        exam_profile={exam_profile}
                        handleAddItem={props.handleAddItem}
                    />
                )}
            </For>
        </ul>
    </div>
);

const Card: Component<{
    exam_profile: MenuItem;
    handleAddItem: (exam_profile: MenuItem) => void;
}> = (props) => {
    const examProfile = () => props.exam_profile;
    const asExam = () => examProfile().exam as Exam;
    const asProfile = () => examProfile().profile as Profile;
    const is_profile = Object.hasOwn(examProfile(), "profile");
    const name = () => itemName(examProfile());
    const aliases = () => itemAliases(examProfile()) ?? [];

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: TODO: remove later, we need keyboard navigation
        <li
            class="p-4 rounded-xl border transition-all cursor-pointer"
            onClick={() => props.handleAddItem(examProfile())}
        >
            <div class="flex justify-between items-start mb-1">
                <div class="flex items-center gap-2">
                    <Show when={is_profile}>
                        <Layers class="w-4 h-4 text-purple-500 shrink-0" />
                    </Show>
                    <span class="font-semibold text-slate-900">{name()}</span>
                    <Show when={!is_profile}>
                        <ExamCategory exam={asExam()} />
                    </Show>
                </div>
                <div class="flex items-center gap-2">
                    <Show
                        when={
                            is_profile &&
                            asProfile().totalPrice >
                            (asProfile().specialPrice ?? Number.MAX_SAFE_INTEGER)
                        }
                    ></Show>
                </div>
            </div>
            <Show when={aliases().length !== 0}>
                <AlsoKnownAs aliases={aliases()} />
            </Show>
            <Show when={is_profile}>
                <IncludeProfileExams count={asProfile().examIds.length} />
            </Show>
        </li>
    );
};

const ItemPrice: Component<{}> = (props) => {
    return (
        <div class="flex items-center gap-2">
            {isProfile && realTotal > (item as LabProfile).specialPrice && (
                <span class="text-xs text-slate-400 line-through">{realTotal.toFixed(2)}</span>
            )}
            <span class="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm">
                {isProfile
                    ? (item as LabProfile).specialPrice.toFixed(2)
                    : (item as LabExam).price.toFixed(2)}{" "}
                REF
            </span>
        </div>
    );
};

const ExamCategory: Component<{ exam: Exam }> = (props) => {
    const exam = props.exam;
    return (
        <span class="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            {exam.category ? `${exam.category} - ${exam.id}` : exam.id}
        </span>
    );
};

const AlsoKnownAs: Component<{ aliases: string[] }> = (props) => (
    <div class="text-sm text-slate-500">
        <span class="font-medium text-slate-600">también llamada:</span> {props.aliases}
    </div>
);

const IncludeProfileExams: Component<{ count: number }> = (props) => (
    <div class="text-xs text-slate-400 mt-1">Incluye {props.count} exámenes</div>
);

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
//                                 key={`${ item.itemType } -${ item.id } `}
//                                 className={`p - 4 rounded - xl border transition - all cursor - pointer ${
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
