import React, { useState, useEffect } from 'react';
import {
  Swords,
  Users,
  Globe,
  UserPlus,
  Zap,
  Copy,
  Check,
  Shield,
  Loader2,
  Play,
  ArrowRight,
  Flame,
  Award,
  Trash2
} from 'lucide-react';
import AvatarDisplay from './AvatarDisplay';
import {
  getOrGenerateFriendCode,
  fetchOnlinePlayers,
  addFriendByCode,
  fetchFriendsDetails,
  removeFriend,
  sendBattleInvite,
  findOrCreateQuickMatch,
  cancelQuickMatch
} from '../services/pvpService';

export default function BattleHub({
  user,
  profile,
  onStartBattle,
  onNavigateSolo
}) {
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'friends' | 'online'
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [addFriendLoading, setAddFriendLoading] = useState(false);
  const [addFriendFeedback, setAddFriendFeedback] = useState(null);

  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [loadingOnline, setLoadingOnline] = useState(false);

  const [friendsList, setFriendsList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState('geral');
  const [searchingMatch, setSearchingMatch] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const myFriendCode = getOrGenerateFriendCode(profile);

  // Carrega lista de amigos e jogadores online
  useEffect(() => {
    loadFriends();
    loadOnlinePlayers();
  }, [profile?.friends]);

  const loadFriends = async () => {
    if (!profile?.friends || profile.friends.length === 0) {
      setFriendsList([]);
      return;
    }
    setLoadingFriends(true);
    const list = await fetchFriendsDetails(profile.friends);
    setFriendsList(list);
    setLoadingFriends(false);
  };

  const loadOnlinePlayers = async () => {
    setLoadingOnline(true);
    const list = await fetchOnlinePlayers(user?.uid);
    setOnlinePlayers(list);
    setLoadingOnline(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myFriendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;

    setAddFriendLoading(true);
    setAddFriendFeedback(null);

    const res = await addFriendByCode(user.uid, profile?.friends || [], friendCodeInput);
    setAddFriendLoading(false);

    if (res.success) {
      setAddFriendFeedback({ type: 'success', text: `Amigo adicionado com sucesso! 🎉` });
      setFriendCodeInput('');
      setFriendsList(prev => [...prev, res.friend]);
    } else {
      setAddFriendFeedback({ type: 'error', text: res.error });
    }
  };

  const handleRemoveFriend = async (friendUid) => {
    const res = await removeFriend(user.uid, profile?.friends || [], friendUid);
    if (res.success) {
      setFriendsList(prev => prev.filter(f => f.uid !== friendUid));
    }
  };

  // Inicia desafio direto a um jogador (amigo ou online)
  const handleChallengePlayer = async (targetUid) => {
    const res = await sendBattleInvite(profile, targetUid, selectedSubject);
    if (res.success) {
      onStartBattle(res.battleId);
    } else {
      alert('Erro ao enviar desafio: ' + res.error);
    }
  };

  // Matchmaking Rápido
  const handleStartQuickMatch = async () => {
    setSearchingMatch(true);
    const res = await findOrCreateQuickMatch(profile, selectedSubject);
    if (res.success) {
      setCurrentMatchId(res.battleId);
      onStartBattle(res.battleId);
    } else {
      setSearchingMatch(false);
      alert(`Não foi possível preparar a batalha: ${res.error || 'verifique sua conexão e tente novamente.'}`);
    }
  };

  const handleCancelQuickMatch = async () => {
    if (currentMatchId) {
      await cancelQuickMatch(currentMatchId);
    }
    setSearchingMatch(false);
  };

  return (
    <div className="battle-hub-view">
      {/* SELETOR DE MODO: SOLO vs MULTIPLAYER */}
      <div className="mode-switch-card">
        <div className="mode-banner">
          <div className="mode-info">
            <span className="mode-tag">Modo Selecionado</span>
            <h2>⚔️ Batalha PvP Online</h2>
            <p>Jogue em tempo real contra amigos ou oponentes da rede!</p>
          </div>
          <button className="switch-to-solo-btn" onClick={onNavigateSolo}>
            🎮 Jogar Sozinho
          </button>
        </div>
      </div>

      {/* CARD DO CÓDIGO DE AMIGO */}
      <div className="my-code-card">
        <div className="code-left">
          <span className="code-label">Seu Código de Amigo:</span>
          <strong className="code-display">{myFriendCode}</strong>
        </div>
        <button className="copy-code-btn" onClick={handleCopyCode}>
          {copiedCode ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
          <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>

      {/* ABAS DO HUB */}
      <div className="hub-tabs">
        <button
          className={`hub-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
          onClick={() => setActiveTab('quick')}
        >
          <Swords size={18} />
          <span>Batalha Rápida</span>
        </button>
        <button
          className={`hub-tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <Users size={18} />
          <span>Amigos ({friendsList.length})</span>
        </button>
        <button
          className={`hub-tab-btn ${activeTab === 'online' ? 'active' : ''}`}
          onClick={() => setActiveTab('online')}
        >
          <Globe size={18} />
          <span>Online ({onlinePlayers.length})</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: BATALHA RÁPIDA */}
      {activeTab === 'quick' && (
        <div className="tab-pane quick-match-pane">
          <div className="subject-selection-box">
            <label className="section-title">Escolha a Disciplina da Batalha:</label>
            <div className="subject-pills">
              {[
                { id: 'geral', label: '🌍 Geral (Misto)' },
                { id: 'matematica', label: '📐 Matemática' },
                { id: 'portugues', label: '📖 Português' },
                { id: 'ciencias', label: '🧪 Ciências' },
                { id: 'historia', label: '🏛️ História' },
                { id: 'geografia', label: '🗺️ Geografia' },
                { id: 'ingles', label: '💬 Inglês' }
              ].map(sub => (
                <button
                  key={sub.id}
                  className={`subj-pill ${selectedSubject === sub.id ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(sub.id)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          <div className="quick-action-hero">
            <div className="hero-icon-wrapper">
              <img src="/duelo.png" alt="Duelo" className="hero-duel-icon" />
            </div>
            <h3>Duelo em Tempo Real</h3>
            <p>
              {selectedSubject === 'matematica'
                ? 'Cabo de guerra matemático! Cada acerto puxa a corda para o seu lado. Alcance a marca para vencer!'
                : '5 perguntas dinâmicas. Quem responder mais rápido e acertar, vence e leva +250 XP!'}
            </p>

            {searchingMatch ? (
              <div className="searching-box">
                <Loader2 size={24} className="spin-icon" />
                <span>Preparando questões do material e buscando oponente...</span>
                <button className="cancel-search-btn" onClick={handleCancelQuickMatch}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button className="start-match-btn" onClick={handleStartQuickMatch}>
                <Play size={20} fill="white" />
                <span>Encontrar Oponente Agora</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: AMIGOS */}
      {activeTab === 'friends' && (
        <div className="tab-pane friends-pane">
          {/* Form para adicionar amigo */}
          <form className="add-friend-form" onSubmit={handleAddFriend}>
            <input
              type="text"
              placeholder="Digite o código do amigo (ex: ANA-8421)"
              value={friendCodeInput}
              onChange={(e) => setFriendCodeInput(e.target.value)}
              className="friend-input"
            />
            <button type="submit" className="add-btn" disabled={addFriendLoading}>
              {addFriendLoading ? <Loader2 size={18} className="spin-icon" /> : <UserPlus size={18} />}
              <span>Adicionar</span>
            </button>
          </form>

          {addFriendFeedback && (
            <div className={`feedback-alert ${addFriendFeedback.type}`}>
              {addFriendFeedback.text}
            </div>
          )}

          {/* Lista de Amigos */}
          <div className="friends-list">
            <h4 className="list-heading">Seus Amigos Conectados:</h4>
            {loadingFriends ? (
              <div className="loading-state">
                <Loader2 size={24} className="spin-icon" />
                <span>Carregando amigos...</span>
              </div>
            ) : friendsList.length === 0 ? (
              <div className="empty-state">
                <Users size={40} color="#cbd5e1" />
                <p>Você ainda não adicionou nenhum amigo.</p>
                <small>Compartilhe seu código ({myFriendCode}) para jogarem juntos!</small>
              </div>
            ) : (
              friendsList.map(friend => (
                <div key={friend.uid} className="player-card">
                  <div className="player-left">
                    <span className="player-avatar"><AvatarDisplay avatar={friend.avatar} size="38px" /></span>
                    <div className="player-info">
                      <div className="player-name-row">
                        <strong>{friend.name}</strong>
                        <span className={`status-dot ${friend.isOnline ? 'online' : 'offline'}`} title={friend.isOnline ? 'Online' : 'Offline'}></span>
                      </div>
                      <span className="player-details">
                        Nível {friend.level} · {friend.xp?.toLocaleString('pt-BR')} XP
                      </span>
                    </div>
                  </div>
                  <div className="player-actions">
                    <button
                      className="challenge-btn"
                      onClick={() => handleChallengePlayer(friend.uid)}
                      title="Desafiar para duelo"
                    >
                      <Swords size={16} />
                      <span>Desafiar</span>
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFriend(friend.uid)}
                      title="Remover amigo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: JOGADORES ONLINE */}
      {activeTab === 'online' && (
        <div className="tab-pane online-pane">
          <div className="online-header-info">
            <Globe size={18} color="#10b981" />
            <span>Jogadores cadastrados no GamificaEdu para desafiar:</span>
          </div>

          <div className="online-list">
            {loadingOnline ? (
              <div className="loading-state">
                <Loader2 size={24} className="spin-icon" />
                <span>Carregando jogadores...</span>
              </div>
            ) : onlinePlayers.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum outro jogador encontrado no momento.</p>
              </div>
            ) : (
              onlinePlayers.map(p => (
                <div key={p.uid} className="player-card">
                  <div className="player-left">
                    <span className="player-avatar"><AvatarDisplay avatar={p.avatar} size="38px" /></span>
                    <div className="player-info">
                      <div className="player-name-row">
                        <strong>{p.name}</strong>
                        <span className="status-dot online" title="Ativo"></span>
                      </div>
                      <span className="player-details">
                        {p.grade === 'Professor' ? 'Professor' : `${p.grade}º Ano`} · Nível {p.level}
                      </span>
                    </div>
                  </div>
                  <div className="player-actions">
                    <button
                      className="challenge-btn"
                      onClick={() => handleChallengePlayer(p.uid)}
                    >
                      <Swords size={16} />
                      <span>Desafiar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ESTILOS DO HUB */}
      <style>{`
        .battle-hub-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeIn 0.3s ease;
        }

        /* BANNER DE MODO */
        .mode-switch-card {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 20px;
          padding: 16px 20px;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3);
        }

        .mode-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .mode-info h2 {
          font-size: 1.25rem;
          font-weight: 900;
          margin-top: 2px;
        }

        .mode-info p {
          font-size: 0.8rem;
          color: #e0e7ff;
          margin-top: 4px;
        }

        .mode-tag {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .switch-to-solo-btn {
          background: rgba(255, 255, 255, 0.95);
          color: #4f46e5;
          border: none;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.2s ease;
        }

        .switch-to-solo-btn:hover {
          transform: scale(1.05);
        }

        /* CARD DO CÓDIGO DE AMIGO */
        .my-code-card {
          background: white;
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(157, 116, 255, 0.25);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .code-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .code-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .code-display {
          font-size: 1.15rem;
          font-weight: 900;
          color: #7c3aed;
          letter-spacing: 1px;
        }

        .copy-code-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f3e8ff;
          color: #7c3aed;
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-code-btn:hover {
          background: #ede9fe;
        }

        /* ABAS */
        .hub-tabs {
          display: flex;
          gap: 8px;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 14px;
        }

        .hub-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: none;
          border: none;
          padding: 10px 8px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hub-tab-btn.active {
          background: white;
          color: #7c3aed;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* PANE DE BATALHA RÁPIDA */
        .quick-match-pane {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .subject-selection-box {
          background: white;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          display: block;
          margin-bottom: 10px;
        }

        .subject-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .subj-pill {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .subj-pill.active {
          background: #7c3aed;
          border-color: #7c3aed;
          color: white;
        }

        .quick-action-hero {
          background: white;
          border-radius: 20px;
          padding: 24px 18px;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          border: 2px dashed rgba(124, 58, 237, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .hero-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f3e8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c3aed;
          margin-bottom: 4px;
        }

        .hero-duel-icon {
          width: 52px;
          height: 52px;
          object-fit: contain;
          animation: floatSwords 2s ease-in-out infinite alternate;
        }

        @keyframes floatSwords {
          from { transform: translateY(-4px) rotate(-5deg); }
          to { transform: translateY(4px) rotate(5deg); }
        }

        .quick-action-hero h3 {
          font-size: 1.2rem;
          font-weight: 900;
          color: #1e293b;
        }

        .quick-action-hero p {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
          max-width: 320px;
        }

        .start-match-btn {
          width: 100%;
          max-width: 300px;
          margin-top: 10px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
          transition: transform 0.2s ease;
        }

        .start-match-btn:hover {
          transform: translateY(-2px);
        }

        .searching-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 12px;
          color: #7c3aed;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .cancel-search-btn {
          background: none;
          border: 1px solid #cbd5e1;
          color: #64748b;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 0.8rem;
          cursor: pointer;
        }

        /* PANE DE AMIGOS */
        .friends-pane {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .add-friend-form {
          display: flex;
          gap: 8px;
        }

        .friend-input {
          flex: 1;
          background: white;
          border: 1px solid #cbd5e1;
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          outline: none;
        }

        .friend-input:focus {
          border-color: #7c3aed;
        }

        .add-btn {
          background: #7c3aed;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .feedback-alert {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .feedback-alert.success {
          background: #d1fae5;
          color: #065f46;
        }

        .feedback-alert.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .list-heading {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
        }

        /* CARDS DE JOGADOR */
        .player-card {
          background: white;
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e2e8f0;
          margin-bottom: 8px;
          transition: transform 0.2s ease;
        }

        .player-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .player-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .player-avatar {
          font-size: 1.8rem;
          background: #f8fafc;
          border-radius: 50%;
          padding: 4px;
        }

        .player-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .player-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.online { background: #10b981; }
        .status-dot.offline { background: #cbd5e1; }

        .player-details {
          font-size: 0.75rem;
          color: #64748b;
        }

        .player-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .challenge-btn {
          background: #f3e8ff;
          color: #7c3aed;
          border: 1px solid #d8b4fe;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .challenge-btn:hover {
          background: #7c3aed;
          color: white;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 6px;
        }

        .remove-btn:hover {
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 30px 16px;
          background: white;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.85rem;
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px;
          color: #7c3aed;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .online-header-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #475569;
          font-weight: 600;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
}
