import { useState } from "react";
import "./App.css";

const themes = {
  ocean: {
    "--bg": "#0f172a",
    "--display-bg": "#1e293b",
    "--btn": "#38bdf8",
    "--btn-alt": "#0ea5e9",
    "--text": "#e2e8f0"
  },
  sunset: {
    "--bg": "#1c0f0f",
    "--display-bg": "#331212",
    "--btn": "#ff7f50",
    "--btn-alt": "#ff6347",
    "--text": "#ffe4e1"
  },
  forest: {
    "--bg": "#0f1f0f",
    "--display-bg": "#1b3b1b",
    "--btn": "#4ade80",
    "--btn-alt": "#22c55e",
    "--text": "#e8ffe8"
  },
  lavender: {
    "--bg": "#1a1423",
    "--display-bg": "#2e2151",
    "--btn": "#c084fc",
    "--btn-alt": "#a855f7",
    "--text": "#f3e8ff"
  },
  sand: {
    "--bg": "#3e2f1c",
    "--display-bg": "#5a4323",
    "--btn": "#fcd34d",
    "--btn-alt": "#fbbf24",
    "--text": "#fff7e6"
  }
};

function App() {
  const [expression, setExpression] = useState("");
  const [theme, setTheme] = useState("ocean");

  const applyTheme = (name) => {
    const vars = themes[name];
    for (let key in vars) {
      document.documentElement.style.setProperty(key, vars[key]);
    }
    setTheme(name);
  };

  const press = (val) => {
    if (val === "C") return setExpression("");
    if (val === "=") {
      try {

        const res = Function("return " + expression)();
        return setExpression(String(res));
      } catch {
        return setExpression("Error");
      }
    }
    setExpression(expression + val);
  };

  const buttons = [
    "7","8","9","/",
    "4","5","6","*",
    "1","2","3","-",
    "0",".","=","+",
    "C"
  ];

  return (
    <div className="calculator-container">
      <h2 className="title">Minimal Calculator</h2>

      <div className="theme-selector">
        {Object.keys(themes).map((t) => (
          <button
            key={t}
            className={`theme-btn ${theme === t ? "active" : ""}`}
            onClick={() => applyTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="calculator">
        <div className="display">{expression || "0"}</div>

        <div className="buttons">
          {buttons.map((btn, idx) => (
            <button key={idx} onClick={() => press(btn)}>{btn}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
