import { data as internal_data } from "lab-data";

export { data } from "lab-data";

export type DataIndex = number;

export type ExamProfile = Partial<{ exam: Exam; profile: Profile }>;

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

export const getExamProfile = (index: DataIndex) => internal_data[index];

const getUnionRuntime = (item: ExamProfile): Exam | Profile =>
    item.exam ?? item.profile ?? (undefined as never);

export const itemName = (item: ExamProfile) => getUnionRuntime(item).name;

export const itemAliases = (item: ExamProfile) => getUnionRuntime(item).aliases;

export const getKind = (item: ExamProfile): "Exam" | "Profile" => {
    if (item.exam !== undefined) {
        return "Exam";
    } else if (item.profile !== undefined) {
        return "Profile";
    } else {
        throw new Error("Expected Exam or Profile type");
    }
};

export const asExam = (item: ExamProfile) => item.exam as Exam;

export const asProfile = (item: ExamProfile) => item.profile as Profile;
