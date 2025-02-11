import { useState, useEffect } from "react";
import "./app.css";

export default function App() {
  const [site, setSite] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState([]);

  // Load saved passwords
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("passwords")) || [];
    setSaved(data);
  }, []);

  // Save to localStorage
  const updateLocal = (arr) => {
    localStorage.setItem("passwords", JSON.stringify(arr));
  };

  // Password Generator
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pass);
  };

  // Add Password
  const addPassword = () => {
    if (!site || !password) return;

    const newData = [...saved, { site, password }];
    setSaved(newData);
    updateLocal(newData);

    setSite("");
    setPassword("");
  };

  return (
    <div className="container">
      <div className="title-section">
        <h2>KEEP YOUR</h2>
        <h1 className="bold">PASSWORDS</h1>
        <h2>SAFE HERE</h2>
      </div>

      <div className="box">
        <input
          type="text"
          placeholder="Enter Website"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />

        <input
          type="text"
          placeholder="Generated Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="add-btn" onClick={addPassword}>
          +
        </button>

        <button className="gen-btn" onClick={generatePassword}>
          genrate
        </button>
      </div>

      <div className="count-box">
        <p>Total Number Of <br /> Password Safe</p>
        <h1>{saved.length}</h1>
      </div>

      <h3 className="saved-title">Saved pass</h3>

      <div className="saved-list">
        {saved.map((item, index) => (
          <div className="saved-card" key={index}>
            <p><b>Site:</b> {item.site}</p>
            <p><b>Password:</b> {item.password}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
