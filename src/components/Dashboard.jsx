import React, { useState } from 'react';
import StopGame from './StopGame';
import MemoryGame from './MemoryGame';
import SpinWheel from './SpinWheel';

export default function Dashboard({ user, onNavigate }) {
  const [showStop, setShowStop] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  // Mock data for friends
  const friends = [
    { name: 'Lucas', avatar: '👦', status: 'online' },
    { name: 'Mari', avatar: '👧', status: 'offline' },
    { name: 'João', avatar: '🧑', status: 'playing' }
  ];

  return (
    <div className="dashboard-light">
      {/* Top Header */}
      <header className="dash-header">
        <div className="dash-profile">
          <div className="dash-avatar-wrapper">
            <span className="dash-avatar">{user?.avatar || '👦🏽'}</span>
          </div>
          <div className="dash-streak">
            🔥 <span className="streak-count">1</span>
          </div>
        </div>
        <div className="dash-actions">
          <div className="dash-gems">
            💎 <span>150</span>
          </div>
          <button className="icon-btn">👥</button>
        </div>
      </header>

      <main className="dash-content">
        {/* Featured Banner */}
        <div className="dash-banner" onClick={() => onNavigate('map')}>
          <div className="banner-content">
            <span className="banner-badge">1</span>
            <h2>Trilha do 9º Ano</h2>
            <div className="banner-progress">
              <span className="progress-text">0 / 30 Concluídos</span>
              <div className="progress-bar"><div className="progress-fill" style={{width: '0%'}}></div></div>
            </div>
          </div>
          <button className="banner-btn">Começar!</button>
          <div className="banner-bg-icon">🗺️</div>
        </div>

        {/* Confronto Recomendado */}
        <h3 className="section-title">Confronto Recomendado</h3>
        <div className="match-card" onClick={() => onNavigate('stop')}>
          <div className="match-avatar">👧</div>
          <div className="match-info">
            <h4>Mari <span>🇧🇷</span></h4>
            <p className="match-status">☀️ Há 3 dias</p>
            <span className="match-tag">AMIGA</span>
          </div>
          <button className="match-action-btn">
            ⚔️
          </button>
        </div>

        {/* Estatísticas / Minigames */}
        <div className="section-header">
          <h3 className="section-title">Minigames</h3>
          <span className="see-all">Ver todos</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card" onClick={() => setShowStop(true)}>
            <div className="stat-icon" style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444'}}>🛑</div>
            <h4>Stop</h4>
            <p>Jogue agora</p>
          </div>
          <div className="stat-card" onClick={() => setShowMemory(true)}>
            <div className="stat-icon" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>🧠</div>
            <h4>Memória</h4>
            <p>Ache os pares</p>
          </div>
          <div className="stat-card" onClick={() => setShowWheel(true)}>
            <div className="stat-icon" style={{background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b'}}>🎡</div>
            <h4>Roleta</h4>
            <p>Prêmios</p>
          </div>
        </div>

        {/* Amigos */}
        <div className="section-header">
          <h3 className="section-title">Amigos <span>{friends.length}</span></h3>
          <span className="see-all">Ver todos</span>
        </div>
        <div className="friends-row">
          {friends.map((friend, i) => (
            <div key={i} className="friend-card">
              <div className="friend-avatar-lg">{friend.avatar}</div>
              <span>{friend.name}</span>
            </div>
          ))}
          <div className="friend-card add-friend">
            <div className="friend-avatar-lg add">➕</div>
            <span>Adicionar</span>
          </div>
        </div>

        <div style={{height: '100px'}}></div> {/* Spacer for bottom bar and play button */}
      </main>

      {/* Floating Play Button */}
      <div className="play-button-wrapper">
        <button className="btn-play-huge" onClick={() => onNavigate('map')}>
          Jogar
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <span className="nav-icon">♟️</span>
          <span className="nav-label">Início</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate('map')}>
          <span className="nav-icon">🗺️</span>
          <span className="nav-label">Trilha</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🎓</span>
          <span className="nav-label">Aprender</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">≡</span>
          <span className="nav-label">Mais</span>
          <span className="nav-badge">4</span>
        </button>
      </nav>

      {/* Modals for Minigames */}
      {showStop && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StopGame 
            onExit={() => setShowStop(false)}
            onComplete={() => setShowStop(false)}
          />
        </div>
      )}

      {showMemory && (
        <MemoryGame 
          subjectId="geral"
          onClose={() => setShowMemory(false)} 
          onWin={() => setShowMemory(false)} 
        />
      )}

      {showWheel && (
        <SpinWheel 
          onClose={() => setShowWheel(false)} 
          onWin={() => setShowWheel(false)} 
        />
      )}

      <style>{`
        .dashboard-light {
          background-color: #F8FAFC;
          color: #1E293B;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: relative;
        }

        /* Header */
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.95);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid #E2E8F0;
        }

        .dash-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dash-avatar-wrapper {
          background: #F1F5F9;
          border-radius: 8px;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        .dash-streak {
          display: flex; align-items: center; gap: 4px;
          color: #64748B;
          font-weight: 700;
        }
        .streak-count { color: #1E293B; }

        .dash-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .dash-gems {
          display: flex; align-items: center; gap: 6px;
          color: #3B82F6; font-weight: 700;
        }
        .dash-gems span { color: #1E293B; }
        
        .icon-btn {
          background: none; border: none; color: #1E293B; font-size: 1.5rem; padding: 0; cursor: pointer;
        }

        /* Content */
        .dash-content {
          padding: 0 20px;
        }

        .section-title {
          font-size: 1.1rem;
          color: #1E293B;
          margin: 25px 0 15px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 25px 0 15px 0;
        }
        .section-header h3 { margin: 0; font-size: 1.1rem; color: #1E293B; display: flex; align-items: center; gap: 8px; }
        .section-header h3 span { background: #E2E8F0; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; color: #64748B; }
        .see-all { color: #64748B; font-size: 0.9rem; font-weight: 600; cursor: pointer; }

        /* Banner */
        .dash-banner {
          background: linear-gradient(135deg, #22C55E, #16A34A);
          color: white;
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          cursor: pointer;
          min-height: 140px;
          margin-top: 10px;
          box-shadow: 0 10px 25px rgba(22, 163, 74, 0.3);
        }
        .banner-content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 8px; }
        .banner-badge { background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; width: fit-content; display:flex; align-items:center; gap:5px; }
        .dash-banner h2 { margin: 0; font-size: 1.5rem; font-weight: 800; }
        .banner-progress { margin-top: 10px; width: 200px; }
        .progress-text { font-size: 0.8rem; color: #ECFDF5; margin-bottom: 5px; display: block; }
        .progress-bar { background: rgba(0,0,0,0.2); height: 8px; border-radius: 4px; overflow: hidden; }
        .progress-fill { background: #ffffff; height: 100%; }
        
        .banner-btn {
          background: #ffffff;
          color: #16A34A;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 800;
          z-index: 2;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .banner-bg-icon {
          position: absolute;
          right: -20px;
          top: -20px;
          font-size: 8rem;
          opacity: 0.15;
          transform: rotate(15deg);
        }

        /* Match Card */
        .match-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .match-avatar {
          width: 50px; height: 50px;
          background: #F1F5F9;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
        }
        .match-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .match-info h4 { margin: 0; font-size: 1.1rem; display: flex; align-items: center; gap: 5px; color: #1E293B; }
        .match-status { margin: 0; font-size: 0.8rem; color: #64748B; }
        .match-tag {
          background: #D1FAE5; color: #059669; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; width: fit-content; margin-top: 2px;
        }
        .match-action-btn {
          background: #22C55E;
          color: white;
          border: none;
          width: 40px; height: 40px;
          border-radius: 8px;
          font-size: 1.2rem;
          box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .stat-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 15px 10px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .stat-icon {
          width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
        }
        .stat-card h4 { margin: 0; font-size: 1rem; color: #1E293B; }
        .stat-card p { margin: 0; font-size: 0.75rem; color: #64748B; }

        /* Friends */
        .friends-row {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: none;
        }
        .friends-row::-webkit-scrollbar { display: none; }
        .friend-card {
          display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 70px;
        }
        .friend-avatar-lg {
          width: 70px; height: 70px; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .friend-avatar-lg.add {
          background: #F8FAFC; border: 2px dashed #CBD5E1; font-size: 1.5rem; color: #64748B;
        }
        .friend-card span { font-size: 0.9rem; font-weight: 600; color: #1E293B; }

        /* Play Button */
        .play-button-wrapper {
          position: fixed;
          bottom: 75px;
          left: 0; right: 0;
          padding: 0 20px;
          z-index: 100;
        }
        .btn-play-huge {
          width: 100%;
          background: #76B947;
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 1.5rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 0 #4A7A2B;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .btn-play-huge:active { transform: translateY(4px); box-shadow: none; }

        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #ffffff;
          display: flex;
          justify-content: space-around;
          padding: 10px 0 20px 0;
          border-top: 1px solid #E2E8F0;
          z-index: 90;
        }
        .nav-item {
          background: none; border: none; color: #9CA3AF;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          cursor: pointer; position: relative;
        }
        .nav-item.active { color: #9D74FF; }
        .nav-icon { font-size: 1.5rem; }
        .nav-label { font-size: 0.75rem; font-weight: 600; }
        .nav-badge {
          position: absolute; top: -5px; right: -5px; background: #EF4444; color: white; font-size: 0.6rem; font-weight: bold; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
      `}</style>
    </div>
  );
}
