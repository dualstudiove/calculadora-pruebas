import  tests  from './data.json';

const { useState } = React;

// const tests = [
//   { name: "Hemograma", price: 10 },
//   { name: "Glucosa", price: 8 },
//   { name: "Perfil Lipídico", price: 20 },
//   { name: "Tiroideas", price: 25 }, 
//   { name: "Urea", price: 7 }, 
//   { name: "Creatinina", price: 9 }
// ]; 
//
function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find((s) => s.name === t.name)
  );

  const addTest = (test) => setSelected([...selected, test]);
  const removeTest = (test) =>
    setSelected(selected.filter((s) => s.name !== test.name));

  const total = selected.reduce((acc, t) => acc + t.price, 0);

  return (
    React.createElement(
      "div",
      { className: "min-h-screen bg-gray-100 p-4 grid grid-cols-1 md:grid-cols-2 gap-3" },

      // IZQUIERDA
      React.createElement(
        "div",
        { className: "bg-white shadow rounded-2xl p-4 flex flex-col" },
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
              React.createElement("span", null, `${test.name} - $${test.price}`),
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
        { className: "bg-white shadow rounded-2xl p-4 flex flex-col justify-between" },

        React.createElement(
          "div",
          { className: "space-y-2 overflow-y-auto mb-4" },
          React.createElement("h2", { className: "text-xl font-bold mb-3" }, "Calculadora"),
          selected.map((test) =>
            React.createElement(
              "div",
              { key: test.name, className: "flex justify-between items-center border p-2 rounded-xl" },
              React.createElement("span", null, `${test.name} - $${test.price}`),
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
          React.createElement("div", { className: "p-3 bg-gray-200 rounded-xl text-lg font-bold" }, `Total: $${total}`),
          React.createElement(
            "p",
            { className: "text-xs text-gray-500 mt-1" },
            "Precios actualizados el martes, 04/11/25 23:09"
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
