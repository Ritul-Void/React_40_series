import React, { useState, useEffect, useRef, useReducer } from 'react';
import './app.css';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import ProfileScreen from './components/ProfileScreen';
import AchievementsScreen from './components/AchievementsScreen';

// Initial profile state
const initialProfile = {
  playerName: 'Player',
  totalScore: 0,
  prestigeLevel: 0,
  totalKills: 0,
  gamesPlayed: 0,
  bestScore: 0,
  achievements: [
    { id: 1, name: 'Space Evader - Rank 1', description: 'Reach 1000 total points', unlocked: false, points: 1000 },
    { id: 2, name: 'Space Evader - Rank 2', description: 'Reach 5000 total points', unlocked: false, points: 5000 },
    { id: 3, name: 'Space Evader - Rank 3', description: 'Reach 10000 total points', unlocked: false, points: 10000 },
    { id: 4, name: 'Sharpshooter', description: 'Get 100 kills in a single game', unlocked: false, kills: 100 },
    { id: 5, name: 'Wave Master', description: 'Survive 10 waves in one game', unlocked: false, waves: 10 }
  ]
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // menu, game, profile, achievements
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('spaceInvadersProfile');
    return saved ? JSON.parse(saved) : initialProfile;
  });
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStats, setGameStats] = useState(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spaceInvadersProfile', JSON.stringify(profile));
  }, [profile]);

  // Handle game completion
  const handleGameEnd = (stats) => {
    const newProfile = { ...profile };
    newProfile.gamesPlayed += 1;
    newProfile.totalScore += stats.score;
    newProfile.totalKills += stats.kills;
    
    if (stats.score > newProfile.bestScore) {
      newProfile.bestScore = stats.score;
    }

    // Check achievements
    if (newProfile.totalScore >= 10000 && !newProfile.achievements[2].unlocked) {
      newProfile.achievements[2].unlocked = true;
    }
    if (newProfile.totalScore >= 5000 && !newProfile.achievements[1].unlocked) {
      newProfile.achievements[1].unlocked = true;
    }
    if (newProfile.totalScore >= 1000 && !newProfile.achievements[0].unlocked) {
      newProfile.achievements[0].unlocked = true;
    }
    if (stats.kills >= 100 && !newProfile.achievements[3].unlocked) {
      newProfile.achievements[3].unlocked = true;
    }
    if (stats.waves >= 10 && !newProfile.achievements[4].unlocked) {
      newProfile.achievements[4].unlocked = true;
    }

    setProfile(newProfile);
    setGameStats(stats);
    setCurrentScreen('menu');
  };

  // Handle prestige
  const handlePrestige = () => {
    setProfile(prev => ({
      ...prev,
      prestigeLevel: prev.prestigeLevel + 1,
      totalScore: 0,
      totalKills: 0,
      gamesPlayed: 0,
      bestScore: 0,
      achievements: prev.achievements.map(ach => ({ ...ach, unlocked: false }))
    }));
  };

  return (
    <div className="app-container">
      {currentScreen === 'menu' && (
        <MainMenu
          profile={profile}
          onPlayClick={() => {
            setCurrentScreen('game');
            setGameStats(null);
          }}
          onProfileClick={() => setCurrentScreen('profile')}
          onAchievementsClick={() => setCurrentScreen('achievements')}
          onEditName={() => {
            const newName = prompt('Enter your player name:', profile.playerName);
            if (newName && newName.trim()) {
              setProfile(prev => ({ ...prev, playerName: newName.trim() }));
            }
          }}
          onPrestige={handlePrestige}
          lastGameStats={gameStats}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          difficulty={difficulty}
          profile={profile}
          onDifficultySelect={(diff) => setDifficulty(diff)}
          onGameEnd={handleGameEnd}
          onBack={() => setCurrentScreen('menu')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          profile={profile}
          onBack={() => setCurrentScreen('menu')}
        />
      )}

      {currentScreen === 'achievements' && (
        <AchievementsScreen
          profile={profile}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
    </div>
  );
}
