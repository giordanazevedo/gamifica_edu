import { useState, useEffect, useCallback, useMemo } from 'react';
import { Flame, Star, ChevronLeft, Home, Map as MapIcon, Trophy, User, Swords } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import Onboarding from './components/Onboarding';
import FirstVisitSetup from './components/FirstVisitSetup';
import MainMap from './components/MainMap';
import QuizGame from './components/QuizGame';
import Dashboard from './components/Dashboard';
import ShopModal from './components/ShopModal';
import Ranking from './components/Ranking';
import BattleHub from './components/BattleHub';
import PvPBattleArena from './components/PvPBattleArena';
import BattleInviteModal from './components/BattleInviteModal';
import AvatarDisplay from './components/AvatarDisplay';
import MultiplicationChallenge from './components/MultiplicationChallenge';
import { updatePresence, getOrGenerateFriendCode } from './services/pvpService';

function App() {
  const {
    user,
    profile,
    loading,
    error: authError,
    register,
    login,
    loginWithGoogle,
    logout,
    updateAccountProfile,
    completeFirstVisitSetup,
    saveProgress,
    addQuizReward,
    addBattleReward,
    fetchRanking,
  } = useAuth();

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('misturado');
  const [showShop, setShowShop] = useState(false);
  const [activeMapSubject, setActiveMapSubject] = useState(null);
  const [activeBattleId, setActiveBattleId] = useState(null);

  // Estado local do jogo (sincronizado com profile do Firebase)
  const [xp, setXp] = useState(0);
  const [medals, setMedals] = useState([]);
  const [lives, setLives] = useState(3);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [avatar, setAvatar] = useState('👦🏽');
  const [unlockedAvatars, setUnlockedAvatars] = useState(['👦🏽']);
  const [streak, setStreak] = useState(1);
  const presenceName = profile?.name || 'Jogador';
  const storedFriendCode = profile?.friendCode;
  const presenceFriendCode = useMemo(
    () => getOrGenerateFriendCode({ name: presenceName, friendCode: storedFriendCode }),
    [presenceName, storedFriendCode]
  );

  // Sincroniza estado local quando o perfil do Firebase carrega
  useEffect(() => {
    if (profile) {
      setXp(profile.xp || 0);
      setMedals(profile.medals || []);
      setCompletedTopics(profile.completedTopics || []);
      setAvatar(profile.avatar || '👦🏽');
      setUnlockedAvatars(profile.unlockedAvatars || ['👦🏽']);
      setStreak(profile.streak || 1);
    }
  }, [profile]);

  // Atualiza presença online e código de amigo
  useEffect(() => {
    if (user?.uid && presenceFriendCode) {
      const refreshPresence = () => {
        updatePresence(user.uid, document.visibilityState === 'visible', presenceFriendCode);
      };
      refreshPresence();
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          updatePresence(user.uid, true);
        }
      }, 30000);
      document.addEventListener('visibilitychange', refreshPresence);
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', refreshPresence);
        updatePresence(user.uid, false);
      };
    }
  }, [user?.uid, presenceFriendCode]);

  // Salva no Firebase toda vez que XP/medals/topics mudam
  const persistProgress = useCallback((updates) => {
    saveProgress(updates);
  }, [saveProgress]);

  const handleMinigameWin = (earnedXp) => {
    const newXp = xp + earnedXp;
    setXp(newXp);
    setLives(prev => Math.min(3, prev + 1));
    persistProgress({ xp: newXp, medals, completedTopics, avatar, unlockedAvatars, streak });
  };

  // Regeneração de vidas
  useEffect(() => {
    if (lives < 3 && currentScreen === 'map') {
      const timer = setTimeout(() => setLives(3), 30000);
      return () => clearTimeout(timer);
    }
  }, [lives, currentScreen]);

  // === Handlers de Autenticação ===
  const handleOnboardingComplete = async ({ action, ...data }) => {
    if (action === 'login') {
      return await login({ email: data.email, password: data.password });
    } else if (action === 'register') {
      return await register(data);
    } else if (action === 'google') {
      return await loginWithGoogle(data);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('dashboard');
    setXp(0);
    setMedals([]);
    setCompletedTopics([]);
    setAvatar('👦🏽');
    setUnlockedAvatars(['👦🏽']);
    setStreak(1);
    setLives(3);
  };

  // === Handlers de Jogo ===
  const handleNavigate = (screen, subjectId = null) => {
    if (subjectId) setActiveMapSubject(subjectId);
    setCurrentScreen(screen);
  };

  const handleTopicSelect = (subject, topic, difficulty) => {
    if (lives <= 0) {
      alert('Você está sem vidas! Espere um pouco para regenerá-las.');
      return;
    }
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setSelectedDifficulty(difficulty);
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = async (earnedXp, isFailure) => {
    const topicKey = `${selectedSubject.id}_${profile?.grade}_${selectedTopic.id}`;
    const medal = earnedXp > 0
      ? {
        id: topicKey,
        icon: selectedSubject.icon,
        name: `Mestre em ${selectedTopic.title}`,
      }
      : null;

    try {
      const updatedProfile = await addQuizReward({
        earnedXp,
        completedTopicKey: isFailure ? null : topicKey,
        medal,
      });
      setXp(updatedProfile.xp);
      setCompletedTopics(updatedProfile.completedTopics);
      setMedals(updatedProfile.medals);
      if (isFailure) setLives(prev => Math.max(0, prev - 1));
      setCurrentScreen('map');
      return { success: true };
    } catch (error) {
      console.error('Não foi possível salvar o resultado do quiz:', error);
      throw error;
    }
  };

  const handleBuyAvatar = (id, cost) => {
    const newXp = xp - cost;
    const newUnlocked = [...unlockedAvatars, id];
    setXp(newXp);
    setUnlockedAvatars(newUnlocked);
    setAvatar(id);
    persistProgress({ xp: newXp, medals, completedTopics, avatar: id, unlockedAvatars: newUnlocked, streak });
  };

  const handleEquipAvatar = (id) => {
    setAvatar(id);
    persistProgress({ xp, medals, completedTopics, avatar: id, unlockedAvatars, streak });
  };

  // === Loading Screen ===
  if (loading) {
    return (
      <div className="mobile-app-container">
        <style>{`
          .mobile-app-container {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            justify-content: center;
            background: #fff7f2;
          }

          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 100vh;
            min-height: 100dvh;
            padding: 32px 24px;
            gap: 12px;
            color: #1e293b;
            background: radial-gradient(ellipse at 50% 35%, #ffffff 0%, #fffaf5 60%, #fff1f2 100%);
            text-align: center;
          }

          .loading-logo {
            display: block;
            width: min(78vw, 300px);
            height: auto;
            max-height: 180px;
            object-fit: contain;
            margin-bottom: 14px;
            animation: loading-logo-arrive 700ms ease-out both;
          }

          .loading-title {
            font-size: clamp(1.05rem, 4vw, 1.3rem);
            font-weight: 800;
            letter-spacing: -0.025em;
          }

          .loading-caption {
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .loading-dots {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 18px;
            margin-top: 4px;
          }

          .loading-dots i {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #dc2626;
            animation: loading-pulse 900ms ease-in-out infinite alternate;
          }

          .loading-dots i:nth-child(2) { animation-delay: 180ms; }
          .loading-dots i:nth-child(3) { animation-delay: 360ms; }

          @keyframes loading-pulse {
            from { opacity: 0.35; transform: translateY(0); }
            to { opacity: 1; transform: translateY(-4px); }
          }

          @keyframes loading-logo-arrive {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div className="loading-screen" role="status" aria-live="polite">
          <img src="/logo.png" alt="GamificaEdu" className="loading-logo" />
          <p className="loading-title">Seu aprendizado, uma nova aventura.</p>
          <span className="loading-caption">Preparando sua jornada</span>
          <div className="loading-dots" aria-hidden="true"><i /><i /><i /></div>
        </div>
      </div>
    );
  }

  // === Onboarding (não autenticado) ===
  if (!user || !profile) {
    return (
      <div className="mobile-app-container">
        <div className="mobile-app-content">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  if (profile.onboardingCompleted === false) {
    return (
      <div className="mobile-app-container">
        <div className="mobile-app-content">
          <FirstVisitSetup
            profile={profile}
            onComplete={completeFirstVisitSetup}
          />
        </div>
      </div>
    );
  }

  // === App Principal (autenticado) ===
  return (
    <div className="mobile-app-container">
      <div className="mobile-app-content">

        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="profile-info">
            {currentScreen !== 'dashboard' && (
              <button
                className="back-btn"
                onClick={() => {
                  if (currentScreen === 'quiz') setCurrentScreen('map');
                  else if (currentScreen === 'pvp_arena') setCurrentScreen('battle');
                  else setCurrentScreen('dashboard');
                }}
                title="Voltar"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <div className="avatar-img" onClick={() => setShowShop(true)} style={{ cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AvatarDisplay avatar={avatar} size="46px" />
            </div>
            <div className="user-details">
              <h2>{profile?.name} <span>›</span></h2>
              <p>{profile?.role === 'professor' ? 'Professor' : '9º Ano'} · GamificaEdu</p>
            </div>
            <div className="header-actions">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }} title="Dias Seguidos">
                <Flame size={18} color="#f97316" /> {streak}
              </span>
              <span onClick={() => setShowShop(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer' }} title="XP Atual">
                <Star size={18} color="#eab308" /> {xp.toLocaleString('pt-BR')}
              </span>
              <button onClick={handleLogout} className="logout-btn" title="Sair">
                ⏻
              </button>
            </div>
          </div>
        </header>

        <main className="mobile-main">
          {currentScreen === 'dashboard' && (
            <Dashboard
              xp={xp}
              streak={streak}
              completedTopics={completedTopics}
              onNavigate={handleNavigate}
            />
          )}
          {currentScreen === 'multiplication' && (
            <MultiplicationChallenge
              onComplete={(earnedXp) => {
                if (earnedXp > 0) handleMinigameWin(earnedXp);
                setCurrentScreen('dashboard');
              }}
              onExit={() => setCurrentScreen('dashboard')}
            />
          )}
          {currentScreen === 'map' && (
            <MainMap
              userGrade={profile.grade}
              completedTopics={completedTopics}
              onSelectTopic={handleTopicSelect}
              initialSubjectId={activeMapSubject}
            />
          )}
          {currentScreen === 'quiz' && (
            <QuizGame
              subject={selectedSubject}
              grade={profile.grade}
              topic={selectedTopic}
              initialDifficulty={selectedDifficulty}
              onComplete={handleQuizComplete}
              onExit={() => setCurrentScreen('map')}
            />
          )}
          {currentScreen === 'ranking' && (
            <Ranking
              fetchRanking={fetchRanking}
              currentUid={user.uid}
              onBack={() => setCurrentScreen('dashboard')}
            />
          )}
          {currentScreen === 'battle' && (
            <BattleHub
              user={user}
              profile={profile}
              onStartBattle={(battleId) => {
                setActiveBattleId(battleId);
                setCurrentScreen('pvp_arena');
              }}
              onNavigateSolo={() => setCurrentScreen('map')}
            />
          )}
          {currentScreen === 'pvp_arena' && (
            <PvPBattleArena
              battleId={activeBattleId}
              currentUid={user.uid}
              onExit={() => setCurrentScreen('battle')}
              onFinishReward={async (earnedXp, isWinner) => {
                const updatedXp = await addBattleReward(earnedXp, isWinner);
                setXp(updatedXp);
              }}
            />
          )}
        </main>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className={`nav-item ${currentScreen === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentScreen('dashboard')} title="Início">
          <Home size={24} />
        </button>
        <button className={`nav-item ${currentScreen === 'map' ? 'active' : ''}`} onClick={() => setCurrentScreen('map')} title="Mapa">
          <MapIcon size={24} />
        </button>
        <button className={`nav-item ${currentScreen === 'battle' || currentScreen === 'pvp_arena' ? 'active' : ''}`} onClick={() => setCurrentScreen('battle')} title="Duelo 1x1">
          <Swords size={24} />
        </button>
        <button className={`nav-item ${currentScreen === 'ranking' ? 'active' : ''}`} onClick={() => setCurrentScreen('ranking')} title="Ranking">
          <Trophy size={24} />
        </button>
        <button className="nav-item" onClick={() => setShowShop(true)} title="Perfil">
          <User size={24} />
        </button>
      </nav>

      {showShop && (
        <ShopModal
          currentAvatar={avatar}
          onEquip={handleEquipAvatar}
          profile={profile}
          onUpdateProfile={updateAccountProfile}
          onLogout={handleLogout}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* Modal global de desafio de duelo em tempo real */}
      <BattleInviteModal
        currentProfile={profile}
        onAcceptBattle={(battleId) => {
          setActiveBattleId(battleId);
          setCurrentScreen('pvp_arena');
        }}
      />

      <style>{`
        .mobile-app-container {
          background-color: #1a162b;
          min-height: 100vh;
          min-height: 100svh;
          min-height: 100dvh;
          display: flex;
          justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;
          padding: 32px 24px;
          gap: 12px;
          color: #1e293b;
          background: radial-gradient(ellipse at 50% 35%, #ffffff 0%, #fffaf5 60%, #fff1f2 100%);
          text-align: center;
        }

        .loading-logo {
          width: min(78vw, 300px);
          max-height: 180px;
          object-fit: contain;
          margin-bottom: 14px;
          animation: logo-arrive 700ms ease-out both;
        }

        .loading-title {
          font-size: clamp(1.05rem, 4vw, 1.3rem);
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .loading-caption {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .loading-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 18px;
          margin-top: 4px;
        }

        .loading-dots i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #dc2626;
          animation: loading-pulse 900ms ease-in-out infinite alternate;
        }

        .loading-dots i:nth-child(2) {
          animation-delay: 180ms;
        }

        .loading-dots i:nth-child(3) {
          animation-delay: 360ms;
        }

        @keyframes loading-pulse {
          from { opacity: 0.35; transform: translateY(0); }
          to { opacity: 1; transform: translateY(-4px); }
        }

        @keyframes logo-arrive {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .mobile-app-content {
          background-color: #f8f9fc;
          width: 100%;
          max-width: 480px;
          border-radius: 30px;
          margin: 10px;
          padding: 24px;
          padding-bottom: 100px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          overflow-y: auto;
          position: relative;
        }

        .mobile-header {
          margin-bottom: 20px;
        }

        .back-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: #111827;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          margin-right: 4px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .back-btn:hover { background: rgba(0,0,0,0.05); }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-img {
          width: 50px;
          height: 50px;
          background-color: #ffe4e6;
          border: 2px solid #fecdd3;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          cursor: pointer;
          flex-shrink: 0;
        }

        .user-details { flex: 1; min-width: 0; }

        .user-details h2 {
          margin: 0;
          font-size: 1.1rem;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-details p {
          margin: 4px 0 0 0;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }

        .logout-btn {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 2px 6px;
          cursor: pointer;
          color: #6b7280;
          font-size: 1rem;
          line-height: 1;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
        }

        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          background: white;
          display: flex;
          justify-content: space-around;
          padding: 15px 0 25px 0;
          border-top: 1px solid #e5e7eb;
          z-index: 100;
          border-bottom-left-radius: 30px;
          border-bottom-right-radius: 30px;
        }

        .nav-item {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .nav-item.active { color: #f97316; }

        @media (max-width: 600px) {
          .mobile-app-container {
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            align-items: stretch;
          }

          .mobile-app-content {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: none;
            min-height: 100vh;
            min-height: 100svh;
            min-height: 100dvh;
            margin: 0;
            padding: calc(14px + env(safe-area-inset-top)) clamp(12px, 4vw, 20px) calc(88px + env(safe-area-inset-bottom));
            border-radius: 0;
            box-shadow: none;
            overflow: visible;
          }

          .mobile-main {
            width: 100%;
            min-width: 0;
            flex: 1;
          }

          .mobile-header {
            margin-bottom: 14px;
          }

          .profile-info {
            gap: 8px;
          }

          .avatar-img {
            width: 44px;
            height: 44px;
          }

          .user-details h2 {
            font-size: clamp(0.85rem, 4vw, 1rem);
          }

          .user-details p {
            font-size: 0.72rem;
          }

          .header-actions {
            font-size: 0.82rem !important;
          }

          .bottom-nav {
            width: 100%;
            max-width: none;
            padding: 9px 0 calc(10px + env(safe-area-inset-bottom));
            border-radius: 16px 16px 0 0;
          }

          .nav-item {
            padding: 8px 10px;
          }

          .dashboard-view,
          .battle-hub-view,
          .ranking-view,
          .dashboard-wrapper {
            min-width: 0;
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .mobile-app-content {
            padding-right: 9px;
            padding-left: 9px;
          }

          .profile-info {
            gap: 6px;
          }

          .header-actions {
            gap: 2px !important;
            font-size: 0.76rem !important;
          }

          .nav-item {
            padding: 7px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
