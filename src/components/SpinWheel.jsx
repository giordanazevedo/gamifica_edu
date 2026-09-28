import React, { useState } from 'react';

const PRIZES = [
  { id: 0, label: '+500 XP', color: '#8B5CF6', type: 'xp', value: 500 },
  { id: 1, label: '+1 Vida', color: '#EC4899', type: 'life', value: 1 },
  { id: 2, label: '+100 XP', color: '#10B981', type: 'xp', value: 100 },
  { id: 3, label: 'Quase!', color: '#94A3B8', type: 'none', value: 0 },
  { id: 4, label: '+1000 XP', color: '#F59E0B', type: 'xp', value: 1000 },
  { id: 5, label: '+2 Vidas', color: '#EF4444', type: 'life', value: 2 },
];

export default function SpinWheel({ onWin, onClose }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const spin = () => {
    if (spinning || result) return;
    
    setSpinning(true);
    // Calcular um vencedor aleatório
    const winIndex = Math.floor(Math.random() * PRIZES.length);
    
    // Cada fatia tem 360/6 = 60 graus
    const sliceAngle = 360 / PRIZES.length;
    
    // Gira no mínimo 5 voltas completas (5 * 360 = 1800)
    const extraSpins = 1800;
    
    // A rotação final deve parar no meio da fatia sorteada. 
    // Como o ponteiro está no topo (0 deg), precisamos compensar a rotação final.
    // Fórmula para parar no centro do alvo `winIndex`:
    const targetRotation = extraSpins + (360 - (winIndex * sliceAngle)) - (sliceAngle / 2);
    
    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(PRIZES[winIndex]);
    }, 4000); // Duração da animação do CSS
  };

  const handleClaim = () => {
    if (result && result.value > 0) {
      // Se for XP apenas repassa, se for vida converte para lógica de XP ou precisa de outro handler?
      // O App.js handleMinigameWin atualmente soma xp e 1 vida, então vou simplificar.
      // Vou passar um XP bônus dependendo do valor para simplificar a demo.
      let bonusXp = result.type === 'xp' ? result.value : result.value * 300;
      onWin(bonusXp);
    } else {
      onClose(); // Ganhou nada
    }
  };

  return (
    <div className="wheel-overlay">
      <div className="wheel-modal glass-card text-center">
        <div className="wheel-header">
          <h2>🎡 Roleta da Sorte Diária</h2>
          <button onClick={onClose} className="close-btn" disabled={spinning}>✕</button>
        </div>

        {!result ? (
          <div className="wheel-container">
            <div className="pointer">▼</div>
            <div 
              className="wheel" 
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {PRIZES.map((prize, i) => {
                const angle = (360 / PRIZES.length) * i;
                return (
                  <div 
                    key={prize.id} 
                    className="wheel-slice"
                    style={{
                      transform: `rotate(${angle}deg) skewY(-30deg)`,
                      backgroundColor: prize.color
                    }}
                  >
                    <span className="slice-label">{prize.label}</span>
                  </div>
                );
              })}
            </div>

            <button 
              className="btn-primary spin-btn" 
              onClick={spin}
              disabled={spinning}
            >
              {spinning ? 'Girando...' : 'GIRAR AGORA'}
            </button>
          </div>
        ) : (
          <div className="result-screen">
            <div className="result-icon" style={{fontSize: '5rem'}}>
              {result.type === 'none' ? '😢' : '🎁'}
            </div>
            <h3 className="text-gradient" style={{fontSize: '2rem'}}>
              {result.type === 'none' ? 'Que pena!' : 'Parabéns!'}
            </h3>
            <p style={{fontSize: '1.2rem', margin: '1rem 0'}}>
              Você tirou: <strong>{result.label}</strong>
            </p>
            <button className="btn-primary" onClick={handleClaim}>
              {result.type === 'none' ? 'Tentar amanhã' : 'Resgatar Prêmio'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .wheel-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .wheel-modal {
          background: white;
          padding: 2.5rem;
          width: 90%;
          max-width: 450px;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
          border: 5px solid var(--warning);
        }

        .wheel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .wheel-header h2 { color: var(--warning); margin: 0; }

        .close-btn {
          background: var(--danger-light);
          color: var(--danger);
          border: none;
          width: 35px; height: 35px;
          border-radius: 50%;
          font-weight: bold;
          cursor: pointer;
        }
        .close-btn:disabled { opacity: 0.5; }

        .wheel-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pointer {
          position: absolute;
          top: -20px;
          font-size: 3rem;
          color: var(--danger);
          z-index: 10;
          filter: drop-shadow(0 4px 4px rgba(0,0,0,0.4));
        }

        .wheel {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 8px solid white;
          box-shadow: 0 0 0 5px var(--warning), 0 10px 20px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
          transition: transform 4s cubic-bezier(0.15, 0.9, 0.25, 1);
        }

        .wheel-slice {
          position: absolute;
          top: 0; right: 0;
          width: 50%; height: 50%;
          transform-origin: 0% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slice-label {
          position: absolute;
          transform: skewY(30deg) rotate(30deg) translate(-20px, -50px);
          color: white;
          font-weight: 900;
          font-size: 1.1rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          white-space: nowrap;
        }

        .spin-btn {
          margin-top: 2rem;
          font-size: 1.2rem;
          padding: 1rem 3rem;
          background: linear-gradient(135deg, var(--warning), var(--danger));
          border: 3px solid white;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: transform 0.2s;
        }
        .spin-btn:not(:disabled):hover {
          transform: scale(1.1);
        }

        .result-screen {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
