import type { DataIndex } from "@root/lab";
import { InspectExamProfile } from "@root/lab";

import type { Component } from "solid-js";
import { Show } from "solid-js";

const PriceTag: Component<{
    exam_profile: DataIndex;
    style: {
        discount: string;
        price: string;
    };
}> = (props) => {
    const ep = new InspectExamProfile(props.exam_profile);
    const has_discount =
        ep.kind === "Profile" &&
        ep.profile().special_price &&
        ep.profile().total_price > (ep.profile().special_price as number);

    return (
        <>
            <Show when={has_discount}>
                <span class={props.style.discount}>{ep.profile().total_price.toFixed(2)}</span>
            </Show>
            <span class={props.style.price}>{ep.effectivePrice().toFixed(2)}</span>
        </>
    );
};

export default PriceTag;
