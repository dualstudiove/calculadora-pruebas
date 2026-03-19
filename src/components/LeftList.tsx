import type { DataIndex } from "@root/lab";
import { InspectExamProfile } from "@root/lab";

import { Layers } from "lucide-solid";
import type { Component, JSX } from "solid-js";
import { For, Show } from "solid-js";

import ExamCategory from "./ExamCategory";
import PriceTag from "./PriceTag";

// TODO: Use these styles change Card hover
namespace _CardStyle {
    const _Normal = "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50";
    const _Selected = "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500";
}

const LeftList: Component<{
    shownItems: DataIndex[];
    noItemsPlaceholder: JSX.Element;
    handleAddItem: (exam_profile: DataIndex) => void;
}> = (props) => (
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Show
            when={props.shownItems.length > 0}
            fallback={props.noItemsPlaceholder}
        >
            <ul class="space-y-3">
                <For each={props.shownItems}>
                    {(index, _getIndex) => (
                        <Card
                            exam_profile={index}
                            handleAddItem={props.handleAddItem}
                        />
                    )}
                </For>
            </ul>
        </Show>
    </div>
);

const Card: Component<{
    exam_profile: DataIndex;
    handleAddItem: (exam_profile: DataIndex) => void;
}> = (props) => {
    const ep = new InspectExamProfile(props.exam_profile);
    const aliases = ep.aliases() ?? [];
    const has_aliases = aliases.length > 0;

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: TODO: remove later, we need keyboard navigation
        <li
            class="p-4 rounded-xl border transition-all cursor-pointer"
            onClick={() => props.handleAddItem(props.exam_profile)}
        >
            <div class="flex justify-between items-start mb-1">
                <div class="flex items-center gap-2">
                    <Show when={ep.kind === "Profile"}>
                        <Layers class="w-4 h-4 text-purple-500 shrink-0" />
                    </Show>
                    <span class="font-semibold text-slate-900">{ep.name()}</span>
                    <Show when={ep.kind !== "Profile"}>
                        <ExamCategory exam={ep.asExam()} />
                    </Show>
                </div>
                <div class="flex items-center gap-2">
                    <PriceTag
                        exam_profile={props.exam_profile}
                        style={{
                            discount: "text-xs text-slate-400 line-through",
                            price: "font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm",
                        }}
                    />
                </div>
            </div>
            <Show when={has_aliases}>
                <AlsoKnownAs aliases={aliases} />
            </Show>
            <Show when={ep.kind === "Profile"}>
                <IncludeProfileExams count={ep.asProfile().exams_indexes.length} />
            </Show>
        </li>
    );
};

const AlsoKnownAs: Component<{ aliases: string[] }> = (props) => {
    const aliases = props.aliases.join(", ");
    return (
        <div class="text-sm text-slate-500">
            <span class="font-medium text-slate-600">También llamada:</span> {aliases}
        </div>
    );
};

const IncludeProfileExams: Component<{ count: number }> = (props) => (
    <div class="text-xs text-slate-400 mt-1">Incluye {props.count} exámenes</div>
);

export default LeftList;
