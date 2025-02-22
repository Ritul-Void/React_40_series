import React from 'react';

export default function MainMenu({ profile, onPlayClick, onProfileClick, onAchievementsClick, onEditName, onPrestige, lastGameStats }) {
  return (
    <div className="main-menu">
      <div className="menu-container">
        <h1 className="title">SPACE INVADERS</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <h2>{profile.playerName}</h2>
            <button className="edit-button" onClick={onEditName}>Edit Name</button>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="label">Prestige Level:</span>
              <span className="value prestige">{profile.prestigeLevel}</span>
            </div>
            <div className="stat">
              <span className="label">Total Score:</span>
              <span className="value">{profile.totalScore}</span>
            </div>
            <div className="stat">
              <span className="label">Best Score:</span>
              <span className="value">{profile.bestScore}</span>
            </div>
            <div className="stat">
              <span className="label">Total Kills:</span>
              <span className="value">{profile.totalKills}</span>
            </div>
            <div className="stat">
              <span className="label">Games Played:</span>
              <span className="value">{profile.gamesPlayed}</span>
            </div>
          </div>
        </div>

        {lastGameStats && (
          <div className="last-game-stats">
            <h3>Last Game Results</h3>
            <p>Score: {lastGameStats.score} | Kills: {lastGameStats.kills} | Waves: {lastGameStats.waves}</p>
          </div>
        )}

        <div className="menu-buttons">
          <button className="btn btn-primary" onClick={onPlayClick}>Play Game</button>
          <button className="btn btn-secondary" onClick={onProfileClick}>Profile</button>
          <button className="btn btn-secondary" onClick={onAchievementsClick}>Achievements</button>
          {profile.totalScore >= 1000 && (
            <button className="btn btn-prestige" onClick={onPrestige}>
              Prestige! (Rank {profile.prestigeLevel + 1})
            </button>
          )}
        </div>

        <div className="achievements-preview">
          <h3>Achievements</h3>
          <div className="achievements-grid">
            {profile.achievements.slice(0, 3).map(ach => (
              <div key={ach.id} className={`achievement-badge ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon">🏆</div>
                <div className="badge-name">{ach.name}</div>
              </div>
            ))}
          </div>
          <p className="achievement-hint">{profile.achievements.filter(a => a.unlocked).length} / {profile.achievements.length} Unlocked</p>
        </div>

        <div className="footer">
          <p>📍 Controls: Arrow Keys to Move | Space to Shoot</p>
        </div>
      </div>
    </div>
  );
}
