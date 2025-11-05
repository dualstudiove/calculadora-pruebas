const { useState, useEffect } = React;

const dataURL = "src/data.json";

function fuzzyMatch(query, term) {
  const maxDistance = 4;
  const queryl = query.toLowerCase();
  const terml = term.toLowerCase();

  let previousIndex = 0;
  let fromIndex = 0;

  for (const c of queryl) {
    fromIndex = terml.indexOf(c, previousIndex);
    const distance = fromIndex - previousIndex;
    if (fromIndex === -1 || distance > maxDistance) {
      return false;
    }
    previousIndex = fromIndex;
  }

  return true;
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
  }, [tests]);

  const filtered = tests.filter(
    (t) =>
      fuzzyMatch(search, t.name) &&
      !selected.find((s) => s.name === t.name)
  );

  const addTest = (test) => setSelected([...selected, test]);
  const removeTest = (test) =>
    setSelected(selected.filter((s) => s.name !== test.name));

  const total = selected.reduce((acc, t) => acc + t.price, 0);

  const testDisplay = (test) => React.createElement(
    "span",
    { className: "flex-grow flex pe-3 justify-between" },
    React.createElement("span", null, `${test.name}`),
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
          className: "w-full border p-2 rounded-xl mb-4",
          placeholder: "Buscar prueba",
          value: search,
          onChange: (e) => setSearch(e.target.value),
        }),
        React.createElement(
          "div",
          { className: "space-y-2 h-full overflow-y-auto" },
          filtered.map((test) =>
            React.createElement(
              "div",
              { key: test.name, className: "flex justify-between items-center border p-2 rounded-xl" },
              testDisplay(test),
              React.createElement(
                "button",
                {
                  className: "bg-blue-500 text-white px-3 py-1 rounded-xl",
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
          { className: "space-y-2 overflow-y-auto mb-4" },
          React.createElement("h2", { className: "text-xl font-bold mb-3" }, "Calculadora"),
          selected.map((test) =>
            React.createElement(
              "div",
              { key: test.name, className: "flex justify-between items-center border p-2 rounded-xl" },
              testDisplay(test),
              React.createElement(
                "button",
                {
                  className: "bg-red-500 text-white px-3 py-1 rounded-xl",
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
