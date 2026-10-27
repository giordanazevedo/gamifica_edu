import React, { useState } from 'react';
import { Star, Flame, Shield, Calculator, BookOpen, FlaskConical, Landmark, Globe, MessageCircle, Palette, Activity, Heart, Zap, ArrowRight, Sparkles } from 'lucide-react';
import AIStudyQuiz from './AIStudyQuiz';

export default function Dashboard({ onNavigate, xp = 0, streak = 1, completedToday: completedTodayCount = 0 }) {
  const [showAIQuiz, setShowAIQuiz] = useState(false);

  const level = Math.floor(xp / 1000) + 1;
  const levelName = level >= 10 ? 'Mestre' : level >= 5 ? 'Aventureiro' : 'Explorador';
  
  const dailyGoal = 5;
  const completedToday = Math.min(completedTodayCount, dailyGoal);
  const progressPercent = (completedToday / dailyGoal) * 100;

  const openMultiplicationChallenge = () => {
    if (onNavigate) onNavigate('multiplication');
  };

  return (
    <div className="dashboard-view">
      
      {/* Stats Card */}
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value"><Star size={20} color="#eab308" /> {xp.toLocaleString('pt-BR')}</div>
          <div className="stat-label">XP Total</div>
        </div>
        <div className="stat-item">
          <div className="stat-value"><Flame size={20} color="#f97316" /> {streak}</div>
          <div className="stat-label">Dias seguidos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value"><Shield size={20} color="#3b82f6" /> Nível {level}</div>
          <div className="stat-label">{levelName}</div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="progress-card">
        <div className="progress-header">
          <h3>Progresso de Hoje</h3>
          <span className="progress-text">{completedToday}/{dailyGoal} Concluídas</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* SELETOR DE MODO DE JOGO: SOLO vs BATALHA MULTIPLAYER */}
      <div className="game-modes-section">
        <div className="section-header">
          <h3>Escolha Como Jogar:</h3>
        </div>
        <div className="game-modes-grid">
          {/* Modo Solo */}
          <div className="mode-selection-card solo-card" onClick={() => onNavigate && onNavigate('map')}>
            <div className="mode-badge solo-badge">Fases & Trilha</div>
            <div className="mode-icon-circle solo-circle">🎮</div>
            <h4>Jogar Sozinho</h4>
            <p>Avance no mapa, conquiste medalhas e pratique no seu ritmo.</p>
            <span className="mode-action-link">Entrar no Mapa ›</span>
          </div>

          {/* Modo Duelo 1x1 */}
          <div className="mode-selection-card pvp-card" onClick={() => onNavigate && onNavigate('battle')}>
            <div className="mode-badge pvp-badge">⚡ AO VIVO</div>
            <div className="mode-icon-circle pvp-circle">⚔️</div>
            <h4>Duelo 1x1</h4>
            <p>Desafie amigos ou encontre outro jogador para uma partida em tempo real!</p>
            <span className="mode-action-link pvp-link">Encontrar oponente ›</span>
          </div>
        </div>
      </div>

      <button
        className="ai-study-launch"
        onClick={() => setShowAIQuiz(true)}
        type="button"
      >
        <span className="ai-study-launch-icon"><Sparkles size={26} /></span>
        <span className="ai-study-launch-copy">
          <strong>Estudar com IA</strong>
          <small>Crie questões ou receba explicações baseadas no currículo do 9º ano</small>
        </span>
        <ArrowRight size={21} />
      </button>

      {/* Subjects Section */}
      <div className="subjects-section">
        <div className="section-header">
          <h3>Matérias & Trilhas</h3>
          <span className="see-all-link" onClick={() => onNavigate && onNavigate('map')}>Ver todas</span>
        </div>
        
        <div className="subjects-grid">
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'portugues')} style={{ '--card-color': 'rgba(157, 116, 255, 0.15)', '--icon-color': '#9D74FF' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><BookOpen size={24} /></div>
            <h4>Português</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'matematica')} style={{ '--card-color': 'rgba(79, 176, 255, 0.15)', '--icon-color': '#4FB0FF' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><Calculator size={24} /></div>
            <h4>Matemática</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'ciencias')} style={{ '--card-color': 'rgba(16, 185, 129, 0.15)', '--icon-color': '#10B981' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><FlaskConical size={24} /></div>
            <h4>Ciências</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'historia')} style={{ '--card-color': 'rgba(245, 158, 11, 0.15)', '--icon-color': '#F59E0B' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><Landmark size={24} /></div>
            <h4>História</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'geografia')} style={{ '--card-color': 'rgba(6, 182, 212, 0.15)', '--icon-color': '#06B6D4' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><Globe size={24} /></div>
            <h4>Geografia</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'ingles')} style={{ '--card-color': 'rgba(239, 68, 68, 0.15)', '--icon-color': '#EF4444' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><MessageCircle size={24} /></div>
            <h4>Inglês</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'arte')} style={{ '--card-color': 'rgba(236, 72, 153, 0.15)', '--icon-color': '#EC4899' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><Palette size={24} /></div>
            <h4>Arte</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'ed_fisica')} style={{ '--card-color': 'rgba(249, 115, 22, 0.15)', '--icon-color': '#F97316' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><Activity size={24} /></div>
            <h4>Ed. Física</h4>
            <p>Trilha Completa</p>
          </div>
          <div className="subject-card" onClick={() => onNavigate && onNavigate('map', 'religiao')} style={{ '--card-color': 'rgba(139, 92, 246, 0.15)', '--icon-color': '#8B5CF6' }}>
            <div className="subject-icon" style={{ background: 'var(--card-color)', color: 'var(--icon-color)' }}><Heart size={24} /></div>
            <h4>Ensino Relig.</h4>
            <p>Trilha Completa</p>
          </div>
        </div>
      </div>

      {/* Active Challenge */}
      <div
        className="active-challenge-card"
        role="button"
        tabIndex={0}
        onClick={openMultiplicationChallenge}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openMultiplicationChallenge();
          }
        }}
      >
        <div className="challenge-info">
          <span className="challenge-label">DESAFIO ATIVO</span>
          <h3><Zap size={20} color="#fcd34d" /> Multiplicação Rápida</h3>
        </div>
        <button className="play-challenge-btn">Jogar <ArrowRight size={20} /></button>
      </div>

      {showAIQuiz && <AIStudyQuiz onClose={() => setShowAIQuiz(false)} />}

      <style>{`
        .dashboard-view {
          display: flex;
          flex-direction: column;
        }

        .ai-study-launch {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
          padding: 15px;
          border: 1px solid #c4b5fd;
          border-radius: 18px;
          background: linear-gradient(110deg, #f5f3ff, #eff6ff);
          color: #5b21b6;
          cursor: pointer;
          font: inherit;
          text-align: left;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .ai-study-launch:hover {
          box-shadow: 0 8px 20px rgba(91, 33, 182, 0.12);
          transform: translateY(-2px);
        }

        .ai-study-launch-icon {
          display: grid;
          width: 48px;
          height: 48px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 15px;
          background: white;
          color: #7c3aed;
        }

        .ai-study-launch-copy {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          gap: 3px;
        }

        .ai-study-launch-copy strong {
          font-size: 0.95rem;
          font-weight: 900;
        }

        .ai-study-launch-copy small {
          color: #64748b;
          font-size: 0.78rem;
          line-height: 1.35;
        }

        /* Game Modes Section */
        .game-modes-section {
          margin-bottom: 20px;
        }

        .game-modes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mode-selection-card {
          background: white;
          border-radius: 18px;
          padding: 14px 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          border: 2px solid #e2e8f0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          position: relative;
          transition: all 0.2s ease;
        }

        .mode-selection-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .solo-card:hover {
          border-color: #4fb0ff;
        }

        .pvp-card {
          border-color: #d8b4fe;
          background: linear-gradient(180deg, #ffffff 0%, #faf5ff 100%);
        }

        .pvp-card:hover {
          border-color: #7c3aed;
        }

        .mode-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          text-transform: uppercase;
        }

        .solo-badge {
          background: #e0f2fe;
          color: #0284c7;
        }

        .pvp-badge {
          background: #fee2e2;
          color: #dc2626;
          animation: pulseBadge 1.5s infinite;
        }

        @keyframes pulseBadge {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .mode-icon-circle {
          font-size: 1.8rem;
          margin-top: 2px;
        }

        .mode-selection-card h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 2px;
        }

        .mode-selection-card p {
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1.35;
          flex: 1;
        }

        .mode-action-link {
          font-size: 0.75rem;
          font-weight: 800;
          color: #4fb0ff;
          margin-top: 4px;
        }

        .mode-action-link.pvp-link {
          color: #7c3aed;
        }

        /* Stats Card */
        .stats-container {
          display: flex;
          justify-content: space-between;
          background-color: white;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        
        .stat-item:not(:last-child) {
          border-right: 1px solid #f3f4f6;
        }

        .stat-value {
          font-weight: 700;
          color: #111827;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Progress Card */
        .progress-card {
          background-color: white;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .progress-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #111827;
        }

        .progress-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #10b981;
        }

        .progress-bar-container {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: #10b981;
          border-radius: 4px;
        }

        /* Subjects Section */
        .subjects-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #111827;
        }

        .see-all-link {
          color: #6366f1;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .subject-card {
          background-color: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .subject-card:hover {
          transform: translateY(-2px);
        }

        .subject-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 12px;
        }

        .subject-icon.math { background-color: #ede9fe; color: #8b5cf6; }
        .subject-icon.portuguese { background-color: #ffe4e6; color: #f43f5e; }
        .subject-icon.science { background-color: #dcfce7; color: #22c55e; }
        .subject-icon.history { background-color: #fef3c7; color: #f59e0b; }

        .subject-card h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          color: #111827;
        }

        .subject-card p {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Active Challenge */
        .active-challenge-card {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
        }

        .challenge-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .challenge-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          opacity: 0.9;
        }

        .challenge-info h3 {
          margin: 0;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .play-challenge-btn {
          background: transparent;
          border: none;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 420px) {
          .stats-container {
            gap: 4px;
            padding: 12px 6px;
          }

          .stat-value {
            gap: 3px;
            font-size: clamp(0.78rem, 3.7vw, 1rem);
          }

          .stat-value svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
          }

          .stat-label {
            font-size: 0.66rem;
            text-align: center;
          }

          .game-modes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .mode-selection-card {
            min-width: 0;
            padding: 12px 10px;
          }

          .mode-selection-card h4 {
            font-size: 0.88rem;
          }

          .progress-header {
            align-items: flex-start;
            gap: 8px;
          }

          .progress-header h3,
          .progress-text {
            font-size: 0.82rem;
          }

          .active-challenge-card {
            gap: 10px;
            padding: 16px 12px;
          }

          .challenge-info h3 {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
