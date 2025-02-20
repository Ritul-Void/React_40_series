import React, { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export default function App() {
  const [stories, setStories] = useState([]);
  const [type, setType] = useState("topstories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchStories();
  }, [type]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/${type}.json`);
      const ids = await res.json();

      const selectedIds = ids.slice(0, 30);

      const storyPromises = selectedIds.map(id =>
        fetch(`${BASE_URL}/item/${id}.json`).then(res => res.json())
      );

      const data = await Promise.all(storyPromises);
      setStories(data.filter(Boolean));
      setLoading(false);
    } catch (err) {
      setError("Failed to load news.");
      setLoading(false);
    }
  };

  const filteredStories = stories
    .filter(story =>
      story.title?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, limit);

  const formatTime = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <h1>📰 Hacker News Feed</h1>

      {/* Controls */}
      <div className="controls">
        <div className="tabs">
          <button onClick={() => setType("topstories")}>Top</button>
          <button onClick={() => setType("newstories")}>New</button>
          <button onClick={() => setType("beststories")}>Best</button>
        </div>

        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* States */}
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {/* Stories */}
      <div className="news-list">
        {filteredStories.map(story => (
          <div key={story.id} className="card">
            <h3>
              <a href={story.url} target="_blank" rel="noreferrer">
                {story.title}
              </a>
            </h3>
            <div className="meta">
              <span>👤 {story.by}</span>
              <span>⭐ {story.score}</span>
              <span>💬 {story.descendants || 0}</span>
              <span>{formatTime(story.time)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {limit < filteredStories.length && (
        <button className="load-more" onClick={() => setLimit(limit + 10)}>
          Load More
        </button>
      )}
    </div>
  );
}
