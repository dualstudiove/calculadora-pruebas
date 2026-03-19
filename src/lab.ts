import { data as internal_data } from "lab-data";

export { data, last_updated as data_last_updated } from "lab-data";

export type DataIndex = number;

export interface Exam {
    id: string;
    name: string;
    price: number;
    aliases?: string[];
    category?: ExamCategory;
}

export interface Profile {
    id: string;
    name: string;
    exams_indexes: DataIndex[];
    aliases?: string[];
    total_price: number;
    special_price?: number;
}

export type ExamCategory = keyof typeof exam_categories;
export const exam_categories = {
    S: "Serología",
    Q: "Química",
    B: "Bacteriología",
    A: "Pruebas de Alergia",
    H: "Hormonas",
    U: "Uroanálisis",
    C: "Coproanálisis",
    MT: "Marcadores Tumorales",
    O: "Otros",
};

export type ExamProfile = Partial<{ exam: Exam; profile: Profile }>;

export class InspectExamProfile {
    exam_profile: Exam | Profile;
    kind: "Exam" | "Profile";

    constructor(index: DataIndex) {
        const exam_profile = internal_data[index];
        if ("exam" in exam_profile) {
            this.kind = "Exam";
            this.exam_profile = exam_profile.exam as Exam;
        } else if ("profile" in exam_profile) {
            this.kind = "Profile";
            this.exam_profile = exam_profile.profile as Profile;
        } else {
            throw new Error("Expected Exam or Profile type");
        }
    }

    asExam() {
        return this.exam_profile as Exam;
    }
    asProfile() {
        return this.exam_profile as Profile;
    }

    id() {
        return this.exam_profile.id;
    }
    name() {
        return this.exam_profile.name;
    }
    aliases() {
        return this.exam_profile.aliases;
    }
    effectivePrice() {
        switch (this.kind) {
            case "Exam": {
                return (this.exam_profile as Exam).price;
            }
            case "Profile": {
                const p: Profile = this.exam_profile as Profile;
                return p.special_price ?? p.total_price;
            }
        }
    }
}

// export const getExamProfile = (index: DataIndex) => internal_data[index];
//
// const getUnionRuntime = (item: ExamProfile): Exam | Profile =>
//     item.exam ?? item.profile ?? (undefined as never);
//
// export const getKind = (item: ExamProfile): "Exam" | "Profile" => {
//     if (item.exam !== undefined) {
//         return "Exam";
//     } else if (item.profile !== undefined) {
//         return "Profile";
//     } else {
//         throw new Error("Expected Exam or Profile type");
//     }
// };
//
// export const asExam = (item: ExamProfile) => item.exam as Exam;
//
// export const asProfile = (item: ExamProfile) => item.profile as Profile;
//
// export const itemName = (item: ExamProfile) => getUnionRuntime(item).name;
//
// export const itemAliases = (item: ExamProfile) => getUnionRuntime(item).aliases;
//
// export const getEffectivePrice = (item: ExamProfile) => {
//     if (getKind(item) === "Exam") {
//         return asExam(item).price;
//     } else {
//         const p = asProfile(item);
//         return p.special_price ?? p.total_price;
//     }
// };
