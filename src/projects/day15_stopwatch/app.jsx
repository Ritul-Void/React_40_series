import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("clock"); // 'clock' or 'stopwatch'
  const [time, setTime] = useState(new Date());

  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const intervalRef = useRef(null);

  // Clock updater
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format function
  const formatTime = (t) => {
    const hrs = String(Math.floor(t / 3600)).padStart(2, "0");
    const mins = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const secs = String(t % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Stopwatch controls
  const startStopwatch = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setStopwatchTime((prev) => prev + 1);
    }, 1000);
  };

  const stopStopwatch = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetStopwatch = () => {
    stopStopwatch();
    setStopwatchTime(0);
  };

  return (
    <div className="watch-container">
      <div className="overlay"></div>

      {/* Mode Switch Button */}
      <button
        className="switch-btn"
        onClick={() =>
          setMode((prev) => (prev === "clock" ? "stopwatch" : "clock"))
        }
      >
        {mode === "clock" ? "Switch to Stopwatch" : "Switch to Clock"}
      </button>

      <div className="time-display">
        {mode === "clock" ? (
          <>
            <h1>
              {time.toLocaleTimeString("en-US", {
                hour12: false,
              })}
            </h1>
          </>
        ) : (
          <>
            <h1>{formatTime(stopwatchTime)}</h1>
            <div className="stopwatch-controls">
              <button onClick={startStopwatch}>Start</button>
              <button onClick={stopStopwatch}>Stop</button>
              <button onClick={resetStopwatch}>Reset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
