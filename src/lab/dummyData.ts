import type { Exam, MenuItem, Profile } from ".";

// biome-ignore format: too distracting otherwise
const first_names: string[] = [
    "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Sophia", "James", "Isabella",
    "Benjamin", "Mia", "Lucas", "Charlotte", "Mason", "Amelia", "Ethan", "Harper", "Alexander",
    "Evelyn",
];

// biome-ignore format: too distracting otherwise
const last_names: string[] = [
    "Johnson", "Smith", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
    "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore",
    "Jackson", "Martin",
];

const randInt = (max: number) => Math.floor(Math.random() * max);

const coinChance = () => Math.random() > 0.5;

const choose = <T>(list: T[]) => list[randInt(list.length)];

const shuffle = <T>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
};

const randomName = () => `${choose(first_names)} ${choose(last_names)}`;

const randomCollection = <T>(gen: () => T, count: number) => {
    const collection = [];
    for (let i = 0; i < count; i += 1) {
        const item = gen();
        collection.push(item);
    }
    return collection;
};

let id_exam = 0;
const makeExam = (): Exam => {
    id_exam += 1;
    return {
        id: id_exam.toString(),
        name: randomName(),
        price: randInt(200),
        aliases: randomCollection(randomName, 2),
        category: undefined,
    };
};

const exams = randomCollection(makeExam, 30);

let id_profile = 0;
const makeProfile = (): Profile => {
    id_profile += 1;

    const ids = [];
    for (let i = 0; i < 10; i += 1) {
        if (coinChance()) {
            const exam_id = choose(exams).id;
            ids.push(exam_id);
        }
    }

    let special_price: number | undefined;
    if (coinChance()) {
        special_price = randInt(200);
    }

    return {
        id: id_profile.toString(),
        name: `PRO ${randomName()}`,
        examIds: ids,
        aliases: undefined,
        specialPrice: special_price,
    };
};

const profiles = randomCollection(makeProfile, 10);

const final: MenuItem[] = [];
for (const exam of exams) {
    final.push({ exam: exam });
}
for (const profile of profiles) {
    final.push({ profile: profile });
}

const final_list = final;

shuffle(final_list);

export default final_list;
