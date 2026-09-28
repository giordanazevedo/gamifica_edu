import React from 'react';

const subjects = [
  { id: 'portugues', name: 'Língua Portuguesa', icon: '📚', color: '#9D74FF', desc: 'Gramática, textos e literatura', bg: 'linear-gradient(135deg, #F3E8FF, #E0C8FF)' },
  { id: 'matematica', name: 'Matemática', icon: '🔢', color: '#4FB0FF', desc: 'Cálculos e raciocínio lógico', bg: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)' },
  { id: 'ciencias', name: 'Ciências da Natureza', icon: '🔬', color: '#10B981', desc: 'Física, química e biologia', bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' },
  { id: 'historia', name: 'História', icon: '🏺', color: '#F59E0B', desc: 'Viagem pelo passado', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
  { id: 'geografia', name: 'Geografia', icon: '🌍', color: '#06B6D4', desc: 'Espaço, mapa e mundo', bg: 'linear-gradient(135deg, #CFFAFE, #A5F3FC)' },
  { id: 'ingles', name: 'Língua Inglesa', icon: '🗣️', color: '#EF4444', desc: 'Idiomas e comunicação', bg: 'linear-gradient(135deg, #FEE2E2, #FECACA)' },
  { id: 'arte', name: 'Arte', icon: '🎨', color: '#EC4899', desc: 'Cores, formas e expressão', bg: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)' },
  { id: 'ed_fisica', name: 'Educação Física', icon: '⚽', color: '#F97316', desc: 'Corpo e movimento', bg: 'linear-gradient(135deg, #FFEDD5, #FDBA74)' },
  { id: 'religiao', name: 'Ensino Religioso', icon: '🕊️', color: '#8B5CF6', desc: 'Diversidade e ética', bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' },
];

export default function Home({ onStartGame }) {
  return (
    <div className="home-container animate-float" style={{ animationDuration: '8s' }}>
      <div className="hero-section glass">
        <div className="hero-content">
          <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            A aventura do conhecimento!
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Escolha uma disciplina abaixo, vença os desafios, acumule XP e se torne uma lenda do aprendizado do 9º ano.
          </p>
        </div>
        <div className="hero-decor hero-decor-1">✨</div>
        <div className="hero-decor hero-decor-2">🚀</div>
      </div>

      <div className="section-header">
        <h3 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Escolha seu Mundo</h3>
        <span className="badge">{subjects.length} Mundos Disponíveis</span>
      </div>
      
      <div className="subjects-grid">
        {subjects.map(subject => (
          <div 
            key={subject.id} 
            className="subject-card glass-card"
            style={{ '--card-color': subject.color }}
            onClick={() => onStartGame(subject)}
          >
            <div className="card-bg" style={{ background: subject.bg }}></div>
            <div className="subject-icon-wrapper">
              <div className="subject-icon">{subject.icon}</div>
            </div>
            <div className="subject-info">
              <h4>{subject.name}</h4>
              <p>{subject.desc}</p>
            </div>
            <div className="play-button btn btn-primary" style={{ width: '100%', background: subject.color, boxShadow: `0 8px 20px -5px ${subject.color}80` }}>
              Explorar Mundo
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hero-section {
          padding: 4rem 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.85);
        }

        .hero-decor {
          position: absolute;
          font-size: 4rem;
          opacity: 0.2;
          animation: float 6s ease-in-out infinite;
        }

        .hero-decor-1 { top: 20%; left: 5%; }
        .hero-decor-2 { bottom: 20%; right: 5%; animation-delay: -3s; }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .badge {
          background: var(--primary-light);
          color: white;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        .subject-card {
          padding: 2rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: white;
        }

        .card-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120px;
          z-index: 0;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }

        .subject-card:hover {
          transform: translateY(-12px);
          box-shadow: var(--shadow-lg);
        }

        .subject-icon-wrapper {
          position: relative;
          z-index: 1;
          width: 90px;
          height: 90px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 30px;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-md);
          border: 4px solid white;
        }

        .subject-icon {
          font-size: 3.5rem;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .subject-card:hover .subject-icon {
          transform: scale(1.15) rotate(5deg);
        }

        .subject-info {
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .subject-info h4 {
          font-size: 1.6rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .subject-info p {
          color: var(--text-muted);
          font-size: 1rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
