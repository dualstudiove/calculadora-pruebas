import "solid-devtools";
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

// TODO: make this available through build in vite.config.ts
import labData from "./labDataDummy";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
    );
}

const last_updated = new Date().toISOString();

render(
    () => (
        <App
            last_updated={last_updated}
            lab_data={labData}
        />
    ),
    root,
);
