import React, { useState } from 'react';



export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({ name, grade: '9' });
    }
  };

  return (
    <div className="onboarding-container animate-float" style={{ animationDuration: '8s' }}>
      <div className="glass-card onboarding-card">
        <img src="/logo.svg" alt="Gamifica Edu Logo" style={{ width: '250px', height: 'auto', marginBottom: '1rem', objectFit: 'contain' }} />
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Crie seu perfil para começar a sua jornada de aprendizado.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Qual é o seu nome ou apelido?</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Digite seu nome heróico..."
              required
              className="custom-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem' }}
            disabled={!name.trim()}
          >
            Começar a Aventura ▶
          </button>
        </form>
      </div>

      <style>{`
        .onboarding-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 2rem;
        }

        .onboarding-card {
          width: 100%;
          max-width: 500px;
          padding: 3rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
        }

        .input-group {
          margin-bottom: 2rem;
          text-align: left;
        }

        .input-group label {
          display: block;
          font-weight: 800;
          margin-bottom: 0.8rem;
          color: var(--text-main);
        }

        .custom-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-full);
          border: 2px solid var(--border-light);
          font-size: 1.1rem;
          font-weight: 600;
          outline: none;
          transition: all 0.2s;
          background: var(--background);
          color: var(--text-main);
          font-family: inherit;
        }

        .custom-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(157, 116, 255, 0.2);
        }

        .grades-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .grade-option {
          padding: 1rem;
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
          text-align: center;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-muted);
        }

        .grade-option:hover {
          border-color: var(--g-color);
          background: rgba(0,0,0,0.02);
        }

        .grade-option.selected {
          border-color: var(--g-color);
          background: var(--g-color);
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
