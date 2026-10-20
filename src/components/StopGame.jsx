import React, { useState, useEffect, useRef } from 'react';
import OnlineStopGame from './OnlineStopGame';
import { 
  X, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Landmark, 
  Globe, 
  Play, 
  Zap, 
  Award 
} from 'lucide-react';

// Categorias voltadas para o currículo e conhecimentos gerais do 9º Ano
const CATEGORIES = [
  { 
    id: 'portugues', 
    name: 'Língua Portuguesa', 
    tip: 'Palavra, verbo, gênero ou figura de linguagem',
    icon: <BookOpen size={18} color="#9D74FF" />,
    color: '#9D74FF'
  },
  { 
    id: 'matematica', 
    name: 'Matemática & Física', 
    tip: 'Conceito, termo geométrico, fórmula ou unidade',
    icon: <Calculator size={18} color="#4FB0FF" />,
    color: '#4FB0FF'
  },
  { 
    id: 'ciencias', 
    name: 'Ciências & Biologia', 
    tip: 'Elemento químico, célula, órgão ou ser vivo',
    icon: <FlaskConical size={18} color="#10B981" />,
    color: '#10B981'
  },
  { 
    id: 'historia', 
    name: 'História & Sociedade', 
    tip: 'Personalidade histórica, evento, povo ou era',
    icon: <Landmark size={18} color="#F59E0B" />,
    color: '#F59E0B'
  },
  { 
    id: 'geografia', 
    name: 'Geografia', 
    tip: 'País, capital, estado, cidade ou relevo',
    icon: <Globe size={18} color="#06B6D4" />,
    color: '#06B6D4'
  }
];

// Letras amigáveis que possuem ricas palavras educativas (remove K, W, Y, X, Z para não travar o aluno)
const PLAYABLE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];

