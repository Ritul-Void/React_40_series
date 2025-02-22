import React from 'react';

export default function ProfileScreen({ profile, onBack }) {
  return (
    <div className="profile-screen">
      <div className="screen-container">
        <button className="back-button" onClick={onBack}>← Back</button>
        
        <h1>Player Profile</h1>
        
        <div className="profile-detail-card">
          <div className="profile-section">
            <h2>{profile.playerName}</h2>
            <p className="prestige-badge">Prestige Level: <span className="prestige-number">{profile.prestigeLevel}</span></p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>Total Score</h3>
                <p className="stat-value">{profile.totalScore}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <h3>Best Score</h3>
                <p className="stat-value">{profile.bestScore}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💥</div>
              <div className="stat-info">
                <h3>Total Kills</h3>
                <p className="stat-value">{profile.totalKills}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-info">
                <h3>Games Played</h3>
                <p className="stat-value">{profile.gamesPlayed}</p>
              </div>
            </div>
          </div>

          <div className="statistics-section">
            <h3>Statistics</h3>
            <div className="stat-row">
              <span>Average Score per Game:</span>
              <span className="stat-result">
                {profile.gamesPlayed > 0 ? (profile.totalScore / profile.gamesPlayed).toFixed(0) : 0}
              </span>
            </div>
            <div className="stat-row">
              <span>Average Kills per Game:</span>
              <span className="stat-result">
                {profile.gamesPlayed > 0 ? (profile.totalKills / profile.gamesPlayed).toFixed(1) : 0}
              </span>
            </div>
            <div className="stat-row">
              <span>Win Rate:</span>
              <span className="stat-result">
                {profile.gamesPlayed > 0 ? ((profile.bestScore / profile.totalScore) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>

          <div className="prestige-info">
            <h3>Prestige System</h3>
            <p>You are currently at <strong>Prestige Level {profile.prestigeLevel}</strong></p>
            <p className="prestige-description">
              Earn achievements and reach milestones to unlock the prestige system. 
              Each prestige resets your progress but increases your prestige rank!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
