import React, { useState } from 'react';
import { BookOpen, Calculator, FlaskConical, Landmark, Globe, MessageCircle, Palette, Activity, Heart, Trophy, Gamepad2 } from 'lucide-react';
import { curriculum } from '../data/curriculum';

const allSubjects = [
  { id: 'portugues', name: 'Português', icon: <BookOpen size={18} />, color: '#9D74FF' },
  { id: 'matematica', name: 'Matemática', icon: <Calculator size={18} />, color: '#4FB0FF' },
  { id: 'ciencias', name: 'Ciências', icon: <FlaskConical size={18} />, color: '#10B981' },
  { id: 'historia', name: 'História', icon: <Landmark size={18} />, color: '#F59E0B' },
  { id: 'geografia', name: 'Geografia', icon: <Globe size={18} />, color: '#06B6D4' },
  { id: 'ingles', name: 'Inglês', icon: <MessageCircle size={18} />, color: '#EF4444' },
  { id: 'arte', name: 'Arte', icon: <Palette size={18} />, color: '#EC4899' },
  { id: 'ed_fisica', name: 'Ed. Física', icon: <Activity size={18} />, color: '#F97316' },
  { id: 'religiao', name: 'Ensino Relig.', icon: <Heart size={18} />, color: '#8B5CF6' },
];