export default function StopGame({ onComplete, onExit, profile }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'roulette' | 'playing' | 'results'
  const [letter, setLetter] = useState('A');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [resultsDetails, setResultsDetails] = useState([]);

  // Animação da Roleta
  const [displayLetter, setDisplayLetter] = useState('?');
  const [isSpinning, setIsSpinning] = useState(false);

  const timerRef = useRef(null);

  // Inicia o sorteio com efeito de roleta
  const startRoulette = () => {
    setPhase('roulette');
    setIsSpinning(true);
    setAnswers({});
    setTimeLeft(60);
    setScore(0);

    let count = 0;
    const maxSpins = 20;
    const spinInterval = setInterval(() => {
      const tempLetter = PLAYABLE_LETTERS[Math.floor(Math.random() * PLAYABLE_LETTERS.length)];
      setDisplayLetter(tempLetter);
      count++;

      if (count >= maxSpins) {
        clearInterval(spinInterval);
        const finalLetter = PLAYABLE_LETTERS[Math.floor(Math.random() * PLAYABLE_LETTERS.length)];
        setDisplayLetter(finalLetter);
        setLetter(finalLetter);
        setIsSpinning(false);

        // Aguarda 1s para o jogador ver a letra e entra no jogo
        setTimeout(() => {
          setPhase('playing');
        }, 1000);
      }
    }, 80);
  };

  // Cronômetro da partida
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleStop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleInputChange = (catId, val) => {
    setAnswers(prev => ({
      ...prev,
      [catId]: val
    }));
  };

  // Botão STOP pressionado ou tempo esgotado
  const handleStop = () => {
    clearInterval(timerRef.current);

    // Validação inteligente
    let totalScore = 0;
    const details = CATEGORIES.map(cat => {
      const rawAns = (answers[cat.id] || '').trim();
      const upper = rawAns.toUpperCase();

      // Validação: precisa começar com a letra e ter pelo menos 2 caracteres
      const startsWithLetter = upper.startsWith(letter);
      const hasLength = rawAns.length >= 2;
      const isValid = startsWithLetter && hasLength;

      const pts = isValid ? 20 : 0;
      totalScore += pts;

      return {
        cat,
        answer: rawAns,
        isValid,
        points: pts
      };
    });

    // Bônus se preencheu todas válidas (+20 bônus = 120 XP!)
    const allValid = details.every(d => d.isValid);
    if (allValid) {
      totalScore += 20;
    }

    setScore(totalScore);
    setResultsDetails(details);
    setPhase('results');
  };

  const handleCollectReward = () => {
    if (onComplete) {
      onComplete(score);
    }
  };

  if (phase === 'online') {
    return <OnlineStopGame profile={profile} onExit={() => setPhase('intro')} />;
  }

  return (
    <div className="stop-modal-card">
      {/* HEADER */}
      <div className="stop-header">
        <div className="stop-title-group">
          <span className="stop-badge">MINIGAME 9º ANO</span>
          <h2>🛑 Adedonha / Stop Educativo</h2>
        </div>
        <button className="stop-close-btn" onClick={onExit} title="Fechar">
          <X size={22} />
        </button>
      </div>

      {/* TELA 1: INTRODUÇÃO */}
      {phase === 'intro' && (
        <div className="stop-screen intro-screen">
          <div className="stop-hero-icon">
            <span className="spinning-letter">🎯</span>
          </div>
          <h3>Desafie seu Vocabulário Escolar!</h3>
          <p>
            Uma letra surpresa será sorteada. Você terá <strong>60 segundos</strong> para preencher as 5 categorias com palavras do 9º Ano que comecem com a letra.
          </p>

          <div className="rules-chip-list">
            <span className="chip">✨ +20 XP por categoria certa</span>
            <span className="chip">⚡ +20 XP bônus se acertar todas!</span>
            <span className="chip">⏱️ 60 segundos no relógio</span>
          </div>

          <button className="stop-primary-btn" onClick={startRoulette}>
            <Play size={20} fill="white" />
            <span>Jogar sozinho</span>
          </button>
          <button className="stop-online-btn" onClick={() => setPhase('online')}>
            <span>👥</span>
            <span>Duelo online em grupo</span>
          </button>
        </div>
      )}

      {/* TELA 2: ROLETA DA LETRA */}
      {phase === 'roulette' && (
        <div className="stop-screen roulette-screen">
          <h3>Sorteando a Letra da Rodada...</h3>
          <div className={`roulette-display ${isSpinning ? 'spinning' : 'settled'}`}>
            <span>{displayLetter}</span>
          </div>
          <p className="roulette-tip">Prepare os dedos! O cronômetro começará em instantes!</p>
        </div>
      )}

      {/* TELA 3: JOGANDO */}
      {phase === 'playing' && (
        <div className="stop-screen playing-screen">
          {/* BARRA SUPERIOR DE STATUS */}
          <div className="game-hud">
            <div className="hud-letter-badge">
              <span className="hud-letter-label">LETRA:</span>
              <strong className="hud-letter-char">{letter}</strong>
            </div>

            <div className={`hud-timer ${timeLeft <= 15 ? 'timer-urgent' : ''}`}>
              <Clock size={18} />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* CAMPOS DAS CATEGORIAS */}
          <div className="categories-list">
            {CATEGORIES.map(cat => {
              const currentVal = answers[cat.id] || '';
              const upper = currentVal.trim().toUpperCase();
              const isMatch = upper.startsWith(letter);

              return (
                <div key={cat.id} className="category-row">
                  <div className="cat-label-row">
                    <span className="cat-icon">{cat.icon}</span>
                    <strong className="cat-name">{cat.name}</strong>
                    <span className="cat-tip">({cat.tip})</span>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      className={`cat-input ${currentVal && isMatch ? 'valid-input' : currentVal && !isMatch ? 'invalid-input' : ''}`}
                      placeholder={`Palavra com a letra ${letter}...`}
                      value={currentVal}
                      onChange={(e) => handleInputChange(cat.id, e.target.value)}
                      autoComplete="off"
                    />
                    {currentVal && (
                      <span className="inline-check">
                        {isMatch ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÃO STOP! */}
          <button className="stop-action-btn" onClick={handleStop}>
            <span className="hand-icon">✋</span>
            <span>STOP! (BATER RODADA)</span>
          </button>
        </div>
      )}

      {/* TELA 4: RESULTADOS */}
      {phase === 'results' && (
        <div className="stop-screen results-screen">
          <div className="results-trophy">
            <Trophy size={56} color="#f59e0b" />
          </div>

          <h3>Rodada Encerrada!</h3>
          <p className="results-letter-info">
            Letra sorteada: <span className="highlight-letter">{letter}</span>
          </p>

          {/* DETALHAMENTO DAS RESPOSTAS */}
          <div className="results-table">
            {resultsDetails.map(({ cat, answer, isValid, points }) => (
              <div key={cat.id} className={`result-row ${isValid ? 'valid' : 'invalid'}`}>
                <div className="res-left">
                  <span className="res-cat">{cat.name}</span>
                  <strong className="res-answer">{answer || '— (em branco)'}</strong>
                </div>
                <div className="res-right">
                  <span className="res-pts">+{points} XP</span>
                  <span className="res-icon">{isValid ? '✅' : '❌'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* XP TOTAL CONQUISTADO */}
          <div className="total-xp-banner">
            <Zap size={24} color="#eab308" fill="#eab308" />
            <span>Total Ganho: +{score} XP!</span>
          </div>

          {/* AÇÕES FINAIS */}
          <div className="results-actions">
            <button className="btn-replay" onClick={startRoulette}>
              <RotateCcw size={18} />
              <span>Jogar Outra Letra</span>
            </button>
            <button className="btn-collect" onClick={handleCollectReward}>
              <Award size={20} />
              <span>Coletar Recompensa</span>
            </button>
          </div>
        </div>
      )}

      {/* ESTILOS MODERNOS DO STOP */}
      <style>{`
        .stop-modal-card {
          background: #ffffff;
          width: 95%;
          max-width: 480px;
          border-radius: 28px;
          padding: 22px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
          border: 2px solid rgba(157, 116, 255, 0.25);
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: popModal 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popModal {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        /* HEADER */
        .stop-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .stop-title-group h2 {
          font-size: 1.25rem;
          font-weight: 900;
          color: #1e293b;
          margin-top: 2px;
        }

        .stop-badge {
          background: #fef2f2;
          color: #ef4444;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 8px;
          text-transform: uppercase;
        }

        .stop-close-btn {
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stop-close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        /* TELAS GERAIS */
        .stop-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
        }

        /* INTRO SCREEN */
        .stop-hero-icon {
          font-size: 3.5rem;
          background: #fdf2f8;
          width: 85px;
          height: 85px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .intro-screen h3 {
          font-size: 1.25rem;
          font-weight: 900;
          color: #1e293b;
        }

        .intro-screen p {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.45;
        }

        .rules-chip-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .chip {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
        }

        .stop-primary-btn {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
          transition: transform 0.2s ease;
          margin-top: 6px;
        }

        .stop-primary-btn:hover {
          transform: translateY(-2px);
        }

        .stop-online-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px;
          margin-top: 2px;
          border: 2px solid #c4b5fd;
          border-radius: 16px;
          background: #f5f3ff;
          color: #6d28d9;
          font-size: 0.95rem;
          font-weight: 850;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .stop-online-btn:hover {
          transform: translateY(-2px);
          background: #ede9fe;
        }

        /* ROLETA DA LETRA */
        .roulette-screen {
          padding: 30px 0;
        }

        .roulette-display {
          width: 110px;
          height: 110px;
          border-radius: 24px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          color: #facc15;
          font-size: 4rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(49, 46, 129, 0.4);
          margin: 10px 0;
        }

        .roulette-display.spinning {
          animation: shakeRoulette 0.1s infinite;
        }

        @keyframes shakeRoulette {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.06) rotate(3deg); }
          100% { transform: scale(1) rotate(-3deg); }
        }

        .roulette-display.settled {
          animation: popFinal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: #ffffff;
        }

        @keyframes popFinal {
          0% { transform: scale(0.6); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        .roulette-tip {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        /* PLAYING SCREEN */
        .playing-screen {
          align-items: stretch;
          text-align: left;
          gap: 12px;
        }

        .game-hud {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 14px;
          border-radius: 16px;
        }

        .hud-letter-badge {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hud-letter-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
        }

        .hud-letter-char {
          font-size: 1.6rem;
          font-weight: 900;
          color: #7c3aed;
          background: #f3e8ff;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .hud-timer {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ede9fe;
          color: #7c3aed;
          padding: 6px 12px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 1rem;
        }

        .hud-timer.timer-urgent {
          background: #fee2e2;
          color: #ef4444;
          animation: pulseTimer 0.6s infinite alternate;
        }

        @keyframes pulseTimer {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .category-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cat-label-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
        }

        .cat-name {
          color: #1e293b;
        }

        .cat-tip {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .cat-input {
          width: 100%;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 36px 10px 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          outline: none;
          transition: all 0.2s ease;
        }

        .cat-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .cat-input.valid-input {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .cat-input.invalid-input {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .inline-check {
          position: absolute;
          right: 10px;
        }

        .stop-action-btn {
          width: 100%;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-size: 1.05rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
          animation: pulseStopBtn 1.5s infinite;
          margin-top: 4px;
        }

        @keyframes pulseStopBtn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .hand-icon {
          font-size: 1.4rem;
        }

        /* RESULTS SCREEN */
        .results-screen {
          gap: 12px;
        }

        .results-trophy {
          animation: bounceTrophy 1.5s ease-in-out infinite alternate;
        }

        @keyframes bounceTrophy {
          from { transform: translateY(-3px); }
          to { transform: translateY(3px); }
        }

        .results-screen h3 {
          font-size: 1.3rem;
          font-weight: 900;
          color: #1e293b;
        }

        .results-letter-info {
          font-size: 0.9rem;
          color: #64748b;
        }

        .highlight-letter {
          font-weight: 900;
          color: #7c3aed;
          background: #f3e8ff;
          padding: 2px 10px;
          border-radius: 8px;
          font-size: 1.1rem;
        }

        .results-table {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 6px 0;
        }

        .result-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          text-align: left;
        }

        .result-row.valid {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .result-row.invalid {
          background: #fef2f2;
          border-color: #fca5a5;
        }

        .res-left {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .res-cat {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }

        .res-answer {
          font-size: 0.88rem;
          color: #1e293b;
        }

        .res-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .res-pts {
          font-size: 0.85rem;
          font-weight: 800;
          color: #10b981;
        }

        .result-row.invalid .res-pts {
          color: #94a3b8;
        }

        .total-xp-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #fef3c7;
          color: #92400e;
          padding: 10px 18px;
          border-radius: 14px;
          font-weight: 900;
          font-size: 1.1rem;
          width: 100%;
        }

        .results-actions {
          display: flex;
          gap: 10px;
          width: 100%;
          margin-top: 6px;
        }

        .btn-replay {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 12px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .btn-collect {
          flex: 1.3;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.92rem;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
}
