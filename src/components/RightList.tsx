import type { DataIndex, Profile } from "@root/lab";
import { asExam, asProfile, getExamProfile, getKind, itemAliases, itemName } from "@root/lab";

import { ChevronDown, ChevronUp, Layers, X } from "lucide-solid";
import type { Accessor, Component, JSX } from "solid-js";
import { createSignal, For, Show } from "solid-js";

import ExamCategory from "./ExamCategory";

const RightList: Component<{
    selectedItems: Accessor<DataIndex[]>;
    noItemsPlaceholder: JSX.Element;
    handleRemoveItem: (exam_profile: DataIndex) => void;
}> = (props) => (
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Show
            when={props.selectedItems().length > 0}
            fallback={props.noItemsPlaceholder}
        >
            <ul class="divide-y divide-slate-100">
                <For each={props.selectedItems()}>
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
    const examProfile = () => getExamProfile(props.exam_profile);
    const kind = () => getKind(examProfile());
    const exam = () => asExam(examProfile());
    const profile = () => asProfile(examProfile());

    const name = () => itemName(examProfile());
    const aliases = () => itemAliases(examProfile()) ?? [];
    const aliasesJoined = () => aliases().join(", ");
    const price = () => {
        let price: number;
        if (kind() === "Profile") {
            const p = profile();
            price = p.special_price ?? p.total_price;
        } else {
            price = exam().price;
        }
        return `${price.toFixed(2)} REF`;
    };

    return (
        <li class="p-4 hover:bg-slate-50 transition-colors group">
            <div class="flex justify-between items-start">
                <div class="flex-1 pr-4">
                    <div class="flex items-center gap-2">
                        <Show when={kind() === "Profile"}>
                            <Layers class="w-4 h-4 text-purple-500 shrink-0" />
                        </Show>
                        <div class="font-medium text-slate-900">{name()}</div>
                        <Show when={kind() === "Exam"}>
                            <ExamCategory exam={exam()} />
                        </Show>
                    </div>
                    <Show when={aliases().length > 0}>
                        <div
                            class="text-xs text-slate-500 truncate"
                            title={aliasesJoined()}
                        >
                            {aliasesJoined()}
                        </div>
                    </Show>
                    <Show when={kind() === "Profile"}>
                        <ExpandableProfileInfo profile={profile()} />
                    </Show>
                </div>
                <div class="flex items-center gap-4 pt-1">
                    <div class="flex flex-col items-end">
                        <Show
                            when={
                                kind() === "Profile" &&
                                profile().total_price >
                                    (profile().special_price ?? Number.MAX_SAFE_INTEGER)
                            }
                        >
                            <span class="text-[10px] text-slate-400 line-through leading-none mb-0.5">
                                {profile().total_price.toFixed(2)}
                            </span>
                        </Show>
                        <span class="font-semibold text-slate-700 leading-none">{price()}</span>
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
    const examNames = () =>
        props.profile.exams_indexes
            .map((data_index) => {
                const exam = asExam(getExamProfile(data_index));
                return exam.name;
            })
            .join(", ");

    //-- Components -----------------------------------------------------------------------------

    const ExpandedInfo = () => (
        <div class="text-xs text-slate-600 bg-slate-100 p-2 rounded mt-2">
            <span class="font-medium block mb-1">Incluye:</span>
            <ul class="list-disc pl-4 space-y-0.5">
                <For each={props.profile.exams_indexes}>
                    {(index: DataIndex) => <li>{asExam(getExamProfile(index)).name}</li>}
                </For>
            </ul>
            <button
                type="button"
                onClick={() => setExpanded(false)}
                class="text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center gap-1"
            >
                Ocultar <ChevronUp class="w-3 h-3" />
            </button>
        </div>
    );

    const HiddenInfo = () => (
        <div class="text-xs text-slate-500">
            <span class="truncate block max-w-[250px]">Incluye: {examNames()}</span>
            <button
                type="button"
                onClick={() => setExpanded(true)}
                class="text-blue-600 hover:text-blue-800 font-medium mt-0.5 flex items-center gap-1"
            >
                Ver más <ChevronDown class="w-3 h-3" />
            </button>
        </div>
    );

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
