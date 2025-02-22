import React from 'react';

export default function AchievementsScreen({ profile, onBack }) {
  const getAchievementIcon = (id) => {
    const icons = {
      1: '🥉', // Space Evader Rank 1
      2: '🥈', // Space Evader Rank 2
      3: '🥇', // Space Evader Rank 3
      4: '🎯', // Sharpshooter
      5: '🌊'  // Wave Master
    };
    return icons[id] || '🏆';
  };

  const getProgressPercentage = (achievement) => {
    if (achievement.id === 1) return Math.min((profile.totalScore / 1000) * 100, 100);
    if (achievement.id === 2) return Math.min((profile.totalScore / 5000) * 100, 100);
    if (achievement.id === 3) return Math.min((profile.totalScore / 10000) * 100, 100);
    return 0;
  };

  const getProgressText = (achievement) => {
    if (achievement.id === 1) return `${profile.totalScore} / 1000`;
    if (achievement.id === 2) return `${profile.totalScore} / 5000`;
    if (achievement.id === 3) return `${profile.totalScore} / 10000`;
    return '';
  };

  return (
    <div className="achievements-screen">
      <div className="screen-container">
        <button className="back-button" onClick={onBack}>← Back</button>
        
        <h1>Achievements & Prestige</h1>
        
        <div className="achievements-container">
          <div className="achievements-header">
            <h2>Unlocked: {profile.achievements.filter(a => a.unlocked).length} / {profile.achievements.length}</h2>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(profile.achievements.filter(a => a.unlocked).length / profile.achievements.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="prestige-section">
            <h3>Prestige Status</h3>
            <div className="prestige-card">
              <div className="prestige-level">Level {profile.prestigeLevel}</div>
              <p>Reach specific achievements to unlock prestige mode and further increase your rank!</p>
            </div>
          </div>

          <div className="achievements-list">
            {profile.achievements.map(achievement => (
              <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">{getAchievementIcon(achievement.id)}</div>
                <div className="achievement-content">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                  {!achievement.unlocked && (achievement.points || achievement.kills || achievement.waves) && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${getProgressPercentage(achievement)}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{getProgressText(achievement)}</span>
                    </div>
                  )}
                  {achievement.unlocked && <div className="unlocked-badge">🎉 Unlocked!</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="achievement-instructions">
            <h3>How to Earn Achievements</h3>
            <ul>
              <li><strong>Space Evader - Rank 1:</strong> Accumulate 1000 total points across all games</li>
              <li><strong>Space Evader - Rank 2:</strong> Accumulate 5000 total points</li>
              <li><strong>Space Evader - Rank 3:</strong> Accumulate 10000 total points</li>
              <li><strong>Sharpshooter:</strong> Eliminate 100 enemies in a single game session</li>
              <li><strong>Wave Master:</strong> Survive 10 consecutive waves in one game</li>
            </ul>
          </div>

          <div className="prestige-explanation">
            <h3>About the Prestige System</h3>
            <p>
              Once you've unlocked the "Space Evader - Rank 1" achievement by reaching 1000 points, 
              you can choose to Prestige. This will reset your game progress but permanently increase 
              your Prestige Level, giving you special recognition. You can prestige multiple times 
              to climb through the ranks!
            </p>
            <p className="prestige-tip">
              💡 Tip: Each prestige level gives you bragging rights and shows your dedication to the game!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
