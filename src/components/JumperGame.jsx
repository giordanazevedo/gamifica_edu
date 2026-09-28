import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function JumperGame({ onWin, onClose }) {
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const dinoRef = useRef(null);
  const cactusRef = useRef(null);
  const gameAreaRef = useRef(null);

  // Inicia o jogo
  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false);
    setScore(0);
  };

  // Lógica de pulo
  const jump = useCallback(() => {
    if (!gameStarted || isGameOver || isJumping) return;
    setIsJumping(true);
    // Tempo da animação de pulo é 500ms
    setTimeout(() => {
      setIsJumping(false);
    }, 500);
  }, [gameStarted, isGameOver, isJumping]);

  // Detector de colisão e pontuação
  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    let checkCollision = setInterval(() => {
      const dino = dinoRef.current;
      const cactus = cactusRef.current;

      if (dino && cactus) {
        const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('top'));
        const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));

        // Se o obstáculo estiver colidindo no eixo X (entre 0 e 40px)
        // E o Dino estiver no chão (top > 100) -> COLISÃO!
        // No CSS: dino fica no topo 150px normalmente. Se pular, ele vai pra cima.
        if (cactusLeft > 0 && cactusLeft < 50 && dinoTop >= 100) {
          setIsGameOver(true);
        }
      }
    }, 20);

    return () => clearInterval(checkCollision);
  }, [gameStarted, isGameOver]);

  // Aumentar score a cada segundo sobrevivendo
  useEffect(() => {
    if (!gameStarted || isGameOver) return;
    const timer = setInterval(() => {
      setScore(s => s + 10);
    }, 500); // 10 XP a cada meio segundo
    return () => clearInterval(timer);
  }, [gameStarted, isGameOver]);

  // Escutar espaço na tela para pular
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameStarted]);

  return (
    <div className="jumper-overlay" onClick={jump}>
      <div className="jumper-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="jumper-header">
          <h2>🏃 Corrida XP</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="jumper-instructions text-center" style={{marginBottom: '1rem'}}>
          <p>Pressione a <strong>Barra de Espaço</strong> ou <strong>Clique na tela</strong> para pular os obstáculos!</p>
          <h3 className="text-gradient">Score: {score} XP</h3>
        </div>

        <div className="game-area" ref={gameAreaRef} onClick={!gameStarted ? startGame : jump}>
          {!gameStarted && !isGameOver && (
            <div className="start-prompt">
              Clique para Começar
            </div>
          )}

          {isGameOver && (
            <div className="game-over-screen">
              <h2>Fim de Jogo!</h2>
              <p>Você sobreviveu e ganhou <strong>{score} XP</strong>!</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  onWin(score);
                  onClose();
                }}
              >
                Resgatar XP
              </button>
              <button 
                className="btn-primary" 
                onClick={startGame}
                style={{marginTop: '10px', background: 'var(--border-light)', color: 'var(--text-main)'}}
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Cacto / Obstáculo */}
          <div 
            id="cactus" 
            ref={cactusRef} 
            className={`cactus ${gameStarted && !isGameOver ? 'moving' : ''}`}
          >
            🌵
          </div>

          {/* Jogador */}
          <div 
            id="dino" 
            ref={dinoRef} 
            className={`dino ${isJumping ? 'jump-anim' : ''} ${isGameOver ? 'dead' : ''}`}
          >
            👦🏽
          </div>
          
          <div className="ground-line"></div>
        </div>
      </div>

      <style>{`
        .jumper-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .jumper-modal {
          background: white;
          padding: 2rem;
          width: 95%;
          max-width: 600px;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          border: 4px solid var(--primary);
        }

        .jumper-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .jumper-header h2 { color: var(--primary); margin: 0; }

        .close-btn {
          background: var(--danger-light);
          color: var(--danger);
          border: none;
          width: 35px; height: 35px;
          border-radius: 50%;
          font-weight: bold;
          cursor: pointer;
        }

        .game-area {
          position: relative;
          width: 100%;
          height: 250px;
          background: linear-gradient(to bottom, #bae6fd 0%, #e0f2fe 100%);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          border: 2px solid var(--border-light);
        }

        .ground-line {
          position: absolute;
          bottom: 20px;
          width: 100%;
          height: 5px;
          background: var(--text-main);
        }

        .start-prompt {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--primary);
          animation: pulse 1.5s infinite;
          z-index: 10;
        }

        .game-over-screen {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }
        
        .game-over-screen h2 { color: var(--danger); font-size: 2.5rem; margin: 0; }

        /* O personagem (Dino) */
        .dino {
          position: absolute;
          top: 150px; /* Base próxima ao chão */
          left: 40px;
          font-size: 4rem;
          z-index: 5;
        }

        .dino.dead {
          filter: grayscale(100%);
          transform: rotate(90deg);
        }

        .jump-anim {
          animation: jump 0.5s linear;
        }

        @keyframes jump {
          0% { top: 150px; }
          40% { top: 50px; }
          50% { top: 40px; }
          60% { top: 50px; }
          100% { top: 150px; }
        }

        /* O obstáculo (Cacto) */
        .cactus {
          position: absolute;
          top: 160px;
          left: 600px; /* Fora da tela à direita */
          font-size: 3.5rem;
          z-index: 4;
        }

        .cactus.moving {
          animation: moveBlock 1.5s infinite linear;
        }

        @keyframes moveBlock {
          0% { left: 600px; }
          100% { left: -50px; }
        }

        @media (max-width: 600px) {
          @keyframes moveBlock {
            0% { left: 400px; }
            100% { left: -50px; }
          }
        }
      `}</style>
    </div>
  );
}
