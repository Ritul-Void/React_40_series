import React, { useEffect, useState } from "react";
import "./app.css";
import "./98.css";
import Draggable from "./drag";

// ===== ICON OBJECT (replace PNGs later) =====
const icons = {
  temp: "./img/high.png",
  high: "./img/high.png",
  low: "./img/low.png",
  wind: "./img/wind.png",
  uv: "./img/uv.png",
  rain: "./img/rain.png",
  sunrise: "/img/sunrise.png",
  sunset: "./img/sunset.png",
  location: "./img/location.png",
  placeholder: "./img/icon.png",
};

export default function App() {
  const [location, setLocation] = useState("Naseby");
  const [coords, setCoords] = useState({ lat: -45.0, lon: 170.0 });

  const [unit, setUnit] = useState("C");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  // ============ Fetch Weather ============
  const fetchWeather = async () => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto`;

    const r = await fetch(url);
    const data = await r.json();

    setWeather(data.current);
    setForecast(data.daily);
  };

  useEffect(() => {
    fetchWeather();
  }, [coords]);

  // ============ Convert Units ============
  const convert = (t) => (unit === "C" ? t : t * 1.8 + 32);

  // ============ Change Location ============
  const applyLocationSearch = async () => {
    if (!locationInput) return;

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}`
    );
    const geo = await res.json();

    if (geo.results && geo.results.length > 0) {
      const r = geo.results[0];
      setCoords({ lat: r.latitude, lon: r.longitude });
      setLocation(r.name);
    }

    setShowLocationInput(false);
  };

  return (
    <div className="desktop">

      {/* ===================== CURRENT WEATHER WINDOW ======================= */}
      <Draggable>
        {/* ---- Title Bar ---- */}
        <div className="title-bar">
          <div className="title-bar-text">Weatherbot</div>
          <div className="title-bar-controls">
            <button aria-label="Close"></button>
          </div>
        </div>

        {/* ---- Body ---- */}
        <div className="window window-body">

          {/* Location Row */}
          <div className="location-row">
            <b>{location}</b>

            {/* unit toggle */}
            <button
              className="icon-btn"
              onClick={() => setUnit(unit === "C" ? "F" : "C")}
            >
              {unit}
            </button>

            {/* Location icon */}
            <button
              className="icon-btn"
              onClick={() => setShowLocationInput(true)}
            >
              <img src={icons.location} width="14" />
            </button>
          </div>

          {/* Search Box */}
          {showLocationInput && (
            <div className="location-input">
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter city…"
              />
              <button onClick={applyLocationSearch}>OK</button>
            </div>
          )}

          {/* Current Weather Stats */}
          {weather && forecast && (
            <div className="weather-grid">
              <div>
                <img src={icons.temp} /> Current:{" "}
                {convert(weather.temperature_2m).toFixed(1)}°{unit}
              </div>

              <div>
                <img src={icons.high} /> High:{" "}
                {convert(forecast.temperature_2m_max[0]).toFixed(1)}°{unit}
              </div>

              <div>
                <img src={icons.low} /> Low:{" "}
                {convert(forecast.temperature_2m_min[0]).toFixed(1)}°{unit}
              </div>

              <div>
                <img src={icons.wind} /> Wind: {weather.wind_speed_10m} km/h
              </div>

              <div>
                <img src={icons.uv} /> UV: {weather.uv_index}
              </div>

              <div>
                <img src={icons.rain} /> Rain: {forecast.precipitation_sum[0]} mm
              </div>

              <div>
                <img src={icons.sunrise} /> Sunrise:{" "}
                {forecast.sunrise[0].split("T")[1]}
              </div>

              <div>
                <img src={icons.sunset} /> Sunset:{" "}
                {forecast.sunset[0].split("T")[1]}
              </div>
            </div>
          )}
        </div>
      </Draggable>

      {/* ===================== FORECAST WINDOW ======================= */}
      <Draggable>
        {/* ---- Title Bar ---- */}
        <div className="title-bar">
          <div className="title-bar-text">7-Day Forecast</div>
          <div className="title-bar-controls">
            <button aria-label="Close"></button>
          </div>
        </div>

        {/* ---- Body ---- */}
        <div className="window window-body forecast-body">

          {forecast ? (
            forecast.time.map((day, i) => (
              <div className="forecast-row" key={i}>
                <div className="forecast-day">
                  {new Date(day).toLocaleDateString("en", {
                    weekday: "long",
                  })}
                </div>

                <div className="forecast-info">
                  <img src={icons.placeholder} width="22" />
                  <span>
                    {convert(forecast.temperature_2m_max[i]).toFixed(1)}°{unit} /
                    {convert(forecast.temperature_2m_min[i]).toFixed(1)}°{unit}
                  </span>
                  <span>{forecast.precipitation_sum[i]} mm</span>
                </div>
              </div>
            ))
          ) : (
            <p>Loading forecast…</p>
          )}

        </div>
      </Draggable>
    </div>
  );
}
