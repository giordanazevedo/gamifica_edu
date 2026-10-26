import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Clock3, RotateCcw, Sparkles, Zap } from 'lucide-react';

const ROUND_LENGTH = 10;
const ROUND_TIME_SECONDS = 45;
const XP_PER_CORRECT_ANSWER = 10;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuestion() {
  const left = Math.floor(Math.random() * 11) + 2;
  const right = Math.floor(Math.random() * 11) + 2;
  const answer = left * right;
  const options = new Set([answer]);

  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 19) - 9;
    const distractor = answer + (offset === 0 ? 11 : offset);
    if (distractor >= 0) options.add(distractor);
  }

  const choices = shuffle([...options]);
  return {
    prompt: `${left} × ${right}`,
    answer,
    choices,
  };
}

export default function MultiplicationChallenge({ onComplete, onExit }) {
  const [gameStatus, setGameStatus] = useState('ready');
  const [question, setQuestion] = useState(createQuestion);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (gameStatus !== 'playing') return undefined;

    const timer = setInterval(() => {
      setTimeLeft((remaining) => {
        if (remaining <= 1) {
          clearInterval(timer);
          setGameStatus('finished');
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || gameStatus !== 'playing') return;
    setSelectedAnswer(answer);
    if (answer === question.answer) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const handleNext = () => {
    if (questionNumber >= ROUND_LENGTH) {
      setGameStatus('finished');
      return;
    }
    setQuestion(createQuestion());
    setQuestionNumber((currentNumber) => currentNumber + 1);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setGameStatus('ready');
    setQuestion(createQuestion());
    setQuestionNumber(1);
    setTimeLeft(ROUND_TIME_SECONDS);
    setScore(0);
    setSelectedAnswer(null);
  };

  const earnedXp = score * XP_PER_CORRECT_ANSWER;
  const progressPercent = (questionNumber / ROUND_LENGTH) * 100;

  return (
    <section className="multiplication-challenge">
      <button className="challenge-back-button" type="button" onClick={onExit}>
        <ArrowLeft size={18} />
        Voltar ao início
      </button>

      <div className="challenge-panel">
        <div className="challenge-heading">
          <span className="challenge-icon"><Zap size={28} fill="currentColor" /></span>
          <span className="challenge-eyebrow">DESAFIO RELÂMPAGO</span>
          <h1>Multiplicação Rápida</h1>
          <p>Resolva 10 contas antes que o tempo acabe e ganhe XP!</p>
        </div>

        {gameStatus === 'ready' ? (
          <div className="challenge-ready">
            <div className="challenge-ready-stats">
              <span><Clock3 size={18} /> 45 segundos</span>
              <span><Sparkles size={18} /> 10 XP por acerto</span>
            </div>
            <button
              className="challenge-primary-button"
              type="button"
              onClick={() => setGameStatus('playing')}
            >
              Começar desafio
              <Zap size={18} />
            </button>
          </div>
        ) : gameStatus === 'playing' ? (
          <div className="challenge-game">
            <div className="challenge-stats">
              <span className={`challenge-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
                <Clock3 size={17} /> 00:{String(timeLeft).padStart(2, '0')}
              </span>
              <span className="challenge-score"><Sparkles size={17} /> {score} acertos</span>
            </div>

            <div
              className="challenge-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={ROUND_LENGTH}
              aria-valuenow={questionNumber}
            >
              <span style={{ width: `${progressPercent}%` }} />
            </div>

            <span className="challenge-question-count">
              QUESTÃO {questionNumber} DE {ROUND_LENGTH}
            </span>
            <div className="challenge-equation" aria-live="polite">{question.prompt} = ?</div>

            <div className="challenge-answer-grid">
              {question.choices.map((choice) => {
                const isCorrect = choice === question.answer;
                const isSelected = choice === selectedAnswer;
                let stateClass = '';
                if (selectedAnswer !== null && isCorrect) stateClass = ' correct';
                else if (isSelected) stateClass = ' incorrect';
                else if (selectedAnswer !== null) stateClass = ' dimmed';

                return (
                  <button
                    key={choice}
                    className={`challenge-answer${stateClass}`}
                    type="button"
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(choice)}
                  >
                    {choice}
                    {isSelected && isCorrect && <Check size={19} />}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="challenge-answer-feedback">
                <span className={selectedAnswer === question.answer ? 'feedback-correct' : 'feedback-incorrect'}>
                  {selectedAnswer === question.answer ? 'Boa! Resposta certa.' : `Quase! A resposta é ${question.answer}.`}
                </span>
                <button className="challenge-primary-button" type="button" onClick={handleNext}>
                  {questionNumber === ROUND_LENGTH ? 'Ver resultado' : 'Próxima conta'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="challenge-result">
            <span className="challenge-result-icon">{score >= 7 ? '🏆' : '✨'}</span>
            <span className="challenge-eyebrow">DESAFIO CONCLUÍDO</span>
            <h2>{score >= 7 ? 'Mandou muito bem!' : 'Continue praticando!'}</h2>
            <p>
              Você acertou <strong>{score} de {ROUND_LENGTH}</strong>
              {timeLeft === 0 ? ' antes do tempo acabar.' : '.'}
            </p>
            <div className="challenge-xp-reward">+{earnedXp} XP</div>
            <button
              className="challenge-primary-button"
              type="button"
              onClick={() => onComplete(earnedXp)}
            >
              Resgatar XP
              <Sparkles size={18} />
            </button>
            <button className="challenge-restart-button" type="button" onClick={handleRestart}>
              <RotateCcw size={16} />
              Jogar novamente
            </button>
          </div>
        )}
      </div>

      <style>{`
        .multiplication-challenge {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
          padding: 4px 0 24px;
        }

        .challenge-back-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 14px;
          padding: 9px 12px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
        }

        .challenge-back-button:hover { background: #f1f5f9; color: #334155; }

        .challenge-panel {
          overflow: hidden;
          border: 1px solid #e9d5ff;
          border-radius: 28px;
          background: linear-gradient(160deg, #fff 0%, #faf5ff 100%);
          box-shadow: 0 18px 45px rgba(109, 40, 217, 0.12);
        }

        .challenge-heading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 28px 20px 20px;
          text-align: center;
          background: radial-gradient(circle at 50% 0%, rgba(196, 181, 253, 0.38), transparent 65%);
        }

        .challenge-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 18px;
          background: linear-gradient(145deg, #8b5cf6, #6d28d9);
          color: white;
          box-shadow: 0 8px 18px rgba(109, 40, 217, 0.24);
        }

        .challenge-eyebrow {
          color: #7c3aed;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .challenge-heading h1 {
          margin: 7px 0 5px;
          color: #172033;
          font-size: clamp(1.35rem, 5vw, 1.8rem);
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .challenge-heading p {
          margin: 0;
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.45;
        }

        .challenge-ready, .challenge-game, .challenge-result {
          padding: 20px clamp(18px, 5vw, 32px) 28px;
        }

        .challenge-ready-stats {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .challenge-ready-stats span, .challenge-timer, .challenge-score {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 999px;
          background: #f3e8ff;
          color: #6d28d9;
          font-size: 0.78rem;
          font-weight: 850;
        }

        .challenge-primary-button {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 22px;
          border: 0;
          border-radius: 15px;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          font-size: 0.9rem;
          font-weight: 900;
          box-shadow: 0 9px 20px rgba(109, 40, 217, 0.22);
          cursor: pointer;
        }

        .challenge-primary-button:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .challenge-ready > .challenge-primary-button, .challenge-result > .challenge-primary-button { width: 100%; }

        .challenge-stats { display: flex; justify-content: space-between; gap: 8px; }
        .challenge-timer { background: #f1f5f9; color: #334155; }
        .challenge-timer.urgent { background: #fee2e2; color: #b91c1c; }
        .challenge-score { background: #fef3c7; color: #a16207; }

        .challenge-progress-track {
          height: 8px;
          overflow: hidden;
          margin: 16px 0 22px;
          border-radius: 999px;
          background: #ede9fe;
        }

        .challenge-progress-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #a78bfa, #7c3aed);
          transition: width 0.25s ease;
        }

        .challenge-question-count {
          display: block;
          color: #8b5cf6;
          font-size: 0.67rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-align: center;
        }

        .challenge-equation {
          margin: 10px 0 20px;
          color: #172033;
          font-size: clamp(2.4rem, 12vw, 3.7rem);
          font-weight: 950;
          letter-spacing: -0.06em;
          text-align: center;
        }

        .challenge-answer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .challenge-answer {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          background: white;
          color: #334155;
          font-size: 1.15rem;
          font-weight: 900;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
        }

        .challenge-answer:not(:disabled):hover { border-color: #a78bfa; background: #faf5ff; transform: translateY(-2px); }
        .challenge-answer.correct { border-color: #34d399; background: #ecfdf5; color: #047857; }
        .challenge-answer.incorrect { border-color: #f87171; background: #fef2f2; color: #b91c1c; }
        .challenge-answer.dimmed { opacity: 0.55; }
        .challenge-answer:disabled { cursor: default; }

        .challenge-answer-feedback {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
        }

        .feedback-correct { color: #047857; font-weight: 850; }
        .feedback-incorrect { color: #b91c1c; font-weight: 850; }

        .challenge-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .challenge-result-icon { margin-bottom: 8px; font-size: 3.4rem; }
        .challenge-result h2 { margin: 7px 0; color: #172033; font-size: 1.5rem; font-weight: 950; }
        .challenge-result p { margin: 0 0 14px; color: #64748b; }
        .challenge-result p strong { color: #334155; }

        .challenge-xp-reward {
          margin-bottom: 16px;
          color: #6d28d9;
          font-size: 2rem;
          font-weight: 950;
        }

        .challenge-restart-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 12px;
          padding: 9px 12px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
        }

        .challenge-restart-button:hover { background: #f1f5f9; }

        @media (max-width: 380px) {
          .challenge-ready-stats { flex-direction: column; }
          .challenge-ready-stats span { width: 100%; }
          .challenge-answer { min-height: 52px; }
        }
      `}</style>
    </section>
  );
}
