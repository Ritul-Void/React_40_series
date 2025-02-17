import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import "./app.css"

export default function App() {
  const [query, setQuery] = useState("");
  const [wordData, setWordData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);


  useEffect(() => {
    const stored = localStorage.getItem("dictionary-history");
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);


  useEffect(() => {
    localStorage.setItem("dictionary-history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const fuse = new Fuse(searchHistory, {
    includeScore: true,
    threshold: 0.4,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cached = localStorage.getItem(`word-${query.toLowerCase()}`);

    if (cached) {
      setWordData(JSON.parse(cached));
      updateHistory(query);
      return;
    }

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setWordData(data[0]);
        localStorage.setItem(`word-${query.toLowerCase()}`, JSON.stringify(data[0]));
        updateHistory(query);
      } else {
        setWordData(null);
      }
    } catch (err) {
      setWordData(null);
    }
  };

  const updateHistory = (word) => {
    if (!searchHistory.includes(word.toLowerCase())) {
      const updated = [word.toLowerCase(), ...searchHistory].slice(0, 50);
      setSearchHistory(updated);
    }
  };

  const fuzzySuggestions = query
    ? fuse.search(query).map((r) => r.item).slice(0, 5)
    : [];

  return (
    <div className="app">
      <h1 className="title">Dictionary</h1>

      <form onSubmit={handleSearch} className="search-area">
        <input
          className="search-input"
          placeholder="Search word..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {fuzzySuggestions.length > 0 && (
        <div className="suggestions">
          {fuzzySuggestions.map((s, i) => (
            <div
              key={i}
              className="suggestion"
              onClick={() => {
                setQuery(s);
                handleSearch({ preventDefault: () => {} });
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {wordData ? (
        <div className="result">
          <h2 className="word">{wordData.word}</h2>

          {wordData.phonetics?.map((p, i) => (
            <div key={i} className="phonetic">
              {p.text && <span>{p.text}</span>}
              {p.audio && (
                <audio controls src={p.audio} style={{ marginTop: "8px" }} />
              )}
            </div>
          ))}

          {wordData.meanings?.map((m, i) => (
            <div key={i} className="meaning">
              <div className="speech">{m.partOfSpeech}</div>

              {m.definitions.map((d, j) => (
                <div key={j} className="definition">
                  • {d.definition}
                  {d.example && (
                    <div className="example">“{d.example}”</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        query && (
          <div className="no-result">No definition found for “{query}” in cache , put the complete word.</div>
        )
      )}
    </div>
  );
}
