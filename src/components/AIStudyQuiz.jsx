import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CircleHelp, FileText, ImagePlus, Lightbulb, Loader2, MessageCircle, Paperclip, RotateCcw, Send, Sparkles, XCircle } from 'lucide-react';
import { generateContentExplanation, generateCustomQuestions, getQuestionGenerationError, sendStudyChatMessage } from '../services/aiQuestionService';

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export default function AIStudyQuiz({ onClose }) {
  const [mode, setMode] = useState(null);
  const [subject, setSubject] = useState('Matemática');
  const [topic, setTopic] = useState('');
  const [attachment, setAttachment] = useState(null);
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
  const attachmentInputRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSubject, setChatSubject] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatAttachment, setChatAttachment] = useState(null);
  const [chatError, setChatError] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatAttachmentInputRef = useRef(null);
  const chatMessagesEndRef = useRef(null);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chatMessages, isSendingChat, mode]);

  const currentQuestion = questions[questionIndex];
  const isAnswered = selectedAnswer !== null;
  const questionLength = currentQuestion?.question.length || 0;
  const questionSizeClass = questionLength > 220
    ? 'ai-question-very-long'
    : questionLength > 120
      ? 'ai-question-long'
      : '';

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0] || null;
    setError('');
    if (file && !ACCEPTED_ATTACHMENT_TYPES.includes(file.type)) {
      setAttachment(null);
      event.target.value = '';
      setError('Escolha uma imagem JPG, PNG ou WebP, ou um documento PDF.');
      return;
    }
    if (file && file.size > MAX_ATTACHMENT_SIZE) {
      setAttachment(null);
      event.target.value = '';
      setError('O arquivo deve ter no máximo 10 MB.');
      return;
    }
    setAttachment(file);
  };

  const handleChatAttachmentChange = (event) => {
    const file = event.target.files?.[0] || null;
    setChatError('');
    if (file && !ACCEPTED_ATTACHMENT_TYPES.includes(file.type)) {
      setChatAttachment(null);
      event.target.value = '';
      setChatError('Escolha uma imagem JPG, PNG ou WebP, ou um documento PDF.');
      return;
    }
    if (file && file.size > MAX_ATTACHMENT_SIZE) {
      setChatAttachment(null);
      event.target.value = '';
      setChatError('O arquivo deve ter no máximo 10 MB.');
      return;
    }
    setChatAttachment(file);
  };

  const handleSendChatMessage = async (event) => {
    event.preventDefault();
    const message = chatInput.trim();
    if ((!message && !chatAttachment) || isSendingChat) return;

    const file = chatAttachment;
    const userMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: 'user',
      text: message || `Analise este material: ${file.name}`,
      sent: false,
    };
    const assistantMessageId = `${userMessage.id}-reply`;
    setChatMessages(current => [
      ...current,
      userMessage,
      { id: assistantMessageId, role: 'assistant', text: '' },
    ]);
    setChatInput('');
    setChatAttachment(null);
    if (chatAttachmentInputRef.current) chatAttachmentInputRef.current.value = '';
    setChatError('');
    setIsSendingChat(true);

    try {
      const history = chatMessages
        .filter(entry => entry.sent !== false)
        .map(({ role, text }) => ({ role: role === 'assistant' ? 'model' : role, text }));
      const answer = await sendStudyChatMessage({
        subject: chatSubject,
        history,
        message,
        attachment: file,
        onChunk: (chunk) => {
          setChatMessages(current => current.map(entry => (
            entry.id === assistantMessageId
              ? { ...entry, text: entry.text + chunk }
              : entry
          )));
        },
      });
      setChatMessages(current => current.map(entry => {
        if (entry.id === userMessage.id) return { ...entry, sent: true };
        if (entry.id === assistantMessageId) return { ...entry, text: answer };
        return entry;
      }));
    } catch (chatGenerationError) {
      console.error('Erro ao conversar com a IA:', chatGenerationError);
      setChatError(getQuestionGenerationError(chatGenerationError));
      setChatMessages(current => current
        .filter(entry => entry.id !== assistantMessageId || entry.text)
        .map(entry => (entry.id === userMessage.id ? { ...entry, sent: false } : entry)));
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleNewChat = () => {
    setChatMessages([]);
    setChatInput('');
    setChatAttachment(null);
    setChatSubject('');
    setChatError('');
    if (chatAttachmentInputRef.current) chatAttachmentInputRef.current.value = '';
  };

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
        const generatedExplanation = await generateContentExplanation({ subject, topic, attachment });
        setContentExplanation(generatedExplanation);
      } else {
        const generatedQuestions = await generateCustomQuestions({ subject, topic, difficulty, count, attachment });
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
              Escolha como quer estudar: digite qualquer matéria e tema, ou envie um material para a IA analisar.
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
            <button className="ai-quiz-mode-card" onClick={() => setMode('chat')}>
              <span className="ai-quiz-mode-icon"><MessageCircle size={22} /></span>
              <span>
                <strong>Conversar com a IA</strong>
                <small>Tire dúvidas em uma conversa livre e envie imagens ou PDFs.</small>
              </span>
              <ArrowRight size={19} />
            </button>
          </div>
        )}

        {mode === 'chat' && (
          <div className="ai-chat">
            <button className="ai-quiz-back-link" type="button" onClick={() => setMode(null)}>
              <ArrowLeft size={16} /> Escolher outro jeito de estudar
            </button>
            <div className="ai-chat-toolbar">
              <label htmlFor="ai-chat-subject">Matéria ou assunto (opcional)</label>
              <div className="ai-chat-toolbar-actions">
                <input
                  id="ai-chat-subject"
                  type="text"
                  value={chatSubject}
                  onChange={event => setChatSubject(event.target.value)}
                  placeholder="Qualquer assunto"
                  maxLength={80}
                />
                <button type="button" className="ai-chat-new" onClick={handleNewChat} disabled={isSendingChat} aria-label="Começar nova conversa" title="Nova conversa">
                  <RotateCcw size={17} />
                </button>
              </div>
            </div>

            <div className="ai-chat-messages" role="log" aria-label="Conversa com a IA" aria-live="polite">
              {chatMessages.length === 0 && (
                <div className="ai-chat-empty">
                  <span><MessageCircle size={25} /></span>
                  <strong>O que você quer estudar?</strong>
                  <p>Pergunte qualquer coisa, peça uma explicação ou envie uma foto/PDF. Você pode continuar a conversa e tirar outras dúvidas.</p>
                </div>
              )}
              {chatMessages.map(entry => (
                <div className={`ai-chat-message ${entry.role === 'user' ? 'user' : 'assistant'}`} key={entry.id}>
                  <p>{entry.text}</p>
                  {entry.role === 'user' && entry.sent === false && !isSendingChat && (
                    <small>Não enviada. Você pode fazer uma nova tentativa.</small>
                  )}
                </div>
              ))}
              {isSendingChat && (
                <div className="ai-chat-message assistant ai-chat-thinking" role="status">
                  <Loader2 size={16} /> A IA está respondendo...
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {chatError && <p className="ai-quiz-error" role="alert">{chatError}</p>}
            {chatAttachment && (
              <div className="ai-quiz-file-selected ai-chat-file-selected">
                {chatAttachment.type === 'application/pdf' ? <FileText size={18} /> : <ImagePlus size={18} />}
                <span>{chatAttachment.name}</span>
                <button type="button" onClick={() => {
                  setChatAttachment(null);
                  if (chatAttachmentInputRef.current) chatAttachmentInputRef.current.value = '';
                }} aria-label="Remover arquivo">
                  <XCircle size={17} />
                </button>
              </div>
            )}

            <form className="ai-chat-composer" onSubmit={handleSendChatMessage}>
              <input
                ref={chatAttachmentInputRef}
                className="ai-quiz-file-input ai-chat-file-input"
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={handleChatAttachmentChange}
                aria-label="Anexar imagem ou PDF"
              />
              <button
                type="button"
                className="ai-chat-attach"
                onClick={() => chatAttachmentInputRef.current?.click()}
                disabled={isSendingChat}
                aria-label="Anexar imagem ou PDF"
                title="Anexar imagem ou PDF (até 10 MB)"
              >
                <Paperclip size={19} />
              </button>
              <textarea
                value={chatInput}
                onChange={event => setChatInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Escreva sua dúvida..."
                maxLength={4000}
                rows={2}
                aria-label="Sua mensagem"
              />
              <button
                className="ai-chat-send"
                type="submit"
                disabled={isSendingChat || (!chatInput.trim() && !chatAttachment)}
                aria-label="Enviar mensagem"
                title="Enviar mensagem"
              >
                {isSendingChat ? <Loader2 size={19} /> : <Send size={19} />}
              </button>
            </form>
            <p className="ai-chat-disclaimer">As respostas podem conter erros. Não envie dados pessoais.</p>
          </div>
        )}

        {mode && mode !== 'chat' && questions.length === 0 && !contentExplanation && !isGenerating && (
          <form className="ai-quiz-form" onSubmit={handleGenerate}>
            <p className="ai-quiz-intro">
              {mode === 'questions'
                ? 'Escolha a matéria e escreva qualquer tema para praticar com questões. Você também pode usar uma imagem ou PDF.'
                : 'Escolha a matéria e escreva qualquer conteúdo para entender. Você também pode usar uma imagem ou PDF.'}
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

            <label htmlFor="ai-quiz-subject">Matéria ou área de estudo</label>
            <input
              id="ai-quiz-subject"
              type="text"
              value={subject}
              onChange={event => setSubject(event.target.value)}
              placeholder="Ex.: Biologia, programação, astronomia..."
              maxLength={80}
              required
            />

            <label htmlFor="ai-quiz-topic">Tema ou conteúdo que quer estudar</label>
            <input
              id="ai-quiz-topic"
              type="text"
              value={topic}
              onChange={event => setTopic(event.target.value)}
              placeholder={attachment ? 'Opcional ao enviar um arquivo' : 'Ex.: equações do 2º grau'}
              maxLength={300}
              required={!attachment}
            />

            <label htmlFor="ai-quiz-attachment">Material de estudo (opcional)</label>
            <input
              ref={attachmentInputRef}
              id="ai-quiz-attachment"
              className="ai-quiz-file-input"
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={handleAttachmentChange}
            />
            <p className="ai-quiz-file-help">
              Envie uma foto ou PDF de até 10 MB. O arquivo será enviado à IA para análise; não inclua dados pessoais.
            </p>
            {attachment && (
              <div className="ai-quiz-file-selected">
                {attachment.type === 'application/pdf' ? <FileText size={18} /> : <ImagePlus size={18} />}
                <span title={attachment.name}>{attachment.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(null);
                    if (attachmentInputRef.current) attachmentInputRef.current.value = '';
                  }}
                  aria-label="Remover arquivo"
                >
                  <XCircle size={18} />
                </button>
              </div>
            )}

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

            <button className="ai-quiz-primary" type="submit" disabled={(!topic.trim() && !attachment) || !subject.trim() || isGenerating}>
              {attachment ? <Paperclip size={18} /> : <Sparkles size={18} />}
              {mode === 'questions' ? 'Gerar questões' : 'Gerar explicação'}
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
          background: #fee2e2;
          color: #b91c1c;
        }

        .ai-quiz-kicker {
          color: #b91c1c;
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

        .ai-chat { display: flex; flex-direction: column; gap: 11px; }
        .ai-chat-toolbar label { display: block; margin-bottom: 5px; color: #475569; font-size: 0.78rem; font-weight: 800; }
        .ai-chat-toolbar-actions { display: flex; gap: 8px; }
        .ai-chat-toolbar input {
          width: 100%; min-width: 0; min-height: 40px; padding: 8px 11px;
          border: 1px solid #cbd5e1; border-radius: 11px; background: #f8fafc;
          color: #1e293b; font: inherit; font-size: 0.86rem;
        }
        .ai-chat-toolbar input:focus,
        .ai-chat-composer textarea:focus { border-color: #ef4444; outline: 3px solid rgba(239, 68, 68, 0.14); }
        .ai-chat-new,
        .ai-chat-attach,
        .ai-chat-send {
          display: grid; flex: 0 0 auto; place-items: center; border: 0; cursor: pointer;
        }
        .ai-chat-new { width: 40px; border-radius: 11px; background: #fee2e2; color: #b91c1c; }
        .ai-chat-messages {
          display: flex; height: clamp(230px, 42dvh, 390px); flex-direction: column; gap: 11px;
          overflow-y: auto; padding: 13px; border: 1px solid #e2e8f0; border-radius: 15px;
          background: #f8fafc; overscroll-behavior: contain;
        }
        .ai-chat-empty {
          display: flex; min-height: 100%; flex-direction: column; align-items: center;
          justify-content: center; padding: 18px; color: #64748b; text-align: center;
        }
        .ai-chat-empty > span {
          display: grid; width: 48px; height: 48px; place-items: center;
          margin-bottom: 10px; border-radius: 16px; background: #fee2e2; color: #b91c1c;
        }
        .ai-chat-empty strong { color: #1e293b; }
        .ai-chat-empty p { max-width: 340px; margin: 6px 0 0; font-size: 0.82rem; line-height: 1.5; }
        .ai-chat-message {
          max-width: 90%; padding: 10px 12px; border-radius: 14px; color: #334155;
          font-size: 0.88rem; line-height: 1.55; overflow-wrap: anywhere;
        }
        .ai-chat-message p { margin: 0; white-space: pre-wrap; }
        .ai-chat-message.assistant { align-self: flex-start; border: 1px solid #e2e8f0; border-bottom-left-radius: 5px; background: white; }
        .ai-chat-message.user { align-self: flex-end; border-bottom-right-radius: 5px; background: #b91c1c; color: white; }
        .ai-chat-message small { display: block; margin-top: 5px; color: #fee2e2; font-size: 0.7rem; }
        .ai-chat-thinking { display: flex; align-items: center; gap: 7px; color: #64748b; }
        .ai-chat-thinking svg { animation: aiQuizSpin 1s linear infinite; }
        .ai-chat-file-input { display: none; }
        .ai-chat-file-selected { margin-top: -2px; }
        .ai-chat-composer {
          display: flex; align-items: flex-end; gap: 7px; padding: 7px;
          border: 1px solid #cbd5e1; border-radius: 15px; background: white;
        }
        .ai-chat-composer textarea {
          width: 100%; min-width: 0; min-height: 42px; max-height: 120px; resize: vertical;
          padding: 10px 4px; border: 1px solid transparent; border-radius: 9px;
          color: #1e293b; font: inherit; font-size: 0.9rem; line-height: 1.4;
        }
        .ai-chat-attach { width: 40px; height: 40px; border-radius: 11px; background: #f1f5f9; color: #475569; }
        .ai-chat-send { width: 42px; height: 42px; border-radius: 12px; background: #b91c1c; color: white; }
        .ai-chat-send:disabled,
        .ai-chat-attach:disabled { cursor: not-allowed; opacity: 0.48; }
        .ai-chat-disclaimer { margin: -5px 0 0; color: #94a3b8; font-size: 0.7rem; text-align: center; }

        .ai-quiz-mode-card {
          display: flex;
          width: 100%;
          min-width: 0;
          align-items: center;
          gap: 12px;
          padding: 13px;
          border: 1px solid #fecaca;
          border-radius: 15px;
          background: #fff7f7;
          color: #334155;
          cursor: pointer;
          font: inherit;
          text-align: left;
        }

        .ai-quiz-mode-card:hover { border-color: #ef4444; background: #fef2f2; }
        .ai-quiz-mode-card > span:nth-child(2) { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 4px; }
        .ai-quiz-mode-card strong { color: #7f1d1d; font-size: 0.92rem; }
        .ai-quiz-mode-card small { color: #64748b; font-size: 0.79rem; line-height: 1.4; }
        .ai-quiz-mode-card > svg { flex: 0 0 auto; color: #b91c1c; }

        .ai-quiz-mode-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 13px;
          background: #fee2e2;
          color: #b91c1c;
        }

        .ai-quiz-back-link {
          display: flex;
          width: fit-content;
          align-items: center;
          gap: 5px;
          padding: 2px 0;
          border: 0;
          background: transparent;
          color: #b91c1c;
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
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.13);
        }

        .ai-quiz-form input[type="file"] {
          min-height: auto;
          padding: 8px;
          border-style: dashed;
          background: #fff7f7;
          font-size: 0.82rem;
        }

        .ai-quiz-form input[type="file"]::file-selector-button {
          margin-right: 10px;
          padding: 8px 10px;
          border: 0;
          border-radius: 9px;
          background: #fee2e2;
          color: #b91c1c;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .ai-quiz-file-help {
          margin: -5px 0 2px;
          color: #64748b;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .ai-quiz-file-selected {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 8px;
          padding: 9px 10px;
          border: 1px solid #fecaca;
          border-radius: 11px;
          background: #fff7f7;
          color: #b91c1c;
        }

        .ai-quiz-file-selected > span {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          font-size: 0.82rem;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ai-quiz-file-selected button {
          display: grid;
          width: 30px;
          height: 30px;
          flex: 0 0 auto;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: #b91c1c;
          cursor: pointer;
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
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          box-shadow: 0 6px 15px rgba(185, 28, 28, 0.18);
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

        .ai-quiz-loading { color: #b91c1c; }
        .ai-quiz-loading svg { animation: aiQuizSpin 1s linear infinite; }
        .ai-quiz-loading span,
        .ai-quiz-finished p { color: #64748b; line-height: 1.5; }

        .ai-content-explanation { color: #334155; }
        .ai-content-explanation > h3 { margin: 0 0 15px; color: #1e293b; font-size: 1.28rem; line-height: 1.35; }
        .ai-content-section { margin: 0 0 15px; }
        .ai-content-section h4 { margin: 0 0 5px; color: #b91c1c; font-size: 0.96rem; }
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
          color: #b91c1c;
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
          background: #fee2e2;
          color: #b91c1c;
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