export default function MainMap({ userGrade, completedTopics, onSelectTopic, initialSubjectId }) {
  const [activeSubjectId, setActiveSubjectId] = useState(initialSubjectId || allSubjects[0].id);

  React.useEffect(() => {
    if (initialSubjectId) {
      setActiveSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);
  const [topicToStart, setTopicToStart] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const difficulties = [
    { id: 'fácil', title: 'Fácil', description: 'Para começar e revisar', icon: '🌱' },
    { id: 'médio', title: 'Médio', description: 'Um desafio equilibrado', icon: '⚡' },
    { id: 'difícil', title: 'Difícil', description: 'Para testar seus limites', icon: '🔥' },
    { id: 'misturado', title: 'Misturado', description: 'Questões de todos os níveis', icon: '🎲' },
  ];

  const startSelectedTopic = () => {
    if (!topicToStart || !selectedDifficulty) return;
    onSelectTopic(activeSubject, topicToStart, selectedDifficulty);
    setTopicToStart(null);
    setSelectedDifficulty(null);
  };
  
  const activeSubject = allSubjects.find(s => s.id === activeSubjectId);
  const gradeToUse = (userGrade && userGrade !== 'Professor') ? userGrade : '9';
  const topics = curriculum[activeSubjectId]?.[gradeToUse] || curriculum[activeSubjectId]?.['9'] || [];

  return (
    <div className="dashboard-wrapper">
      {/* Barra de Matérias */}
      <div className="subjects-nav glass">
        {allSubjects.map(subject => (
          <div 
            key={subject.id} 
            className={`subject-tab ${activeSubjectId === subject.id ? 'active' : ''}`}
            style={{ '--s-color': subject.color }}
            onClick={() => setActiveSubjectId(subject.id)}
          >
            <span className="tab-icon">{subject.icon}</span>
            <span className="tab-name">{subject.name}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-header text-center" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: activeSubject.color }}>{activeSubject.name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Escolha qualquer conteúdo do {userGrade}º Ano para estudar</p>
      </div>

      {/* Grid Livre de Conteúdos */}
      {topics.length > 0 ? (
        <div className="topics-grid">
          {topics.map((topic, index) => {
            const topicKey = `${activeSubject.id}_${userGrade}_${topic.id}`;
            const isCompleted = completedTopics.includes(topicKey);

            return (
              <div 
                key={topic.id} 
                className={`topic-card glass-card ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  setTopicToStart(topic);
                  setSelectedDifficulty(null);
                }}
                style={{ '--node-color': activeSubject.color }}
              >
                <div className="topic-icon-wrapper" style={{ background: isCompleted ? 'var(--success)' : activeSubject.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isCompleted ? <Trophy size={20} color="white" /> : <Gamepad2 size={20} color="white" />}
                </div>
                
                <div className="topic-content">
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {topic.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {topic.desc}
                  </p>
                </div>

                <div className="topic-footer" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: isCompleted ? 'var(--success)' : activeSubject.color }}>
                    {isCompleted ? '✓ Concluído' : '▶ Iniciar Missão'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    15 por rodada
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Em Construção 🚧</h3>
          <p style={{ color: 'var(--text-muted)' }}>Os conteúdos desta matéria serão adicionados em breve.</p>
        </div>
      )}

      {topicToStart && (
        <div
          className="difficulty-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setTopicToStart(null);
              setSelectedDifficulty(null);
            }
          }}
        >
          <section
            className="difficulty-modal glass-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="difficulty-modal-title"
          >
            <button
              className="difficulty-modal-close"
              type="button"
              onClick={() => {
                setTopicToStart(null);
                setSelectedDifficulty(null);
              }}
              aria-label="Fechar escolha de dificuldade"
            >
              ×
            </button>
            <span className="difficulty-modal-icon" aria-hidden="true">🎯</span>
            <p className="difficulty-modal-eyebrow">PREPARE-SE PARA O DESAFIO</p>
            <h2 id="difficulty-modal-title">Escolha a dificuldade</h2>
            <p className="difficulty-modal-topic">{topicToStart.title}</p>

            <div className="difficulty-options" role="group" aria-label="Nível de dificuldade">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  className={`difficulty-option ${selectedDifficulty === difficulty.id ? 'selected' : ''}`}
                  type="button"
                  aria-pressed={selectedDifficulty === difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                >
                  <span className="difficulty-option-icon" aria-hidden="true">{difficulty.icon}</span>
                  <span className="difficulty-option-copy">
                    <strong>{difficulty.title}</strong>
                    <small>{difficulty.description}</small>
                  </span>
                  <span className="difficulty-option-check" aria-hidden="true">
                    {selectedDifficulty === difficulty.id ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>

            <div className="difficulty-modal-actions">
              <button
                className="difficulty-cancel"
                type="button"
                onClick={() => {
                  setTopicToStart(null);
                  setSelectedDifficulty(null);
                }}
              >
                Voltar
              </button>
              <button
                className="difficulty-start"
                type="button"
                onClick={startSelectedTopic}
                disabled={!selectedDifficulty}
              >
                Começar estudo
              </button>
            </div>
          </section>
        </div>
      )}

      <style>{`
        .dashboard-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }

        .subjects-nav {
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-full);
          margin-bottom: 2rem;
          scrollbar-width: none;
        }
        .subjects-nav::-webkit-scrollbar { display: none; }
        
        .subject-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-weight: 800;
          color: var(--text-muted);
          transition: all 0.2s;
          white-space: nowrap;
          border: 2px solid transparent;
        }
        .subject-tab:hover { background: rgba(0,0,0,0.03); }
        .subject-tab.active {
          background: white;
          color: var(--s-color);
          border-color: var(--s-color);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transform: scale(1.05);
        }

        /* Grid Livre */
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding-bottom: 4rem;
        }

        .topic-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          background: white;
          border: 2px solid var(--border-light);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .topic-card:hover {
          transform: translateY(-5px);
          border-color: var(--node-color);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }

        .topic-card.completed {
          background: #f8fafc;
          border-color: var(--success-light);
        }
        .topic-card.completed:hover {
          border-color: var(--success);
        }

        .topic-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          margin-bottom: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .difficulty-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
          background: rgba(15, 23, 42, 0.68);
          backdrop-filter: blur(6px);
        }

        .difficulty-modal {
          position: relative;
          width: min(100%, 460px);
          max-height: 100%;
          overflow-y: auto;
          padding: 28px;
          border: 1px solid rgba(157, 116, 255, 0.2);
          border-radius: 26px;
          background: #fff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          text-align: center;
        }

        .difficulty-modal-close {
          position: absolute;
          top: 12px;
          right: 14px;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          font: inherit;
          font-size: 1.5rem;
          line-height: 1;
        }

        .difficulty-modal-icon {
          display: block;
          margin: 0 auto 8px;
          font-size: 2.4rem;
        }

        .difficulty-modal-eyebrow {
          color: #7c3aed;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .difficulty-modal h2 {
          margin-top: 6px;
          color: #1e293b;
          font-size: 1.55rem;
        }

        .difficulty-modal-topic {
          margin-top: 6px;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .difficulty-options {
          display: grid;
          gap: 9px;
          margin-top: 22px;
          text-align: left;
        }

        .difficulty-option {
          display: flex;
          width: 100%;
          min-width: 0;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          background: #fff;
          color: #334155;
          cursor: pointer;
          font: inherit;
          text-align: left;
          transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
        }

        .difficulty-option:hover {
          border-color: #c4b5fd;
          transform: translateY(-1px);
        }

        .difficulty-option.selected {
          border-color: #8b5cf6;
          background: #f5f3ff;
        }

        .difficulty-option-icon {
          display: grid;
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 12px;
          background: #f1f5f9;
          font-size: 1.35rem;
        }

        .difficulty-option-copy {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          gap: 2px;
        }

        .difficulty-option-copy strong {
          font-size: 0.95rem;
        }

        .difficulty-option-copy small {
          color: #64748b;
          font-size: 0.75rem;
        }

        .difficulty-option-check {
          display: grid;
          width: 24px;
          height: 24px;
          flex: 0 0 auto;
          place-items: center;
          border: 2px solid #cbd5e1;
          border-radius: 50%;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 900;
        }

        .difficulty-option.selected .difficulty-option-check {
          border-color: #7c3aed;
          background: #7c3aed;
        }

        .difficulty-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .difficulty-cancel,
        .difficulty-start {
          min-height: 46px;
          flex: 1;
          border: 0;
          border-radius: 13px;
          cursor: pointer;
          font: inherit;
          font-weight: 800;
        }

        .difficulty-cancel {
          background: #f1f5f9;
          color: #475569;
        }

        .difficulty-start {
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          color: #fff;
          box-shadow: 0 6px 14px rgba(109, 40, 217, 0.22);
        }

        .difficulty-start:disabled {
          cursor: not-allowed;
          opacity: 0.45;
          box-shadow: none;
        }

        @media (max-width: 420px) {
          .difficulty-modal {
            padding: 24px 18px 18px;
            border-radius: 22px;
          }

          .difficulty-modal h2 {
            font-size: 1.35rem;
          }

          .difficulty-option {
            gap: 9px;
            padding: 10px;
          }
        }
        
        .topic-content {
          flex: 1;
        }

        @media (max-width: 768px) {
          .topics-grid {
            grid-template-columns: 1fr;
          }
          .minigames-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
