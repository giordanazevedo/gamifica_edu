import React from 'react';
import { curriculum } from '../data/curriculum';

export default function TopicSelect({ subject, grade, completedTopics, onSelectTopic, onBack }) {
  const topics = (curriculum[subject.id] && curriculum[subject.id][grade]) 
    ? curriculum[subject.id][grade] 
    : [];

  return (
    <div className="topic-container animate-float" style={{ animationDuration: '6s' }}>
      <div className="topic-header">
        <button className="btn-back" onClick={onBack}>⬅ Voltar</button>
        <div className="breadcrumbs glass-card">
          <span style={{ color: subject.color, fontWeight: '800' }}>{subject.name}</span>
          <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '800' }}>{grade}º Ano</span>
        </div>
      </div>

      <div className="hero-section glass">
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Mapa de Missões
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Avance pela trilha. Vença a fase anterior para desbloquear a próxima!
        </p>
      </div>

      {topics.length > 0 ? (
        <div className="trail-container">
          <div className="trail-line"></div>
          {topics.map((topic, index) => {
            // Lógica de bloqueio: o índice 0 é sempre livre. O índice N é livre se N-1 estiver concluído.
            const topicKey = `${subject.id}_${grade}_${topic.id}`;
            const isCompleted = completedTopics.includes(topicKey);
            
            let isUnlocked = false;
            if (index === 0) {
              isUnlocked = true;
            } else {
              const prevTopic = topics[index - 1];
              const prevTopicKey = `${subject.id}_${grade}_${prevTopic.id}`;
              isUnlocked = completedTopics.includes(prevTopicKey);
            }

            // Alternar esquerda e direita para fazer o caminho sinuoso
            const alignRight = index % 2 !== 0;

            return (
              <div 
                key={topic.id} 
                className={`trail-node-wrapper ${alignRight ? 'align-right' : 'align-left'} ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}`}
              >
                <div 
                  className="trail-node glass-card"
                  onClick={() => isUnlocked && onSelectTopic(topic)}
                  style={{ '--node-color': isUnlocked ? subject.color : '#cbd5e1' }}
                >
                  <div className="node-icon" style={{ background: isUnlocked ? subject.color : '#94a3b8' }}>
                    {isCompleted ? '⭐' : (isUnlocked ? topic.icon : '🔒')}
                  </div>
                  <div className="node-info">
                    <h4>Fase {index + 1}: {topic.title}</h4>
                    <p>{topic.desc}</p>
                    <div className="node-status">
                      {isCompleted ? 'Concluída ✓' : (isUnlocked ? 'Pronta para Jogar ▶' : 'Bloqueada')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Em Construção 🚧</h3>
          <p style={{ color: 'var(--text-muted)' }}>As fases desta trilha serão adicionadas em breve.</p>
        </div>
      )}

      <style>{`
        .topic-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .btn-back {
          background: white;
          border: 2px solid var(--border-light);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-muted);
        }

        .btn-back:hover {
          background: var(--background);
          transform: translateX(-5px);
          color: var(--text-main);
        }

        .breadcrumbs {
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: 0.95rem;
        }

        /* Trail Layout */
        .trail-container {
          position: relative;
          padding: 4rem 0;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin-top: 2rem;
        }

        /* The vertical line in the middle */
        .trail-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 8px;
          background: #e2e8f0;
          transform: translateX(-50%);
          border-radius: 4px;
          z-index: 0;
        }

        .trail-node-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
        }

        .align-left { justify-content: flex-start; padding-right: 55%; }
        .align-right { justify-content: flex-end; padding-left: 55%; }

        .trail-node {
          width: 100%;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          position: relative;
          border: 3px solid var(--node-color);
          background: white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        /* Dot connecting to line */
        .trail-node::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 30px;
          height: 6px;
          background: var(--node-color);
          z-index: -1;
        }
        .align-left .trail-node::after { right: -30px; }
        .align-right .trail-node::after { left: -30px; }

        .trail-node:hover:not(.locked) {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .trail-node.locked {
          cursor: not-allowed;
          opacity: 0.8;
          background: #f8fafc;
        }

        .trail-node.completed {
          background: #f0fdf4; /* Light green tint */
          border-color: var(--success);
        }

        .node-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
          margin-bottom: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          border: 4px solid white;
        }

        .locked .node-icon {
          background: #cbd5e1 !important;
          color: #64748b;
        }

        .completed .node-icon {
          background: var(--success) !important;
        }

        .node-info h4 {
          font-size: 1.3rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .node-info p {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .node-status {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.85rem;
          color: var(--node-color);
          background: rgba(0,0,0,0.05);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          display: inline-block;
        }

        .locked .node-status { color: #64748b; }
        .completed .node-status { color: var(--success); background: #dcfce7; }

        /* Responsive */
        @media (max-width: 768px) {
          .trail-line { left: 30px; }
          .align-left, .align-right { 
            padding: 0 0 0 70px; 
            justify-content: flex-start;
          }
          .trail-node::after {
            left: -40px !important;
            right: auto !important;
            width: 40px !important;
          }
          .trail-node { text-align: left; align-items: flex-start; }
          .node-icon { width: 60px; height: 60px; font-size: 1.8rem; position: absolute; left: -85px; top: 50%; transform: translateY(-50%); border-width: 3px; }
        }
      `}</style>
    </div>
  );
}
