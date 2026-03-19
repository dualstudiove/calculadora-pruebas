import type { DataIndex } from "@root/lab";
import { asProfile, getEffectivePrice, getExamProfile, getKind } from "@root/lab";

import type { Component } from "solid-js";
import { Show } from "solid-js";

const PriceTag: Component<{
    exam_profile: DataIndex;
    style: {
        discount: string;
        price: string;
    };
}> = (props) => {
    const examProfile = () => getExamProfile(props.exam_profile);
    const kind = () => getKind(examProfile());
    const profile = () => asProfile(examProfile());

    const hasDiscount = () =>
        kind() === "Profile" &&
        profile().special_price &&
        profile().total_price > (profile().special_price as number);
    const originalPrice = () => profile().total_price;
    const effectivePrice = () => getEffectivePrice(examProfile());

    return (
        <>
            <Show when={hasDiscount()}>
                <span class={props.style.discount}>{originalPrice().toFixed(2)}</span>
            </Show>
            <span class={props.style.price}>{effectivePrice().toFixed(2)}</span>
        </>
    );
};

export default PriceTag;
