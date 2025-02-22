import React, { useState, useEffect, useRef } from 'react';

export default function GameScreen({ difficulty, profile, onDifficultySelect, onGameEnd, onBack }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const gameRef = useRef(null);

 
  const difficultySettings = {
    easy: { enemySpeed: 1, bulletSpeed: 5, enemySpawn: 100, pointsMultiplier: 1 },
    hard: { enemySpeed: 2, bulletSpeed: 6, enemySpawn: 60, pointsMultiplier: 2 },
    elite: { enemySpeed: 3, bulletSpeed: 7, enemySpawn: 40, pointsMultiplier: 3 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const settings = difficultySettings[difficulty];


    let player = {
      x: canvas.width / 2 - 20,
      y: canvas.height - 30,
      width: 40,
      height: 30,
      speed: 5,
      health: 100
    };

    let enemies = [];
    let bullets = [];
    let score = 0;
    let kills = 0;
    let wave = 1;
    let gameRunning = false;
    let spawnCounter = 0;
    let frameCount = 0;

    const keys = {};

    const keyDown = (e) => {
      keys[e.key] = true;
      if (e.key === ' ' && gameRunning) {
        createBullet();
        e.preventDefault();
      }
    };

    const keyUp = (e) => {
      keys[e.key] = false;
    };

    const createBullet = () => {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: settings.bulletSpeed
      });
    };

    const createEnemy = () => {
      const enemyWidth = 30;
      const enemyHeight = 25;
      enemies.push({
        x: Math.random() * (canvas.width - enemyWidth),
        y: -enemyHeight,
        width: enemyWidth,
        height: enemyHeight,
        speed: settings.enemySpeed,
        health: 1
      });
    };

    const updatePlayer = () => {
      if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
      }
      if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }
    };

    const updateBullets = () => {
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;

        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
          continue;
        }

        // Collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          if (
            bullets[i].x < enemies[j].x + enemies[j].width &&
            bullets[i].x + bullets[i].width > enemies[j].x &&
            bullets[i].y < enemies[j].y + enemies[j].height &&
            bullets[i].y + bullets[i].height > enemies[j].y
          ) {
            enemies.splice(j, 1);
            bullets.splice(i, 1);
            score += 10 * settings.pointsMultiplier;
            kills += 1;
            break;
          }
        }
      }
    };

    const updateEnemies = () => {
      for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;

        if (enemies[i].y > canvas.height) {
          enemies.splice(i, 1);
          player.health -= 10;
          continue;
        }

        // Collision with player
        if (
          enemies[i].x < player.x + player.width &&
          enemies[i].x + enemies[i].width > player.x &&
          enemies[i].y < player.y + player.height &&
          enemies[i].y + enemies[i].height > player.y
        ) {
          player.health -= 20;
          enemies.splice(i, 1);
        }
      }

      // Spawn enemies
      spawnCounter--;
      if (spawnCounter <= 0) {
        createEnemy();
        spawnCounter = Math.max(20, settings.enemySpawn - wave * 5);
      }

      // Wave progression
      if (enemies.length === 0 && frameCount > 60 && wave < 20) {
        wave = Math.floor(frameCount / 300) + 1;
      }
    };

    const drawPlayer = () => {
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.strokeStyle = '#00AA00';
      ctx.lineWidth = 2;
      ctx.strokeRect(player.x, player.y, player.width, player.height);
    };

    const drawBullets = () => {
      ctx.fillStyle = '#FFFF00';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
    };

    const drawEnemies = () => {
      ctx.fillStyle = '#FF0000';
      enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.strokeStyle = '#AA0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
    };

    const drawUI = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${score}`, 10, 20);
      ctx.fillText(`Kills: ${kills}`, 10, 45);
      ctx.fillText(`Wave: ${wave}`, 10, 70);
      ctx.fillText(`Health: ${player.health}%`, canvas.width - 150, 20);

      // Health bar
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(canvas.width - 160, 30, (player.health * 1.5), 10);
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeRect(canvas.width - 160, 30, 150, 10);
    };

    const gameLoop = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameRunning) {
        updatePlayer();
        updateBullets();
        updateEnemies();

        drawEnemies();
        drawBullets();
        drawPlayer();
        drawUI();

        if (player.health <= 0) {
          gameRunning = false;
          setGameState('gameOver');
          onGameEnd({ score, kills, wave: wave - 1 });
        }

        frameCount++;
      }

      requestAnimationFrame(gameLoop);
    };

    const startGame = () => {
      player.health = 100;
      score = 0;
      kills = 0;
      wave = 1;
      enemies = [];
      bullets = [];
      gameRunning = true;
      frameCount = 0;
      spawnCounter = settings.enemySpawn;
      setGameState('playing');
    };

    const handleCanvasClick = () => {
      if (gameState === 'menu') {
        startGame();
      }
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    canvas.addEventListener('click', handleCanvasClick);

    const animationId = requestAnimationFrame(gameLoop);

    // Draw initial menu
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE INVADERS', canvas.width / 2, 100);
    ctx.font = '20px Arial';
    ctx.fillText('Difficulty: ' + difficulty.toUpperCase(), canvas.width / 2, 150);
    ctx.font = '16px Arial';
    ctx.fillText('Click to Start | Space to Shoot | Arrow Keys to Move', canvas.width / 2, canvas.height - 100);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [difficulty, gameState, onGameEnd]);

  return (
    <div className="game-screen">
      {gameState === 'menu' && (
        <div className="difficulty-selector">
          <h2>Select Difficulty</h2>
          <div className="difficulty-buttons">
            <button
              className={difficulty === 'easy' ? 'active' : ''}
              onClick={() => onDifficultySelect('easy')}
            >
              Easy
            </button>
            <button
              className={difficulty === 'hard' ? 'active' : ''}
              onClick={() => onDifficultySelect('hard')}
            >
              Hard
            </button>
            <button
              className={difficulty === 'elite' ? 'active' : ''}
              onClick={() => onDifficultySelect('elite')}
            >
              Elite
            </button>
          </div>
          <button className="back-button" onClick={onBack}>Back to Menu</button>
        </div>
      )}
      <canvas ref={canvasRef} width={800} height={600} className="game-canvas" />
    </div>
  );
}
