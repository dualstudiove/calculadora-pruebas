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

export interface Exam {
    id: string;
    name: string;
    price: number;
    aliases?: string[];
    category?: string;
}

export interface Profile {
    id: string;
    name: string;
    examIds: string[];
    aliases?: string[];
    specialPrice?: number;
}

export function profileCalculateTotal(profile: Profile, exams: Exam[]) {
    let total = 0;
    for (const exam of exams) {
        if (profile.id === exam.id) {
            total += exam.price;
        }
    }
    return total;
}

export type MenuItem = Partial<{ exam: Exam; profile: Profile }>;

export const itemName = (item: MenuItem) => {
    const obj: Exam | Profile = item.exam ?? item.profile ?? (undefined as never);
    return obj.name;
};

export const itemAliases = (item: MenuItem) => {
    const obj: Exam | Profile = item.exam ?? item.profile ?? (undefined as never);
    return obj.aliases;
};
