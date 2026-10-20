import { useState, useEffect, useCallback } from 'react';
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
    addBattleReward,
    fetchRanking,
  } = useAuth();

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
    if (user?.uid && profile) {
      const code = getOrGenerateFriendCode(profile);
      updatePresence(user.uid, true, code);
      const interval = setInterval(() => {
        updatePresence(user.uid, true);
      }, 60000);
      return () => {
        clearInterval(interval);
        updatePresence(user.uid, false);
      };
    }
  }, [user?.uid, profile]);

  // Salva no Firebase toda vez que XP/medals/topics mudam
  const persistProgress = useCallback((updates) => {
    saveProgress(updates);
  }, [saveProgress]);

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

  const handleTopicSelect = (subject, topic) => {
    if (lives <= 0) {
      alert('Você está sem vidas! Espere um pouco para regenerá-las.');
      return;
    }
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setCurrentScreen('quiz');
  };

  const handleMinigameWin = (earnedXp) => {
    const newXp = xp + earnedXp;
    setXp(newXp);
    setLives(prev => Math.min(3, prev + 1));
    persistProgress({ xp: newXp, medals, completedTopics, avatar, unlockedAvatars, streak });
  };

  const handleQuizComplete = (earnedXp, isFailure) => {
    let newXp = xp;
    let newCompletedTopics = [...completedTopics];
    let newMedals = [...medals];

    if (isFailure) {
      setLives(prev => Math.max(0, prev - 1));
    } else {
      const topicKey = `${selectedSubject.id}_${profile?.grade}_${selectedTopic.id}`;
      if (!newCompletedTopics.includes(topicKey)) {
        newCompletedTopics.push(topicKey);
      }
    }

    if (earnedXp > 0) {
      newXp += earnedXp;
      const medalId = `${selectedSubject.id}_${profile?.grade}_${selectedTopic.id}`;
      if (!newMedals.find(m => m.id === medalId)) {
        newMedals.push({
          id: medalId,
          icon: selectedSubject.icon,
          name: `Mestre em ${selectedTopic.title}`
        });
      }
    }

    setXp(newXp);
    setCompletedTopics(newCompletedTopics);
    setMedals(newMedals);
    persistProgress({ xp: newXp, medals: newMedals, completedTopics: newCompletedTopics, avatar, unlockedAvatars, streak });
    setCurrentScreen('map');
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
        <div className="loading-screen">
          <img src="/logo.png" alt="GamificaEdu" style={{ maxWidth: '160px', marginBottom: '24px' }} />
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
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
              user={profile}
              xp={xp}
              streak={streak}
              medals={medals}
              completedTopics={completedTopics}
              onNavigate={handleNavigate}
              onMinigameWin={handleMinigameWin}
            />
          )}
          {currentScreen === 'map' && (
            <MainMap
              userGrade={profile.grade}
              currentProfile={profile}
              completedTopics={completedTopics}
              onSelectTopic={handleTopicSelect}
              onMinigameWin={handleMinigameWin}
              initialSubjectId={activeMapSubject}
            />
          )}
          {currentScreen === 'quiz' && (
            <QuizGame
              subject={selectedSubject}
              grade={profile.grade}
              topic={selectedTopic}
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
        <button className={`nav-item ${currentScreen === 'battle' || currentScreen === 'pvp_arena' ? 'active' : ''}`} onClick={() => setCurrentScreen('battle')} title="Batalha PvP">
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
          display: flex;
          justify-content: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 16px;
          color: white;
          font-weight: 700;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.15);
          border-top-color: #9D74FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
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
            min-height: 100dvh;
            align-items: stretch;
          }

          .mobile-app-content {
            width: 100%;
            max-width: none;
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            padding: 14px 12px calc(94px + env(safe-area-inset-bottom));
            border-radius: 0;
            box-shadow: none;
            overflow-x: clip;
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
            padding: 9px 0 calc(12px + env(safe-area-inset-bottom));
            border-radius: 16px 16px 0 0;
          }

          .nav-item {
            padding: 8px 10px;
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
