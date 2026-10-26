import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createQuestionRound, getPreparedQuestions, recordQuestionAnswer } from '../data/questionBank';

const QUESTIONS_PER_PHASE = 15;

export default function QuizGame({ subject, grade, topic, initialDifficulty = 'misturado', onComplete, onExit }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [phaseScore, setPhaseScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showIntermission, setShowIntermission] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [completionError, setCompletionError] = useState('');
  const subjectId = subject?.id || subject?.name;
  const preparedQuestions = useMemo(
    () => getPreparedQuestions(subjectId, grade, topic.id),
    [subjectId, grade, topic.id]
  );
  const roundQuestions = useMemo(() => createQuestionRound({
    questions: preparedQuestions,
    subjectId,
    grade,
    topicId: topic.id,
    difficulty,
  }), [preparedQuestions, subjectId, grade, topic.id, difficulty]);
  const totalQuestions = roundQuestions.length;
  const isApproved = score / 100 >= Math.ceil(totalQuestions / 2);
  const phaseCount = Math.max(1, Math.ceil(totalQuestions / QUESTIONS_PER_PHASE));
  const questions = roundQuestions.slice(
    (currentPhase - 1) * QUESTIONS_PER_PHASE,
    currentPhase * QUESTIONS_PER_PHASE
  );
  const currentQuestion = questions[currentQuestionIdx];

  const handleFinish = async () => {
    if (isSavingResult) return;
    setIsSavingResult(true);
    setCompletionError('');
    try {
      await onComplete(score, !isApproved);
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
      if (error?.code === 'permission-denied') {
        setCompletionError('O Firebase recusou o salvamento dos pontos (permission-denied). As regras do Firestore precisam permitir que sua conta atualize o próprio perfil.');
      } else if (error?.code === 'unauthenticated') {
        setCompletionError('Sua sessão expirou. Entre novamente e tente finalizar a fase.');
      } else if (error?.code === 'unavailable' || error?.code === 'deadline-exceeded') {
        setCompletionError('O Firebase está indisponível no momento. Verifique sua conexão e tente salvar os pontos novamente.');
      } else {
        const detail = error?.code || error?.message || 'erro sem detalhes';
        setCompletionError(`Não foi possível salvar seus pontos (${detail}). Verifique sua conexão e tente novamente.`);
      }
    } finally {
      setIsSavingResult(false);
    }
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    setCurrentQuestionIdx(0);
    setScore(0);
    setPhaseScore(0);
    setCurrentPhase(1);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setShowIntermission(false);
    setShowResult(false);
    setWrongAnswers([]);
  };

  const handleAnswer = (index) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerChecked(true);
    const isWrong = selectedAnswer !== currentQuestion.correta;
    recordQuestionAnswer(currentQuestion.id, isWrong);
    if (!isWrong) {
      setScore(prev => prev + 100);
      setPhaseScore(prev => prev + 100);
    } else {
      setWrongAnswers(answers => [...answers, {
        question: currentQuestion,
        selected: currentQuestion.opcoes[selectedAnswer],
      }]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      if (currentPhase < phaseCount) {
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
        <p>Você acertou {acertos} de {questions.length} questões nesta etapa.</p>
        
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
    const nota = ((acertos / totalQuestions) * 10).toFixed(1);
    
    return (
      <div className="quiz-result-card glass-card animate-float" style={{ animationDuration: '4s' }}>
        <div className="trophy-icon">{isApproved ? '🎓' : '📚'}</div>
        <h2>{isApproved ? 'Simulado Concluído!' : 'Fim do Simulado!'}</h2>
        
        <div className="exam-stats" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
          <div className="stat-box">
            <span className="stat-label">Acertos</span>
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{acertos}/{totalQuestions}</span>
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
        {wrongAnswers.length > 0 && (
          <section className="wrong-review" aria-labelledby="wrong-review-title">
            <h3 id="wrong-review-title">Vamos revisar as questões que você errou</h3>
            {wrongAnswers.map(({ question, selected }, index) => (
              <article className="wrong-review-item" key={`${question.id}-${index}`}>
                <strong>{question.pergunta}</strong>
                <p className="wrong-answer">Sua resposta: {selected}</p>
                <p className="right-answer">Resposta correta: {question.opcoes[question.correta]}</p>
                <p>{question.explicacao}</p>
              </article>
            ))}
          </section>
        )}
        
        {completionError && <p role="alert" style={{ color: 'var(--danger)', fontWeight: 700 }}>{completionError}</p>}
        <button className="btn btn-primary" onClick={handleFinish} disabled={isSavingResult} style={{ marginTop: '1rem', padding: '1rem 3rem' }}>
          {isSavingResult ? <><Loader2 className="spin" size={18} /> Salvando pontos...</> : 'Finalizar Fase'}
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
          .wrong-review { margin: 2rem auto; text-align: left; max-width: 680px; }
          .wrong-review h3 { color: var(--text-main); margin-bottom: 1rem; }
          .wrong-review-item { margin: 0.75rem 0; padding: 1rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); background: var(--background); }
          .wrong-review-item strong { display: block; color: var(--text-main); }
          .wrong-review-item p { font-size: 1rem; margin: 0.5rem 0 0; }
          .wrong-review-item .wrong-answer { color: var(--danger); }
          .wrong-review-item .right-answer { color: var(--success); font-weight: 700; }
        `}</style>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-result-card glass-card">
        <div className="trophy-icon">{preparedQuestions.length ? '🏁' : '📚'}</div>
        <h2>{preparedQuestions.length ? 'Você concluiu este nível!' : 'Questões não encontradas'}</h2>
        <p>
          {preparedQuestions.length
            ? 'Você já respondeu todas as perguntas inéditas disponíveis nesta seleção. Elas não serão repetidas. Escolha outra dificuldade ou volte ao mapa.'
            : 'Este conteúdo ainda não tem perguntas preparadas no banco.'}
        </p>
        <label className="difficulty-filter" style={{ justifyContent: 'center', margin: '1.5rem auto' }}>
          <span>Nível das questões</span>
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="misturado">Misturado</option>
            <option value="fácil">Fácil</option>
            <option value="médio">Médio</option>
            <option value="difícil">Difícil</option>
          </select>
        </label>
        <button
          className="btn btn-primary"
          onClick={onExit}
          style={{ marginTop: '1rem', padding: '1rem 2rem' }}
        >
          Voltar às matérias
        </button>
      </div>
    );
  }

  const progress = (
    ((currentPhase - 1) * QUESTIONS_PER_PHASE + currentQuestionIdx + 1) /
    totalQuestions
  ) * 100;

  // Renderiza opções dinamicamente (suporta Verdadeiro/Falso ou Múltipla Escolha)
  const isTrueFalse = currentQuestion.type === "boolean" || currentQuestion.options.length === 2;
  const questionLength = currentQuestion.question.length;
  const questionSizeClass = questionLength > 220
    ? 'question-text-very-long'
    : questionLength > 120
      ? 'question-text-long'
      : '';

  return (
    <div className="quiz-container">
      <label className="difficulty-filter">
        <span>Nível das questões</span>
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="misturado">Misturado</option>
          <option value="fácil">Fácil</option>
          <option value="médio">Médio</option>
          <option value="difícil">Difícil</option>
        </select>
      </label>
      <div className="quiz-header glass">
        <div className="subject-info">
          <span className="badge-grade">{grade}º Ano</span>
          <span className="badge-topic">{topic.title} (Fase {currentPhase}/{phaseCount})</span>
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
        <h2 className={`question-text ${questionSizeClass}`}>{currentQuestion.pergunta}</h2>
      </div>

      <div className={`options-grid ${isTrueFalse ? 'grid-2' : 'grid-1'}`}>
        {currentQuestion.opcoes.map((option, index) => {
          let className = "option-card glass-card";
          if (isAnswerChecked) {
            if (index === currentQuestion.correta) className += " correct";
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
                {isAnswerChecked && index === currentQuestion.correta && "✓"}
                {isAnswerChecked && index === selectedAnswer && index !== currentQuestion.correta && "✕"}
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
        .difficulty-filter {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: var(--text-main);
          font-weight: 700;
        }
        .difficulty-filter select {
          padding: 0.65rem 0.9rem;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background: white;
          color: var(--text-main);
          font: inherit;
        }
        @media (max-width: 520px) {
          .difficulty-filter { justify-content: space-between; }
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
          font-size: clamp(1.35rem, 5vw, 2.2rem);
          color: var(--text-main);
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .question-text-long {
          font-size: clamp(1.2rem, 4.2vw, 1.7rem);
        }

        .question-text-very-long {
          font-size: clamp(1.05rem, 3.6vw, 1.4rem);
          line-height: 1.45;
        }

        @media (max-width: 600px) {
          .quiz-header {
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 1rem;
            padding: 0.8rem;
            border-radius: 18px;
          }

          .subject-info {
            min-width: 0;
            flex: 1 1 100%;
            flex-wrap: wrap;
          }

          .badge-topic {
            min-width: 0;
            overflow-wrap: anywhere;
          }

          .progress-bar-wrapper {
            min-width: 80px;
          }

          .score-badge {
            padding: 0.4rem 0.75rem;
            font-size: 1rem;
          }

          .question-card {
            margin-bottom: 1.2rem;
            padding: clamp(1.1rem, 5vw, 1.7rem) clamp(0.9rem, 4vw, 1.3rem);
          }

          .question-count {
            margin-bottom: 0.65rem;
            font-size: 0.78rem;
            letter-spacing: 1px;
          }

          .options-grid {
            gap: 0.7rem;
            margin-bottom: 1.2rem;
          }

          .option-card {
            gap: 0.8rem;
            padding: 0.85rem;
          }

          .option-letter {
            width: 36px;
            height: 36px;
          }

          .option-text {
            min-width: 0;
            font-size: 1rem;
            overflow-wrap: anywhere;
          }

          .action-section .btn {
            max-width: 100% !important;
            padding: 0.9rem !important;
            font-size: 1rem !important;
          }
        }

        @media (max-width: 380px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }

          .quiz-header {
            gap: 8px;
          }

          .badge-grade,
          .badge-topic {
            font-size: 0.78rem;
          }
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
