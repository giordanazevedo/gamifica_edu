import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CircleHelp, Lightbulb, Loader2, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { generateContentExplanation, generateCustomQuestions, getQuestionGenerationError } from '../services/aiQuestionService';

const SUBJECTS = [
  'Português',
  'Matemática',
  'Ciências',
  'História',
  'Geografia',
  'Inglês',
  'Arte',
  'Educação Física',
  'Ensino Religioso',
];

export default function AIStudyQuiz({ onClose }) {
  const [mode, setMode] = useState(null);
  const [subject, setSubject] = useState('Matemática');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Média');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [contentExplanation, setContentExplanation] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;
  const questionLength = currentQuestion?.question.length || 0;
  const questionSizeClass = questionLength > 220
    ? 'ai-question-very-long'
    : questionLength > 120
      ? 'ai-question-long'
      : '';

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError('');
    setIsGenerating(true);
    setQuestions([]);
    setContentExplanation(null);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);

    try {
      if (mode === 'explanation') {
        const generatedExplanation = await generateContentExplanation({ subject, topic });
        setContentExplanation(generatedExplanation);
      } else {
        const generatedQuestions = await generateCustomQuestions({ subject, topic, difficulty, count });
        setQuestions(generatedQuestions);
      }
    } catch (generationError) {
      console.error('Erro ao gerar questões com IA:', generationError);
      setError(getQuestionGenerationError(generationError));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (answerIndex) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedAnswer(answerIndex);
    if (answerIndex === currentQuestion.correct) {
      setScore(currentScore => currentScore + 1);
    }
  };

  const handleNext = () => {
    if (questionIndex + 1 === questions.length) {
      setIsFinished(true);
      return;
    }
    setQuestionIndex(index => index + 1);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setQuestions([]);
    setContentExplanation(null);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setError('');
  };

  return (
    <div className="ai-quiz-overlay" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="ai-quiz-modal" role="dialog" aria-modal="true" aria-labelledby="ai-quiz-title">
        <header className="ai-quiz-header">
          <div className="ai-quiz-heading">
            <span className="ai-quiz-icon"><Sparkles size={21} /></span>
            <div>
              <span className="ai-quiz-kicker">ESTUDO PERSONALIZADO</span>
              <h2 id="ai-quiz-title">Estudar com IA</h2>
            </div>
          </div>
          <button className="ai-quiz-close" onClick={onClose} aria-label="Fechar">
            <XCircle size={23} />
          </button>
        </header>

        {!mode && !isGenerating && (
          <div className="ai-quiz-mode-picker">
            <p className="ai-quiz-intro">
              Escolha um tema relacionado aos conteúdos previstos para o 9º ano. Como você quer estudar?
            </p>
            <button className="ai-quiz-mode-card" onClick={() => setMode('questions')}>
              <span className="ai-quiz-mode-icon"><CircleHelp size={23} /></span>
              <span>
                <strong>Responder questões</strong>
                <small>Pratique o tema com perguntas e veja as explicações das respostas.</small>
              </span>
              <ArrowRight size={19} />
            </button>
            <button className="ai-quiz-mode-card" onClick={() => setMode('explanation')}>
              <span className="ai-quiz-mode-icon"><BookOpen size={22} /></span>
              <span>
                <strong>Entender um conteúdo</strong>
                <small>Receba uma explicação organizada, com exemplos simples.</small>
              </span>
              <ArrowRight size={19} />
            </button>
          </div>
        )}

        {mode && questions.length === 0 && !contentExplanation && !isGenerating && (
          <form className="ai-quiz-form" onSubmit={handleGenerate}>
            <p className="ai-quiz-intro">
              {mode === 'questions'
                ? 'Escolha a matéria e escreva um tema do currículo do 9º ano para praticar com questões.'
                : 'Escolha a matéria e escreva um conteúdo do currículo que quer entender.'}
            </p>

            <button
              className="ai-quiz-back-link"
              type="button"
              onClick={() => {
                setMode(null);
                setError('');
              }}
            >
              <ArrowLeft size={16} /> Escolher outro jeito de estudar
            </button>

            <label htmlFor="ai-quiz-subject">Matéria</label>
            <select id="ai-quiz-subject" value={subject} onChange={event => setSubject(event.target.value)}>
              {SUBJECTS.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <label htmlFor="ai-quiz-topic">Tema ou conteúdo que quer estudar</label>
            <input
              id="ai-quiz-topic"
              type="text"
              value={topic}
              onChange={event => setTopic(event.target.value)}
              placeholder="Ex.: equações do 2º grau"
              maxLength={100}
              required
            />

            {mode === 'questions' && <div className="ai-quiz-form-row">
              <div>
                <label htmlFor="ai-quiz-difficulty">Dificuldade</label>
                <select id="ai-quiz-difficulty" value={difficulty} onChange={event => setDifficulty(event.target.value)}>
                  <option>Fácil</option>
                  <option>Média</option>
                  <option>Desafiadora</option>
                </select>
              </div>
              <div>
                <label htmlFor="ai-quiz-count">Perguntas</label>
                <select id="ai-quiz-count" value={count} onChange={event => setCount(Number(event.target.value))}>
                  <option value={5}>5 perguntas</option>
                  <option value={10}>10 perguntas</option>
                </select>
              </div>
            </div>}

            {error && <p className="ai-quiz-error" role="alert">{error}</p>}

            <button className="ai-quiz-primary" type="submit" disabled={!topic.trim() || isGenerating}>
              <Sparkles size={18} /> {mode === 'questions' ? 'Gerar questões' : 'Gerar explicação'}
            </button>
          </form>
        )}

        {isGenerating && (
          <div className="ai-quiz-loading" role="status">
            <Loader2 size={34} />
            <strong>{mode === 'questions' ? 'Preparando suas questões...' : 'Preparando sua explicação...'}</strong>
            <span>A IA está estudando {topic.trim()} para criar um material claro para você.</span>
          </div>
        )}

        {contentExplanation && (
          <div className="ai-content-explanation">
            <div className="ai-quiz-progress">
              <span>{subject} · {topic}</span>
              <BookOpen size={18} />
            </div>
            <h3>{contentExplanation.title}</h3>
            {contentExplanation.sections.map((section, index) => (
              <section className="ai-content-section" key={`${section.heading}-${index}`}>
                <h4>{section.heading}</h4>
                <p>{section.content}</p>
              </section>
            ))}
            <div className="ai-content-example">
              <Lightbulb size={19} />
              <div>
                <strong>Exemplo prático</strong>
                <p>{contentExplanation.example}</p>
              </div>
            </div>
            <button className="ai-quiz-secondary ai-content-back" onClick={handleRestart}>
              <ArrowLeft size={17} /> Estudar outro conteúdo
            </button>
          </div>
        )}

        {currentQuestion && !isFinished && (
          <div className="ai-quiz-question">
            <div className="ai-quiz-progress">
              <span>{subject} · {topic}</span>
              <strong>{questionIndex + 1}/{questions.length}</strong>
            </div>
            <h3 className={`ai-quiz-question-text ${questionSizeClass}`}>
              {currentQuestion.question}
            </h3>
            <div className="ai-quiz-options">
              {currentQuestion.options.map((option, index) => {
                let stateClass = '';
                if (isAnswered && index === currentQuestion.correct) stateClass = 'correct';
                else if (isAnswered && index === selectedAnswer) stateClass = 'incorrect';
                else if (isAnswered) stateClass = 'dimmed';

                return (
                  <button
                    key={`${questionIndex}-${index}`}
                    className={`ai-quiz-option ${stateClass}`}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                  >
                    <span className="ai-quiz-option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`ai-quiz-explanation ${selectedAnswer === currentQuestion.correct ? 'right' : 'wrong'}`}>
                {selectedAnswer === currentQuestion.correct
                  ? <CheckCircle2 size={19} />
                  : <XCircle size={19} />}
                <span>{currentQuestion.explanation}</span>
              </div>
            )}

            {isAnswered && (
              <button className="ai-quiz-primary" onClick={handleNext}>
                {questionIndex + 1 === questions.length ? 'Ver resultado' : 'Próxima pergunta'}
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}

        {isFinished && (
          <div className="ai-quiz-finished">
            <span className="ai-quiz-finished-icon"><BookOpen size={34} /></span>
            <span className="ai-quiz-kicker">QUIZ CONCLUÍDO</span>
            <h3>{score} de {questions.length} acertos</h3>
            <p>Você praticou <strong>{topic}</strong> em {subject}. Continue estudando para mandar ainda melhor!</p>
            <div className="ai-quiz-finish-actions">
              <button className="ai-quiz-secondary" onClick={handleRestart}>
                <ArrowLeft size={17} /> Escolher outro tema
              </button>
              <button className="ai-quiz-primary" onClick={handleGenerate}>
                <RotateCcw size={17} /> Refazer quiz
              </button>
            </div>
          </div>
        )}
      </section>

      <style>{`
        .ai-quiz-overlay {
          position: fixed;
          z-index: 1200;
          inset: 0;
          display: grid;
          place-items: center;
          overflow-y: auto;
          padding: 18px;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(5px);
        }

        .ai-quiz-modal {
          width: min(100%, 580px);
          max-height: min(92dvh, 850px);
          overflow-y: auto;
          padding: 22px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
        }

        .ai-quiz-header,
        .ai-quiz-heading {
          display: flex;
          align-items: center;
        }

        .ai-quiz-header {
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .ai-quiz-heading { gap: 12px; min-width: 0; }

        .ai-quiz-icon,
        .ai-quiz-finished-icon {
          display: grid;
          width: 46px;
          height: 46px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 15px;
          background: #f3e8ff;
          color: #7c3aed;
        }

        .ai-quiz-kicker {
          color: #7c3aed;
          font-size: 0.67rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .ai-quiz-header h2 {
          margin: 2px 0 0;
          color: #1e293b;
          font-size: 1.2rem;
        }

        .ai-quiz-close {
          display: grid;
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
        }

        .ai-quiz-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ai-quiz-mode-picker { display: flex; flex-direction: column; gap: 11px; }

        .ai-quiz-mode-card {
          display: flex;
          width: 100%;
          min-width: 0;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border: 1px solid #ddd6fe;
          border-radius: 15px;
          background: #faf8ff;
          color: #334155;
          cursor: pointer;
          font: inherit;
          text-align: left;
        }

        .ai-quiz-mode-card:hover { border-color: #8b5cf6; background: #f5f3ff; }
        .ai-quiz-mode-card > span:nth-child(2) { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 4px; }
        .ai-quiz-mode-card strong { color: #4c1d95; font-size: 0.92rem; }
        .ai-quiz-mode-card small { color: #64748b; font-size: 0.79rem; line-height: 1.4; }
        .ai-quiz-mode-card > svg { flex: 0 0 auto; color: #7c3aed; }

        .ai-quiz-mode-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 13px;
          background: #ede9fe;
          color: #7c3aed;
        }

        .ai-quiz-back-link {
          display: flex;
          width: fit-content;
          align-items: center;
          gap: 5px;
          padding: 2px 0;
          border: 0;
          background: transparent;
          color: #6d28d9;
          cursor: pointer;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 750;
        }

        .ai-quiz-intro {
          margin: 0 0 8px;
          color: #64748b;
          font-size: 0.93rem;
          line-height: 1.5;
        }

        .ai-quiz-form label {
          color: #334155;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .ai-quiz-form input,
        .ai-quiz-form select {
          width: 100%;
          min-width: 0;
          min-height: 46px;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: #f8fafc;
          color: #1e293b;
          font: inherit;
          font-size: 0.92rem;
          outline: none;
        }

        .ai-quiz-form input:focus,
        .ai-quiz-form select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.13);
        }

        .ai-quiz-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 2px;
        }

        .ai-quiz-form-row > div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 8px;
        }

        .ai-quiz-primary,
        .ai-quiz-secondary {
          display: flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 14px;
          border: 0;
          border-radius: 13px;
          cursor: pointer;
          font: inherit;
          font-size: 0.92rem;
          font-weight: 850;
        }

        .ai-quiz-primary {
          width: 100%;
          margin-top: 8px;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 6px 15px rgba(91, 33, 182, 0.18);
          color: white;
        }

        .ai-quiz-primary:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .ai-quiz-secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .ai-quiz-error {
          margin: 3px 0;
          padding: 10px 12px;
          border-radius: 11px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 0.84rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .ai-quiz-loading,
        .ai-quiz-finished {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 28px 10px;
          text-align: center;
        }

        .ai-quiz-loading { color: #7c3aed; }
        .ai-quiz-loading svg { animation: aiQuizSpin 1s linear infinite; }
        .ai-quiz-loading span,
        .ai-quiz-finished p { color: #64748b; line-height: 1.5; }

        .ai-content-explanation { color: #334155; }
        .ai-content-explanation > h3 { margin: 0 0 15px; color: #1e293b; font-size: 1.28rem; line-height: 1.35; }
        .ai-content-section { margin: 0 0 15px; }
        .ai-content-section h4 { margin: 0 0 5px; color: #5b21b6; font-size: 0.96rem; }
        .ai-content-section p,
        .ai-content-example p { margin: 0; color: #475569; font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; }

        .ai-content-example {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 16px 0;
          padding: 13px;
          border: 1px solid #fde68a;
          border-radius: 13px;
          background: #fffbeb;
          color: #b45309;
        }

        .ai-content-example svg { flex: 0 0 auto; }
        .ai-content-example strong { display: block; margin-bottom: 4px; color: #92400e; }
        .ai-content-example p { color: #78350f; }
        .ai-content-back { width: 100%; }

        .ai-quiz-progress {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 750;
        }

        .ai-quiz-progress span {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .ai-quiz-progress strong {
          flex: 0 0 auto;
          color: #7c3aed;
        }

        .ai-quiz-question-text {
          margin: 0 0 16px;
          color: #1e293b;
          font-size: clamp(1rem, 4vw, 1.2rem);
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .ai-question-long { font-size: clamp(0.94rem, 3.5vw, 1.05rem); }
        .ai-question-very-long { font-size: clamp(0.86rem, 3.1vw, 0.95rem); }

        .ai-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .ai-quiz-option {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 13px;
          background: white;
          color: #334155;
          cursor: pointer;
          font: inherit;
          font-size: 0.9rem;
          line-height: 1.4;
          text-align: left;
          overflow-wrap: anywhere;
        }

        .ai-quiz-option:disabled { cursor: default; }
        .ai-quiz-option.correct { border-color: #10b981; background: #ecfdf5; color: #065f46; }
        .ai-quiz-option.incorrect { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
        .ai-quiz-option.dimmed { opacity: 0.6; }

        .ai-quiz-option-letter {
          display: grid;
          width: 28px;
          height: 28px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 8px;
          background: #f3e8ff;
          color: #7c3aed;
          font-weight: 900;
        }

        .ai-quiz-explanation {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 12px;
          padding: 11px;
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.45;
        }

        .ai-quiz-explanation svg { flex: 0 0 auto; }
        .ai-quiz-explanation.right { background: #ecfdf5; color: #065f46; }
        .ai-quiz-explanation.wrong { background: #fff7ed; color: #9a3412; }

        .ai-quiz-finished h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.65rem;
        }

        .ai-quiz-finished p { margin: 0; }
        .ai-quiz-finished-icon { width: 64px; height: 64px; border-radius: 22px; }

        .ai-quiz-finish-actions {
          display: grid;
          width: 100%;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 5px;
        }

        .ai-quiz-finish-actions .ai-quiz-primary { margin: 0; }

        @keyframes aiQuizSpin { to { transform: rotate(360deg); } }

        @media (max-width: 420px) {
          .ai-quiz-overlay { align-items: end; padding: 0; }
          .ai-quiz-modal {
            width: 100%;
            max-height: 94dvh;
            padding: 18px 15px calc(16px + env(safe-area-inset-bottom));
            border-radius: 22px 22px 0 0;
          }
          .ai-quiz-finish-actions { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-quiz-loading svg { animation-duration: 2s; }
        }
      `}</style>
    </div>
  );
}
