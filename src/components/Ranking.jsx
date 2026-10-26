import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown, Flame, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import AvatarDisplay from './AvatarDisplay';

export default function Ranking({ fetchRanking, currentUid, onBack }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRanking = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRanking();
      setPlayers(data);
    } catch (e) {
      setError('Não foi possível carregar o ranking. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={22} color="#FFD700" />;
    if (rank === 2) return <Medal size={22} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={22} color="#CD7F32" />;
    return <span className="rank-number">#{rank}</span>;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const level = (xp) => Math.floor(xp / 1000) + 1;
  const levelName = (xp) => {
    const l = level(xp);
    if (l >= 10) return 'Mestre';
    if (l >= 5) return 'Aventureiro';
    return 'Explorador';
  };

  const myRank = players.findIndex(p => p.uid === currentUid) + 1;

  return (
    <div className="ranking-view">
      {/* Header */}
      <div className="ranking-header">
        <div className="ranking-title-row">
          <Trophy size={28} color="#FFD700" />
          <h2>Ranking Global</h2>
          <button className="refresh-btn" onClick={loadRanking} disabled={loading} title="Atualizar">
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
        </div>
        {myRank > 0 && (
          <div className="my-rank-banner">
            <Star size={16} color="#eab308" />
            <span>Sua posição: <strong>#{myRank}</strong> de {players.length} jogadores</span>
          </div>
        )}
      </div>

      {/* Podium Top 3 */}
      {!loading && players.length >= 3 && (
        <div className="podium">
          {/* 2nd place */}
          <div className="podium-spot silver">
            <div className="podium-avatar"><AvatarDisplay avatar={players[1]?.avatar} size="46px" /></div>
            <Medal size={20} color="#C0C0C0" />
            <div className="podium-name">{players[1]?.name?.split(' ')[0] || '---'}</div>
            <div className="podium-xp">{(players[1]?.xp || 0).toLocaleString('pt-BR')} XP</div>
            <div className="podium-block silver-block">2º</div>
          </div>

          {/* 1st place */}
          <div className="podium-spot gold">
            <Crown size={24} color="#FFD700" />
            <div className="podium-avatar large"><AvatarDisplay avatar={players[0]?.avatar} size="58px" /></div>
            <div className="podium-name">{players[0]?.name?.split(' ')[0] || '---'}</div>
            <div className="podium-xp">{(players[0]?.xp || 0).toLocaleString('pt-BR')} XP</div>
            <div className="podium-block gold-block">1º</div>
          </div>

          {/* 3rd place */}
          <div className="podium-spot bronze">
            <div className="podium-avatar"><AvatarDisplay avatar={players[2]?.avatar} size="46px" /></div>
            <Medal size={20} color="#CD7F32" />
            <div className="podium-name">{players[2]?.name?.split(' ')[0] || '---'}</div>
            <div className="podium-xp">{(players[2]?.xp || 0).toLocaleString('pt-BR')} XP</div>
            <div className="podium-block bronze-block">3º</div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="ranking-list">
        {loading && (
          <div className="ranking-loading">
            <Loader2 size={32} className="spin" />
            <p>Carregando ranking...</p>
          </div>
        )}

        {error && (
          <div className="ranking-error">
            <p>{error}</p>
            <button onClick={loadRanking} className="retry-btn">Tentar novamente</button>
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="ranking-empty">
            <Trophy size={48} color="#d1d5db" />
            <p>Nenhum jogador ainda. Seja o primeiro!</p>
          </div>
        )}

        {!loading && players.map((player, i) => (
          <div
            key={player.uid}
            className={`rank-item ${getRankClass(i + 1)} ${player.uid === currentUid ? 'is-me' : ''}`}
          >
            <div className="rank-pos">
              {getRankIcon(i + 1)}
            </div>
            <div className="rank-avatar"><AvatarDisplay avatar={player.avatar} size="36px" /></div>
            <div className="rank-info">
              <span className="rank-player-name">
                {player.name}
                {player.uid === currentUid && <span className="you-badge">Você</span>}
              </span>
              <span className="rank-meta">
                Nível {level(player.xp)} · {player.grade === 'Professor' ? 'Professor' : `${player.grade}º Ano`} · ⚔️ {player.pvpWins || 0} vitórias
              </span>
            </div>
            <div className="rank-score">
              <Star size={14} color="#eab308" />
              <span>{(player.xp || 0).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .ranking-view {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .ranking-header {
          margin-bottom: 16px;
        }

        .ranking-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .ranking-title-row h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 900;
          color: #111827;
          flex: 1;
        }

        .refresh-btn {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: #6b7280;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .refresh-btn:hover:not(:disabled) {
          background: #f3f4f6;
          color: #111827;
        }
        .refresh-btn:disabled { opacity: 0.5; }

        .my-rank-banner {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #fef9c3, #fef3c7);
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 8px 14px;
          font-size: 0.9rem;
          color: #92400e;
          font-weight: 600;
        }

        /* Podium */
        .podium {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 16px 8px;
          background: linear-gradient(135deg, #1a162b, #2d2450);
          border-radius: 20px;
        }

        .podium-spot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
          max-width: 110px;
        }

        .podium-avatar {
          font-size: 1.8rem;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .podium-avatar.large {
          font-size: 2.2rem;
          width: 58px;
          height: 58px;
          background: rgba(255,215,0,0.15);
          border: 2px solid rgba(255,215,0,0.4);
        }

        .podium-name {
          color: white;
          font-weight: 800;
          font-size: 0.85rem;
          text-align: center;
        }

        .podium-xp {
          color: rgba(255,255,255,0.6);
          font-size: 0.7rem;
          font-weight: 600;
        }

        .podium-block {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1rem;
          color: white;
          border-radius: 8px 8px 0 0;
          margin-top: 6px;
          padding: 8px 0;
        }

        .gold-block { background: linear-gradient(135deg, #f59e0b, #d97706); height: 60px; }
        .silver-block { background: linear-gradient(135deg, #9ca3af, #6b7280); height: 44px; }
        .bronze-block { background: linear-gradient(135deg, #b45309, #92400e); height: 36px; }

        /* List */
        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ranking-loading, .ranking-empty, .ranking-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 20px;
          color: #9ca3af;
          font-weight: 600;
        }

        .retry-btn {
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 8px 18px;
          font-weight: 700;
          cursor: pointer;
        }

        .rank-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border-radius: 14px;
          padding: 12px 14px;
          border: 1px solid #f3f4f6;
          transition: transform 0.15s;
        }

        .rank-item:hover { transform: translateX(2px); }

        .rank-item.is-me {
          border-color: #a78bfa;
          background: linear-gradient(135deg, #f5f3ff, #ede9fe);
        }

        .rank-item.rank-gold { border-left: 4px solid #FFD700; }
        .rank-item.rank-silver { border-left: 4px solid #C0C0C0; }
        .rank-item.rank-bronze { border-left: 4px solid #CD7F32; }

        .rank-pos {
          width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rank-number {
          font-weight: 800;
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .rank-avatar {
          font-size: 1.4rem;
          width: 36px;
          height: 36px;
          background: #f3f4f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rank-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .rank-player-name {
          font-weight: 800;
          font-size: 0.95rem;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .you-badge {
          background: #6366f1;
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 6px;
          letter-spacing: 0.3px;
        }

        .rank-meta {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 600;
        }

        .rank-score {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 800;
          font-size: 0.9rem;
          color: #111827;
          white-space: nowrap;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 420px) {
          .ranking-title-row {
            gap: 8px;
          }

          .ranking-title-row h2 {
            min-width: 0;
            font-size: 1.2rem;
          }

          .rank-item {
            gap: 7px;
            padding: 10px 8px;
          }

          .rank-info {
            min-width: 0;
          }

          .rank-player-name,
          .rank-meta {
            overflow-wrap: anywhere;
          }

          .rank-player-name {
            font-size: 0.84rem;
          }

          .rank-meta {
            font-size: 0.67rem;
          }

          .rank-score {
            gap: 2px;
            font-size: 0.78rem;
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
