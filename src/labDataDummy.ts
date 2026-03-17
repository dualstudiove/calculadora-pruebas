// biome-ignore format: jkldsf
const first_names: string[] = [
    "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Sophia", "James", "Isabella",
    "Benjamin", "Mia", "Lucas", "Charlotte", "Mason", "Amelia", "Ethan", "Harper", "Alexander",
    "Evelyn",
];

// biome-ignore format: jdklf
const last_names: string[] = [
    "Johnson", "Smith", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
    "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore",
    "Jackson", "Martin",
];

const randInt = (max) => Math.floor(Math.random() * max);

const coinChance = () => Math.random() > 0.5;

const choose = (list) => list[randInt(list.length)];

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
};

const randomName = () => `${choose(first_names)} ${choose(last_names)}`;

const randomCollection = (gen, count) => {
    let collection = [];
    for (let i = 0; i < count; i += 1) {
        const item = gen();
        collection.push(item);
    }
    return collection;
};

let id_exam = 0;
const makeExam = () => {
    id_exam += 1;
    return {
        id: id_exam,
        name: randomName(),
        price: randInt(200),
        aliases: randomCollection(randomName, 2),
        category: null,
    };
};

const exams = randomCollection(makeExam, 30);

let id_profile = 0;
const makeProfile = () => {
    id_profile += 1;

    let ids = [];
    for (let i = 0; i < 10; i += 1) {
        if (coinChance()) {
            const exam_id = choose(exams).id;
            ids.push(exam_id);
        }
    }

    let special_price = null;
    if (coinChance()) {
        special_price = randInt(200);
    }

    return {
        id: id_profile,
        name: `PRO ${randomName()}`,
        examIds: ids,
        aliases: null,
        specialPrice: special_price,
    };
};

const profiles = randomCollection(makeProfile, 10);

let final = [];
for (const exam of exams) {
    final.push({ exam: exam });
}
for (const profile of profiles) {
    final.push({ profile: profile });
}

const final_list = final;

shuffle(final_list);

export default final_list;
