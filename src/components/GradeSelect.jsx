import React from 'react';

const grades = [
  { id: '9', name: '9º Ano', color: '#F59E0B', desc: '✨ Disponível', active: true },
];

export default function GradeSelect({ subject, onSelectGrade, onBack }) {
  return (
    <div className="grade-container animate-float" style={{ animationDuration: '6s' }}>
      <div className="grade-header">
        <button className="btn-back" onClick={onBack}>⬅ Voltar</button>
        <div className="subject-badge" style={{ background: subject.color }}>
          <span className="icon">{subject.icon}</span>
          <span className="name">{subject.name}</span>
        </div>
      </div>

      <div className="hero-section glass">
        <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>
          Turma de Aprendizado
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Atualmente, os desafios de {subject.name} estão disponíveis para o <strong>9º Ano</strong>.
        </p>
      </div>

      <div className="grades-grid">
        {grades.map(grade => (
          <div 
            key={grade.id} 
            className={`grade-card glass-card ${!grade.active ? 'disabled-grade' : 'active-grade'}`}
            style={{ '--grade-color': grade.color, opacity: grade.active ? 1 : 0.65, cursor: grade.active ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (grade.active) onSelectGrade(grade.id);
            }}
          >
            <div className="grade-number">{grade.id}º</div>
            <div className="grade-info">
              <h3>{grade.name}</h3>
              <span className="difficulty" style={{ color: grade.color }}>{grade.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .grade-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .grade-header {
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

        .subject-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          border-radius: var(--radius-full);
          color: white;
          font-weight: 800;
          box-shadow: var(--shadow-md);
        }

        .grades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .grade-card {
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          border-left: 6px solid var(--grade-color);
        }

        .grade-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: var(--shadow-lg);
        }

        .grade-number {
          font-size: 3rem;
          font-weight: 900;
          color: var(--grade-color);
          opacity: 0.8;
        }

        .grade-info h3 {
          font-size: 1.5rem;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .difficulty {
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
