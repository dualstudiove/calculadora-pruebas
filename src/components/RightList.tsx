import type { DataIndex, Profile } from "@root/lab";
import { InspectExamProfile } from "@root/lab";

import { ChevronDown, ChevronUp, Layers, X } from "lucide-solid";
import type { Component, JSX } from "solid-js";
import { createSignal, For, Show } from "solid-js";

import ExamCategory from "./ExamCategory";
import PriceTag from "./PriceTag";

const RightList: Component<{
    selectedItems: DataIndex[];
    noItemsPlaceholder: JSX.Element;
    handleRemoveItem: (exam_profile: DataIndex) => void;
}> = (props) => (
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Show
            when={props.selectedItems.length > 0}
            fallback={props.noItemsPlaceholder}
        >
            <ul class="divide-y divide-slate-100">
                <For each={props.selectedItems}>
                    {(index, _getIndex) => (
                        <Card
                            exam_profile={index}
                            handleRemoveItem={props.handleRemoveItem}
                        />
                    )}
                </For>
            </ul>
        </Show>
    </div>
);

const Card: Component<{
    exam_profile: DataIndex;
    handleRemoveItem: (exam_profile: DataIndex) => void;
}> = (props) => {
    const ep = new InspectExamProfile(props.exam_profile);
    const has_aliases = (ep.aliases() ?? []).length > 0;
    const aliases_joined = ep.aliases()?.join(", ");

    return (
        <li class="p-4 hover:bg-slate-50 transition-colors group">
            <div class="flex justify-between items-start">
                <div class="flex-1 pr-4">
                    <div class="flex items-center gap-2">
                        <Show when={ep.kind === "Profile"}>
                            <Layers class="w-4 h-4 text-purple-500 shrink-0" />
                        </Show>
                        <div class="font-medium text-slate-900">{ep.name()}</div>
                        <Show when={ep.kind === "Exam"}>
                            <ExamCategory exam={ep.asExam()} />
                        </Show>
                    </div>
                    <Show when={has_aliases}>
                        <div
                            class="text-xs text-slate-500 truncate"
                            title={aliases_joined}
                        >
                            {aliases_joined}
                        </div>
                    </Show>
                    <Show when={ep.kind === "Profile"}>
                        <ExpandableProfileInfo profile={ep.asProfile()} />
                    </Show>
                </div>
                <div class="flex items-center gap-4 pt-1">
                    <div class="flex flex-col items-end">
                        <PriceTag
                            exam_profile={props.exam_profile}
                            style={{
                                discount:
                                    "text-[10px] text-slate-400 line-through leading-none mb-0.5",
                                price: "font-semibold text-slate-700 leading-none",
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => props.handleRemoveItem(props.exam_profile)}
                        class="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Eliminar"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </li>
    );
};

const ExpandableProfileInfo: Component<{ profile: Profile }> = (props) => {
    const [expanded, setExpanded] = createSignal<boolean>(false);
    const exam_names = props.profile.exams_indexes.map((data_index) => {
        const exam = new InspectExamProfile(data_index).asExam();
        return exam.name;
    });

    //-- Components -----------------------------------------------------------------------------

    const ExpandedInfo = () => (
        <div class="text-xs text-slate-600 bg-slate-100 p-2 rounded mt-2">
            <span class="font-medium block mb-1">Incluye:</span>
            <ul class="list-disc pl-4 space-y-0.5">
                <For each={exam_names}>{(name: string) => <li>{name}</li>}</For>
            </ul>
            <button
                type="button"
                onClick={[setExpanded, false]}
                class="text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center gap-1"
            >
                Ocultar <ChevronUp class="w-3 h-3" />
            </button>
        </div>
    );

    const HiddenInfo = () => {
        const exam_names_joined = exam_names.join(", ");
        return (
            <div class="text-xs text-slate-500">
                <span
                    class="truncate block max-w-[250px]"
                    title={exam_names_joined}
                >
                    Incluye: {exam_names_joined}
                </span>
                <button
                    type="button"
                    onClick={[setExpanded, true]}
                    class="text-blue-600 hover:text-blue-800 font-medium mt-0.5 flex items-center gap-1"
                >
                    Ver más <ChevronDown class="w-3 h-3" />
                </button>
            </div>
        );
    };

    return (
        <div class="mt-1">
            <Show
                when={expanded()}
                fallback={HiddenInfo()}
            >
                <ExpandedInfo />
            </Show>
        </div>
    );
};

export default RightList;
