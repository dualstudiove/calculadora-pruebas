const { useState, useEffect } = React;

const dataURL = "src/data.json";

const maxFuzzyDistance = 4;

function fuzzyMatchCheckDistance(startIndex, query, term) {
  let first = true;
  let fromIndex = startIndex;
  let previousIndex = startIndex;

  for (const c of query) {
    if (first) {
      first = false;
      continue;
    }
    fromIndex = term.indexOf(c, previousIndex);
    const distance = fromIndex - previousIndex;
    if (fromIndex === -1 || distance > maxFuzzyDistance) {
      return false;
    }
    previousIndex = fromIndex + 1;
  }

  return true;
}

function fuzzyMatchString(query, term) {
  let fromIndex = 0;

  while (true) {
    fromIndex = term.indexOf(query[0], fromIndex);
    if (fromIndex === -1) {
      return false;
    }
    if (fuzzyMatchCheckDistance(fromIndex, query, term)) {
      return true;
    }
    fromIndex += 1;
  }

  throw new Error("Reached unreachable");
}

function fuzzyMatchTest(query, test) {
  if (query === '') {
    return true;
  }

  const queryl = query.toLowerCase();

  if (fuzzyMatchString(queryl, test.name.toLowerCase())) {
    return true;
  }

  return test.aliases.some(
    (alias) => fuzzyMatchString(queryl, alias.toLowerCase())
  );
}

function App() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(dataURL);
      if (!response.ok) {
        throw new Error(`Unable to fetch. Reason: ${response.status}`);
      }
      const data = await response.json();
      const orderedData = data.sort((a, b) => a.name > b.name);
      setTests(orderedData);
    };
    fetchData();
  }, []);

  const filtered = tests.filter(
    (t) =>
      fuzzyMatchTest(search, t) &&
      !selected.find((s) => s.name === t.name)
  );

  const addTest = (test) => setSelected([...selected, test]);
  const removeTest = (test) =>
    setSelected(selected.filter((s) => s.name !== test.name));

  const total = selected.reduce((acc, t) => acc + t.price, 0);

  const testDisplay = (test) => React.createElement(
    "span",
    { className: "flex-grow flex pe-3 justify-between items-center" },
    React.createElement(
      "div",
      { className: "flex flex-col" },
      React.createElement("span", null, `${test.name}`),
      test.aliases.length > 0 ? React.createElement(
        "span",
        { className: "ps-2 text-gray-500" },
        `Aliases: ${test.aliases.join(", ")}`) : null,
    ),
    React.createElement("span", { className: "font-bold" }, `REF ${test.price}`),
  );

  return (
    React.createElement(
      "div",
      { className: "min-h-screen bg-gray-100 p-4 grid grid-cols-1 md:grid-cols-2 gap-3" },

      // IZQUIERDA
      React.createElement(
        "div",
        { className: "bg-white shadow rounded-2xl p-4 flex flex-col con-scroll" },
        React.createElement("h2", { className: "text-xl font-bold mb-3" }, "Lista de pruebas"),
        React.createElement("input", {
          type: "text",
          id: "search-box",
          className: "w-full border p-2 rounded-xl mb-4",
          placeholder: "Buscar prueba [s]",
          value: search,
          onChange: (e) => setSearch(e.target.value),
        }),
        React.createElement(
          "div",
          { className: "space-y-2 h-full p-2 overflow-y-auto" },
          filtered.map((test) =>
            React.createElement(
              "div",
              {
                key: test.name,
                tabIndex: 0,
                className: "focusable-left flex justify-between items-center border p-2 rounded-xl focus:outline focus:outline-2 focus:outline-indigo-500",
                onKeyDown: (ev) => {
                  switch(ev.key) {
                    case "Enter":
                      addTest(test);
                      const next_target = ev.currentTarget.nextSibling;
                      if (next_target !== null) {
                        next_target.focus();
                      }
                      ev.preventDefault();
                      break;
                  }
                },
              },
              testDisplay(test),
              React.createElement(
                "button",
                {
                  className: "bg-blue-500 text-white px-3 py-1 rounded-xl",
                  tabIndex: -1,
                  onClick: () => addTest(test),
                },
                "Agregar"
              )
            )
          )
        )
      ),

      // DERECHA
      React.createElement(
        "div",
        { className: "bg-white shadow rounded-2xl p-4 flex flex-col justify-between con-scroll" },

        React.createElement(
          "div",
          { className: "space-y-2 overflow-y-auto p-2 mb-4" },
          React.createElement("h2", { className: "text-xl font-bold mb-3" }, "Calculadora"),
          selected.map((test) =>
            React.createElement(
              "div",
              {
                key: test.name,
                tabIndex: 0,
                className: "focusable-right flex justify-between items-center border p-2 rounded-xl focus:outline focus:outline-2 focus:outline-red-500",
                onKeyDown: (ev) => {
                  switch(ev.key) {
                    case "Enter":
                      removeTest(test);
                      const next_target = ev.currentTarget.nextSibling;
                      if (next_target !== null) {
                        next_target.focus();
                      }
                      ev.preventDefault();
                      break;
                  }
                },
              },
              testDisplay(test),
              React.createElement(
                "button",
                {
                  className: "bg-red-500 text-white px-3 py-1 rounded-xl",
                  tabIndex: -1,
                  onClick: () => removeTest(test),
                },
                "Quitar"
              )
            )
          )
        ),

        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "flex flex-row space-x-2" },
            React.createElement(
              "div",
              { className: "p-3 bg-gray-200 rounded-xl text-lg font-bold flex-1 flex justify-between items-center" },
              React.createElement("span", null, `Total: REF ${total}`),
              React.createElement("span", { className: "text-base text-gray-500" }, `${selected.length} items`),
            ),
            React.createElement(
              "button",
              {
                className: "bg-blue-500 text-white px-3 py-1 rounded-xl w-24",
                type: "button",
                onClick: (e) => setSelected([]),
              },
              "Limpiar"
            ),
          ),
          React.createElement(
            "p",
            { className: "text-xs text-gray-500 mt-1" },
            "Precios actualizados el viernes, 24/10/25"
          ),
        ),
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));

function isFocusable() {
  const clss = document.activeElement.classList;
  return clss.contains("focusable-left") || clss.contains("focusable-right");
}

function niceFocus(element) {
  element.focus({preventScroll: true});
  element.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("keydown", (ev) => {
  switch (ev.key) {
    case "s":
      const search_box = document.querySelector("#search-box");
      if (document.activeElement !== search_box) {
        search_box.focus();
        ev.preventDefault();
        return;
      }
      break;
    case "ArrowLeft":
      document.querySelector(".focusable-left").focus();
      ev.preventDefault();
      break;
    case "ArrowRight":
      document.querySelector(".focusable-right").focus();
      ev.preventDefault();
      break;
    case "ArrowUp":
      // Focus previous
      const prev = document.activeElement.previousSibling;
      if (prev !== null && isFocusable()) {
        niceFocus(prev);
        ev.preventDefault();
      }
      break;
    case "ArrowDown":
      // Focus next
      const next = document.activeElement.nextSibling;
      if (next !== null && isFocusable()) {
        niceFocus(next);
        ev.preventDefault();
      }
      break;
  }
})
