import "solid-devtools";
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

// TODO: make this available through build in vite.config.ts
// import labData from "./labDataDummy";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
    );
}

const last_updated = new Date().toISOString();
let lab_items = [];
for (const exam of labData.exams) {
    lab_items.push({ exam: exam });
}
for (const profiles of labData.profiles) {
    lab_items.push({ profile: profiles });
}

render(
    () => (
        <App
            last_updated={last_updated}
            // exams={labData.exams}
            // profiles={labData.profiles}
        />
    ),
    root,
);
