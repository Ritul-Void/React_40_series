import React, { useState, useRef, useEffect } from "react";
import "./app.css";

const ACHIEVEMENTS = [
  { key: "first_play", label: "First Play", desc: "Play your first game." },
  { key: "score_10", label: "Score 10", desc: "Reach a score of 10." },
  { key: "score_25", label: "Score 25", desc: "Reach a score of 25." },
  { key: "score_50", label: "Score 50", desc: "Reach a score of 50." },
  { key: "all_modes", label: "All Modes", desc: "Play all game modes." },
];

const MODES = [
  { key: "classic", label: "Classic" },
  { key: "walls", label: "With Walls" },
  { key: "crazy", label: "Crazy Mode" },
];

function MiniProfile({ username, achievements }) {
  return (
    <div className="mini-profile">
      <h3>{username ? username : "Guest"}</h3>
      <div className="achievements">
        {ACHIEVEMENTS.map((a) => (
          <span
            key={a.key}
            className={achievements[a.key] ? "achieved" : "locked"}
            title={a.desc}
          >
            {a.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MainMenu({ username, setUsername, achievements, onSelectMode }) {
  const [input, setInput] = useState("");
  return (
    <div className="main-menu">
      <MiniProfile username={username} achievements={achievements} />
      <div className="username-input">
        <input
          type="text"
          placeholder="Enter your name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => setUsername(input || "Guest")}>Set Name</button>
      </div>
      <h2>Select Game Mode</h2>
      <div className="modes">
        {MODES.map((mode) => (
          <button key={mode.key} onClick={() => onSelectMode(mode.key)}>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}


function SnakeGame({ mode, onBack, onGameEnd, achievements }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState("RIGHT");
  const [snake, setSnake] = useState([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
  ]);
  const [food, setFood] = useState({ x: 12, y: 8 });
  const [speed, setSpeed] = useState(120);
  const [walls, setWalls] = useState([]);

  // Mode setup
  useEffect(() => {
    setScore(0);
    setGameOver(false);
    setDirection("RIGHT");
    setSnake([
      { x: 8, y: 8 },
      { x: 7, y: 8 },
    ]);
    setFood({ x: 12, y: 8 });
    setSpeed(mode === "crazy" ? 60 : 120);
    if (mode === "walls") {
      // Add some wall blocks
      setWalls([
        ...Array(16).fill(0).map((_, i) => ({ x: i, y: 0 })),
        ...Array(16).fill(0).map((_, i) => ({ x: i, y: 15 })),
        ...Array(14).fill(0).map((_, i) => ({ x: 0, y: i + 1 })),
        ...Array(14).fill(0).map((_, i) => ({ x: 15, y: i + 1 })),
      ]);
    } else {
      setWalls([]);
    }
  }, [mode]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e) {
      if (gameOver) return;
      if (["ArrowUp", "w", "W"].includes(e.key) && direction !== "DOWN") setDirection("UP");
      if (["ArrowDown", "s", "S"].includes(e.key) && direction !== "UP") setDirection("DOWN");
      if (["ArrowLeft", "a", "A"].includes(e.key) && direction !== "RIGHT") setDirection("LEFT");
      if (["ArrowRight", "d", "D"].includes(e.key) && direction !== "LEFT") setDirection("RIGHT");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Wall collision
        if (mode === "classic" || mode === "crazy") {
          if (head.x < 0) head.x = 15;
          if (head.x > 15) head.x = 0;
          if (head.y < 0) head.y = 15;
          if (head.y > 15) head.y = 0;
        }
        if (mode === "walls") {
          if (head.x < 0 || head.x > 15 || head.y < 0 || head.y > 15) {
            setGameOver(true);
            return prevSnake;
          }
        }
        // Wall block collision
        if (walls.some((w) => w.x === head.x && w.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }
        // Self collision
        if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }
        // Food collision
        let newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          // Place new food
          let newFood;
          do {
            newFood = {
              x: Math.floor(Math.random() * 16),
              y: Math.floor(Math.random() * 16),
            };
          } while (
            newSnake.some((s) => s.x === newFood.x && s.y === newFood.y) ||
            walls.some((w) => w.x === newFood.x && w.y === newFood.y)
          );
          setFood(newFood);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [direction, food, speed, gameOver, mode, walls]);

  // Crazy mode: random direction
  useEffect(() => {
    if (mode !== "crazy" || gameOver) return;
    const crazyInt = setInterval(() => {
      const dirs = ["UP", "DOWN", "LEFT", "RIGHT"];
      setDirection(dirs[Math.floor(Math.random() * 4)]);
    }, 2000);
    return () => clearInterval(crazyInt);
  }, [mode, gameOver]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 320, 320);
    // Draw grid
    ctx.strokeStyle = "#333";
    for (let i = 0; i <= 16; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 20, 0);
      ctx.lineTo(i * 20, 320);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * 20);
      ctx.lineTo(320, i * 20);
      ctx.stroke();
    }
    // Draw snake
    ctx.fillStyle = "#4caf50";
    snake.forEach((s, i) => {
      ctx.fillRect(s.x * 20 + 2, s.y * 20 + 2, 16, 16);
    });
    // Draw food
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(food.x * 20 + 4, food.y * 20 + 4, 12, 12);
    // Draw walls
    ctx.fillStyle = "#888";
    walls.forEach((w) => ctx.fillRect(w.x * 20 + 2, w.y * 20 + 2, 16, 16));
  }, [snake, food, walls]);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => onGameEnd(score), 800);
    }
  }, [gameOver]);

  return (
    <div className="snake-game">
      <button onClick={onBack}>Back to Menu</button>
      <h2>Mode: {MODES.find((m) => m.key === mode).label}</h2>
      <canvas ref={canvasRef} width={320} height={320} style={{ background: "#111", margin: "1rem auto", display: "block", borderRadius: 8 }} />
      <div style={{ margin: "1rem 0" }}>Score: {score}</div>
      {gameOver && <div style={{ color: "#e53935", fontWeight: "bold" }}>Game Over!</div>}
    </div>
  );
}

import { useEffect } from "react";
function App() {
  const [username, setUsername] = useState("");
  const [achievements, setAchievements] = useState({});
  const [mode, setMode] = useState(null);
  const [modesPlayed, setModesPlayed] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("snake_username");
    const savedAch = localStorage.getItem("snake_achievements");
    const savedModes = localStorage.getItem("snake_modesPlayed");
    if (savedUser) setUsername(savedUser);
    if (savedAch) setAchievements(JSON.parse(savedAch));
    if (savedModes) setModesPlayed(JSON.parse(savedModes));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("snake_username", username);
  }, [username]);
  useEffect(() => {
    localStorage.setItem("snake_achievements", JSON.stringify(achievements));
  }, [achievements]);
  useEffect(() => {
    localStorage.setItem("snake_modesPlayed", JSON.stringify(modesPlayed));
  }, [modesPlayed]);

  function handleSelectMode(selectedMode) {
    setMode(selectedMode);
    if (!modesPlayed.includes(selectedMode)) {
      setModesPlayed([...modesPlayed, selectedMode]);
    }
    setAchievements((prev) => ({ ...prev, first_play: true }));
  }

  function handleGameEnd(score) {
    setMode(null);
    setAchievements((prev) => {
      const newAch = { ...prev };
      if (score >= 10) newAch.score_10 = true;
      if (score >= 25) newAch.score_25 = true;
      if (score >= 50) newAch.score_50 = true;
      if (modesPlayed.length === MODES.length - 1) newAch.all_modes = true;
      return newAch;
    });
  }

  return mode ? (
    <SnakeGame
      mode={mode}
      onBack={() => setMode(null)}
      onGameEnd={handleGameEnd}
      achievements={achievements}
    />
  ) : (
    <MainMenu
      username={username}
      setUsername={setUsername}
      achievements={achievements}
      onSelectMode={handleSelectMode}
    />
  );
}

export default App;
