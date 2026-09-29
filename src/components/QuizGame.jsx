import React, { useState } from 'react';
import { mockQuestions } from '../data/questions';

export default function QuizGame({ subject, grade, topic, onComplete, onExit }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phaseScore, setPhaseScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showIntermission, setShowIntermission] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Buscar questões
  const fallbackQuestions = [
    { type: "multiple", question: `Pergunta genérica sobre ${topic.title}`, options: ["A", "B", "C", "D"], correct: 0 }
  ];

  let baseQuestions = mockQuestions[subject.id]?.[grade]?.[topic.id] || fallbackQuestions;
  
  // Gera um simulado de 30 questões (repetindo/criando genéricas se necessário)
  let allQuestions = [...baseQuestions];
  while (allQuestions.length < 30) {
    allQuestions.push({
      id: `sim-${allQuestions.length}`,
      question: `[Simulado] Questão de fixação nº ${allQuestions.length + 1} sobre o conteúdo de ${topic.title}.`,
      options: ["Alternativa Correta", "Alternativa Incorreta", "Outro Distrator", "Mais um erro"],
      correct: 0
    });
  }
    
  const questions = allQuestions.slice((currentPhase - 1) * 10, currentPhase * 10);
  const currentQuestion = questions[currentQuestionIdx];

  const handleAnswer = (index) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerChecked(true);
    if (selectedAnswer === currentQuestion.correct) {
      setScore(score + 100);
      setPhaseScore(phaseScore + 100);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      if (currentPhase < 3) {
        setShowIntermission(true);
      } else {
        setShowResult(true);
      }
    }
  };

  const advancePhase = () => {
    setCurrentPhase(currentPhase + 1);
    setCurrentQuestionIdx(0);
    setPhaseScore(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setShowIntermission(false);
  };

  if (showIntermission) {
    const acertos = phaseScore / 100;
    return (
      <div className="quiz-result-card glass-card animate-float" style={{ animationDuration: '4s' }}>
        <div className="trophy-icon">⭐</div>
        <h2>Fase {currentPhase} Concluída!</h2>
        <p>Você acertou {acertos} de 10 questões nesta etapa.</p>
        
        <div className="score-display">
          <span className="xp-text">+{phaseScore} XP</span>
        </div>
        
        <p>Prepare-se para as próximas questões!</p>
        
        <button className="btn btn-primary" onClick={advancePhase} style={{ marginTop: '1rem', padding: '1rem 3rem' }}>
          Avançar para Fase {currentPhase + 1} ➔
        </button>
        <style>{`
          .quiz-result-card {
            max-width: 600px;
            margin: 4rem auto;
            padding: 4rem 2rem;
            text-align: center;
            background: white;
            border-top: 8px solid var(--primary);
          }
          .trophy-icon { font-size: 5.5rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite; }
          .quiz-result-card h2 { font-size: 2.5rem; color: var(--text-main); margin-bottom: 0.5rem; }
          .score-display { background: var(--warning-light); display: inline-block; padding: 1rem 3rem; border-radius: var(--radius-full); margin: 0.5rem 0 2rem; border: 2px solid rgba(245, 158, 11, 0.2); box-shadow: var(--shadow-md); }
          .xp-text { font-size: 2rem; font-weight: 900; color: var(--warning); }
          .quiz-result-card p { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 1rem; }
        `}</style>
      </div>
    );
  }

  if (showResult) {
    const acertos = score / 100;
    const nota = ((acertos / 30) * 10).toFixed(1);
    const isApproved = acertos >= 15; // Passa se acertar metade
    
    return (
      <div className="quiz-result-card glass-card animate-float" style={{ animationDuration: '4s' }}>
        <div className="trophy-icon">{isApproved ? '🎓' : '📚'}</div>
        <h2>{isApproved ? 'Simulado Concluído!' : 'Fim do Simulado!'}</h2>
        
        <div className="exam-stats" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
          <div className="stat-box">
            <span className="stat-label">Acertos</span>
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{acertos}/30</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Nota Final</span>
            <span className="stat-value" style={{ color: isApproved ? 'var(--success)' : 'var(--danger)' }}>{nota}</span>
          </div>
        </div>

        <div className="score-display">
          <span className="xp-text">+{score} XP</span>
        </div>
        
        <p>{isApproved ? 'Excelente! Você dominou essa fase.' : 'Você precisa revisar este conteúdo. Não desista!'}</p>
        
        <button className="btn btn-primary" onClick={() => onComplete(score, !isApproved)} style={{ marginTop: '1rem', padding: '1rem 3rem' }}>
          Finalizar Fase
        </button>
        
        <style>{`
          .quiz-result-card {
            max-width: 600px;
            margin: 4rem auto;
            padding: 4rem 2rem;
            text-align: center;
            background: white;
            border-top: 8px solid ${isApproved ? 'var(--success)' : 'var(--danger)'};
          }
          .stat-box {
            background: var(--background);
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-light);
            display: flex;
            flex-direction: column;
          }
          .stat-label { font-weight: 700; color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
          .stat-value { font-size: 2.5rem; font-weight: 900; }
          .trophy-icon {
            font-size: 5.5rem;
            margin-bottom: 1rem;
            animation: float 3s ease-in-out infinite;
          }
          .quiz-result-card h2 {
            font-size: 2.5rem;
            color: var(--text-main);
            margin-bottom: 0.5rem;
          }
          .score-display {
            background: var(--warning-light);
            display: inline-block;
            padding: 1rem 3rem;
            border-radius: var(--radius-full);
            margin: 0.5rem 0 2rem;
            border: 2px solid rgba(245, 158, 11, 0.2);
            box-shadow: var(--shadow-md);
          }
          .xp-text {
            font-size: 2rem;
            font-weight: 900;
            color: var(--warning);
          }
          .quiz-result-card p {
            font-size: 1.2rem;
            color: var(--text-muted);
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  const progress = ((currentPhase - 1) * 33) + ((currentQuestionIdx / questions.length) * 33);

  // Renderiza opções dinamicamente (suporta Verdadeiro/Falso ou Múltipla Escolha)
  const isTrueFalse = currentQuestion.type === "boolean" || currentQuestion.options.length === 2;

  return (
    <div className="quiz-container">
      <div className="quiz-header glass">
        <div className="subject-info">
          <span className="badge-grade">{grade}º Ano</span>
          <span className="badge-topic">{topic.title} (Fase {currentPhase}/3)</span>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%`, background: subject.color }}></div>
          </div>
        </div>
        <div className="score-badge">⭐ {score}</div>
      </div>

      <div className="question-card glass-card">
        <span className="question-count" style={{ color: subject.color }}>
          Desafio {currentQuestionIdx + 1}/{questions.length}
        </span>
        <h2 className="question-text">{currentQuestion.question}</h2>
      </div>

      <div className={`options-grid ${isTrueFalse ? 'grid-2' : 'grid-1'}`}>
        {currentQuestion.options.map((option, index) => {
          let className = "option-card glass-card";
          if (isAnswerChecked) {
            if (index === currentQuestion.correct) className += " correct";
            else if (index === selectedAnswer) className += " incorrect";
          } else if (index === selectedAnswer) {
            className += " selected";
          }

          return (
            <button 
              key={index} 
              className={className}
              onClick={() => handleAnswer(index)}
              disabled={isAnswerChecked}
              style={isTrueFalse ? { justifyContent: 'center', textAlign: 'center', flexDirection: 'column' } : {}}
            >
              {!isTrueFalse && <div className="option-letter">{String.fromCharCode(65 + index)}</div>}
              <div className="option-text" style={isTrueFalse ? { fontSize: '1.5rem', margin: '0.5rem 0' } : {}}>
                {option}
              </div>
              <div className="option-indicator" style={isTrueFalse ? { position: 'absolute', top: '10px', right: '10px' } : {}}>
                {isAnswerChecked && index === currentQuestion.correct && "✓"}
                {isAnswerChecked && index === selectedAnswer && index !== currentQuestion.correct && "✕"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="action-section">
        {!isAnswerChecked ? (
          <button 
            className="btn btn-primary" 
            onClick={checkAnswer}
            disabled={selectedAnswer === null}
            style={{ width: '100%', maxWidth: '400px', padding: '1.2rem', fontSize: '1.2rem', opacity: selectedAnswer === null ? 0.6 : 1, background: subject.color, boxShadow: `0 8px 20px -5px ${subject.color}80` }}
          >
            Confirmar Resposta
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={nextQuestion}
            style={{ width: '100%', maxWidth: '400px', padding: '1.2rem', fontSize: '1.2rem', background: 'var(--success)', boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)' }}
          >
            {currentQuestionIdx < questions.length - 1 ? 'Próximo Desafio ➔' : 'Ver Resultados 🏆'}
          </button>
        )}
      </div>

      <style>{`
        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .quiz-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-full);
        }

        .btn-exit {
          background: var(--danger-light);
          color: var(--danger);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .btn-exit:hover {
          background: var(--danger);
          color: white;
          transform: scale(1.1);
        }
        
        .subject-info {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .badge-grade {
          background: var(--primary-light);
          color: white;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.85rem;
        }
        
        .badge-topic {
          font-weight: 700;
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .progress-bar-wrapper {
          flex: 1;
        }

        .progress-bar-track {
          height: 16px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: var(--radius-full);
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .score-badge {
          background: var(--warning-light);
          color: var(--warning);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 900;
          font-size: 1.2rem;
        }

        .question-card {
          padding: 3rem 2rem;
          text-align: center;
          margin-bottom: 2.5rem;
          background: white;
          border-bottom: 6px solid var(--primary-light);
        }

        .question-count {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          display: block;
        }

        .question-text {
          font-size: 2.2rem;
          color: var(--text-main);
          line-height: 1.3;
        }

        .options-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .grid-1 {
          grid-template-columns: 1fr;
        }

        .grid-2 {
          grid-template-columns: 1fr 1fr;
        }

        .option-card {
          width: 100%;
          padding: 1.2rem 1.5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.2s;
          background: white;
          border: 2px solid var(--border-light);
          text-align: left;
          position: relative;
        }

        .option-card:hover:not(:disabled) {
          border-color: var(--primary-light);
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .option-card.selected {
          border-color: var(--primary);
          background: #F5F3FF;
          transform: scale(1.01);
        }

        .option-card.correct {
          border-color: var(--success);
          background: var(--success-light);
          color: #065F46;
        }

        .option-card.incorrect {
          border-color: var(--danger);
          background: var(--danger-light);
          color: #991B1B;
          opacity: 0.8;
        }

        .option-letter {
          width: 44px;
          height: 44px;
          background: var(--background);
          color: var(--text-muted);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.2rem;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .option-card.selected .option-letter {
          background: var(--primary);
          color: white;
        }

        .option-card.correct .option-letter {
          background: var(--success);
          color: white;
        }

        .option-card.incorrect .option-letter {
          background: var(--danger);
          color: white;
        }

        .option-text {
          font-size: 1.2rem;
          font-weight: 700;
          flex: 1;
        }

        .option-indicator {
          font-size: 1.5rem;
          font-weight: 900;
        }
        .option-card.correct .option-indicator { color: var(--success); }
        .option-card.incorrect .option-indicator { color: var(--danger); }

        .action-section {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
