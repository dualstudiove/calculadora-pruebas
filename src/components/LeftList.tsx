import { Layers } from "lucide-solid";
import type { Accessor, Component, JSX } from "solid-js";
import { For, Show } from "solid-js";
import type { Exam, MenuItem, Profile } from "../lab";
import { itemAliases, itemName } from "../lab";

// TODO: Use these styles change Card hover
namespace _CardStyle {
    const _Normal = "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50";
    const _Selected = "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500";
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
    const price = () => {
        let price: number;
        if (is_profile) {
            const p = asProfile();
            price = p.specialPrice ?? p.totalPrice;
        } else {
            price = asExam().price;
        }
        return `${price.toFixed()} REF`;
    };

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
                    >
                        <span class="text-xs text-slate-400 line-through">
                            {asProfile().totalPrice.toFixed(2)}
                        </span>
                    </Show>
                    <span class="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm">
                        {price()}
                    </span>
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
        <span class="font-medium text-slate-600">También llamada:</span> {props.aliases}
    </div>
);

const IncludeProfileExams: Component<{ count: number }> = (props) => (
    <div class="text-xs text-slate-400 mt-1">Incluye {props.count} exámenes</div>
);

export default LeftList;
