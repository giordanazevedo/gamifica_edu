import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'historia', name: 'Figura Histórica' },
  { id: 'geografia', name: 'País ou Capital' },
  { id: 'ciencias', name: 'Elemento Químico' },
  { id: 'biologia', name: 'Parte do Corpo Humano' },
  { id: 'geral', name: 'Conceito Matemático/Físico' }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVZ'.split('');

export default function StopGame({ onComplete, onExit }) {
  const [letter, setLetter] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleStop();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setLetter(randomLetter);
    setAnswers({});
    setTimeLeft(60);
    setIsPlaying(true);
    setIsFinished(false);
    setScore(0);
  };

  const handleInputChange = (categoryId, value) => {
    setAnswers(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsFinished(true);
    
    // Validação simples: palavra deve começar com a letra sorteada
    let currentScore = 0;
    CATEGORIES.forEach(cat => {
      const answer = (answers[cat.id] || '').trim().toUpperCase();
      if (answer && answer.startsWith(letter)) {
        currentScore += 10;
      }
    });
    setScore(currentScore);
  };

  const handleClaimReward = () => {
    onComplete(score, score === 0);
  };

  return (
    <div className="stop-game-container animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius-lg)' }}>
      
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Stop Educativo 🛑</h2>
        <button onClick={onExit} className="btn" style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 20px', borderRadius: 'var(--radius-full)', fontWeight: '800' }}>
          Sair
        </button>
      </div>

      {!isPlaying && !isFinished ? (
        <div className="intro-screen text-center" style={{ padding: '3rem 0' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⏱️</div>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Como jogar:</h3>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Uma letra aleatória será sorteada. Você terá 60 segundos para preencher categorias de conhecimentos do 9º ano que comecem com essa letra. Cada acerto vale 10 XP!
          </p>
          <button onClick={startGame} className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '15px 40px' }}>
            Sortear Letra e Começar!
          </button>
        </div>
      ) : null}

      {isPlaying ? (
        <div className="playing-screen">
          <div className="game-status" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-light)', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
              Letra Sorteada: <span style={{ fontSize: '2.5rem', background: 'white', padding: '5px 15px', borderRadius: 'var(--radius-sm)', marginLeft: '10px', display: 'inline-block', minWidth: '60px', textAlign: 'center' }}>{letter}</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: timeLeft <= 10 ? 'var(--danger)' : 'var(--primary)' }}>
              ⏳ {timeLeft}s
            </div>
          </div>

          <div className="categories-grid" style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="category-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>{cat.name}</label>
                <input
                  type="text"
                  value={answers[cat.id] || ''}
                  onChange={(e) => handleInputChange(cat.id, e.target.value)}
                  placeholder={`Palavra com ${letter}...`}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-light)',
                    fontSize: '1.2rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
              </div>
            ))}
          </div>

          <button onClick={handleStop} className="btn" style={{ width: '100%', background: 'var(--danger)', color: 'white', fontSize: '1.5rem', padding: '15px', fontWeight: '900' }}>
            STOP! ✋
          </button>
        </div>
      ) : null}

      {isFinished ? (
        <div className="results-screen text-center" style={{ padding: '2rem 0' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{score > 0 ? '🎉' : '😢'}</div>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Fim de Jogo!</h3>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Letra da rodada: <strong>{letter}</strong>
          </p>
          
          <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Seus resultados:</h4>
            {CATEGORIES.map(cat => {
              const answer = (answers[cat.id] || '').trim();
              const isCorrect = answer.toUpperCase().startsWith(letter);
              return (
                <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: '800' }}>{cat.name}:</span>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: isCorrect && answer ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {answer || '(em branco)'}
                    </span>
                    {answer && (
                      <span style={{ fontSize: '1.2rem' }}>
                        {isCorrect ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--warning)', marginBottom: '2rem' }}>
            Você ganhou +{score} XP! ⭐
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={startGame} className="btn" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '10px 20px', fontWeight: '800' }}>
              Jogar Novamente
            </button>
            <button onClick={handleClaimReward} className="btn btn-primary" style={{ padding: '10px 30px', fontSize: '1.2rem' }}>
              Coletar Recompensa
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
