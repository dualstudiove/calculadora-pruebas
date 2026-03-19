import type { Exam } from "@root/lab";

import type { Component } from "solid-js";

const ExamCategory: Component<{ exam: Exam }> = (props) => {
    const exam = props.exam;
    return (
        <span class="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            {exam.category ? `${exam.category} - ${exam.id}` : exam.id}
        </span>
    );
};

export default ExamCategory;
