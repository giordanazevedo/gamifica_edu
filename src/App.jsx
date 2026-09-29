import { useState, useEffect } from 'react';
import { Flame, Star, ChevronLeft, Home, Map as MapIcon, Zap, User } from 'lucide-react';
import Onboarding from './components/Onboarding';
import MainMap from './components/MainMap';
import QuizGame from './components/QuizGame';
import Dashboard from './components/Dashboard';
import ShopModal from './components/ShopModal';

function App() {
  const [user, setUser] = useState(null); // { name, grade }
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Gamification State
  const [xp, setXp] = useState(0);
  const [medals, setMedals] = useState([]);
  const [lives, setLives] = useState(3);
  const [completedTopics, setCompletedTopics] = useState([]);
  
  // Customization State
  const [avatar, setAvatar] = useState('👦🏽');
  const [unlockedAvatars, setUnlockedAvatars] = useState(['👦🏽']);
  const [showShop, setShowShop] = useState(false);
  const [streak, setStreak] = useState(1);
  const [activeMapSubject, setActiveMapSubject] = useState(null);

  useEffect(() => {
    if (lives < 3 && currentScreen === 'map') {
      const timer = setTimeout(() => setLives(3), 30000);
      return () => clearTimeout(timer);
    }
  }, [lives, currentScreen]);

  const handleNavigate = (screen, subjectId = null) => {
    if (subjectId) setActiveMapSubject(subjectId);
    setCurrentScreen(screen);
  };

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleTopicSelect = (subject, topic) => {
    if (lives <= 0) {
      alert("Você está sem vidas! Espere um pouco para regenerá-las ou tente novamente mais tarde.");
      return;
    }
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setCurrentScreen('quiz');
  };

  const handleMinigameWin = (earnedXp) => {
    setXp(prev => prev + earnedXp);
    setLives(prev => Math.min(3, prev + 1));
  };

  const handleQuizComplete = (earnedXp, isFailure) => {
    if (isFailure) {
      setLives(prev => Math.max(0, prev - 1));
    } else {
      const topicKey = `${selectedSubject.id}_${user.grade}_${selectedTopic.id}`;
      if (!completedTopics.includes(topicKey)) {
        setCompletedTopics(prev => [...prev, topicKey]);
      }
    }

    if (earnedXp > 0) {
      setXp(prev => prev + earnedXp);
      
      const medalId = `${selectedSubject.id}_${user.grade}_${selectedTopic.id}`;
      if (!medals.find(m => m.id === medalId)) {
        setMedals(prev => [...prev, {
          id: medalId,
          icon: selectedSubject.icon,
          name: `Mestre em ${selectedTopic.title}`
        }]);
      }
    }
    setCurrentScreen('map');
  };

  const handleBuyAvatar = (id, cost) => {
    setXp(p => p - cost);
    setUnlockedAvatars(p => [...p, id]);
    setAvatar(id); // Equipar automaticamente ao comprar
  };

  const handleEquipAvatar = (id) => {
    setAvatar(id);
  };

  if (currentScreen === 'onboarding') {
    return (
      <div className="mobile-app-container">
        <div className="mobile-app-content">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

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
                  else setCurrentScreen('dashboard');
                }}
                title="Voltar"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <div className="avatar-img" onClick={() => setShowShop(true)}>
              {avatar}
            </div>
            <div className="user-details">
              <h2>{user?.name} <span>›</span></h2>
              <p>{user?.grade}º Ano · Escola Estadual</p>
            </div>
            <div className="notification-bell">
              <span style={{marginRight: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem'}} title="Dias Seguidos">
                <Flame size={18} color="#f97316" /> {streak}
              </span>
              <span onClick={() => setShowShop(true)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem'}} title="XP Atual">
                <Star size={18} color="#eab308" /> {xp}
              </span>
            </div>
          </div>
        </header>

        <main className="mobile-main">
          {currentScreen === 'dashboard' && (
            <Dashboard 
              user={user} 
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
              userGrade={user.grade} 
              completedTopics={completedTopics}
              onSelectTopic={handleTopicSelect} 
              onMinigameWin={handleMinigameWin}
              initialSubjectId={activeMapSubject}
            />
          )}
          {currentScreen === 'quiz' && (
            <QuizGame 
              subject={selectedSubject} 
              grade={user.grade}
              topic={selectedTopic}
              onComplete={handleQuizComplete} 
              onExit={() => setCurrentScreen('map')} 
            />
          )}
        </main>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className={`nav-item ${currentScreen === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentScreen('dashboard')}>
          <Home size={24} />
        </button>
        <button className={`nav-item ${currentScreen === 'map' ? 'active' : ''}`} onClick={() => setCurrentScreen('map')}>
          <MapIcon size={24} />
        </button>
        <button className={`nav-item ${currentScreen === 'quiz' ? 'active' : ''}`} onClick={() => setCurrentScreen('dashboard')}>
          <Zap size={24} />
        </button>
        <button className="nav-item" onClick={() => setShowShop(true)}>
          <User size={24} />
        </button>
      </nav>

      {showShop && (
        <ShopModal 
          xp={xp}
          currentAvatar={avatar}
          unlockedAvatars={unlockedAvatars}
          onBuy={handleBuyAvatar}
          onEquip={handleEquipAvatar}
          onClose={() => setShowShop(false)}
        />
      )}
        
        <style>{`
          .mobile-app-container {
            background-color: #1a162b;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
          .back-btn:hover {
            background: rgba(0,0,0,0.05);
          }

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
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            cursor: pointer;
          }

          .user-details {
            flex: 1;
          }

          .user-details h2 {
            margin: 0;
            font-size: 1.2rem;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .user-details h2 span {
            color: #111827;
            font-size: 1.2rem;
          }

          .user-details p {
            margin: 4px 0 0 0;
            font-size: 0.85rem;
            color: #6b7280;
          }

          .notification-bell {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
            font-weight: 700;
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

          .nav-item.active {
            color: #f97316; /* Orange color for active icon */
          }
        `}</style>
      </div>
    );
}

export default App;
