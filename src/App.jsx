import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (lives < 3 && currentScreen === 'map') {
      const timer = setTimeout(() => setLives(3), 30000);
      return () => clearTimeout(timer);
    }
  }, [lives, currentScreen]);

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
      <div className="app-container">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <Dashboard 
        user={user} 
        onNavigate={(screen) => setCurrentScreen(screen)} 
      />
    );
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      <div className="app-container">
        <header className="app-header glass">
          <div className="logo-container" onClick={() => setCurrentScreen('dashboard')}>
            <img src="/logo.svg" alt="Gamifica Edu" style={{ height: '80px', objectFit: 'contain', transform: 'scale(1.2)' }} />
          </div>
          
          <div className="user-stats">
            {/* Informações do Usuário no cabeçalho */}
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '1rem' }}>
              <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{avatar}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{user.grade}º Ano</div>
              </div>
            </div>

            {/* Streak (Ofensiva) */}
            <div className="streak-badge" title="Dias Seguidos de Estudo">
              🔥 <span style={{fontWeight: '900'}}>{streak}</span>
            </div>

            {/* Botão da Loja */}
            <button className="shop-btn btn-primary" onClick={() => setShowShop(true)} style={{ padding: '8px 15px', background: 'var(--warning)', borderColor: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              🛒 Loja
            </button>

            <div className="lives-container" title="Suas Vidas" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <img 
                  key={i} 
                  src="https://em-content.zobj.net/source/apple/225/heavy-black-heart_2764.png" 
                  alt="Vida"
                  className="heart-icon" 
                  style={{ 
                    width: '22px', 
                    height: '22px',
                    transition: 'all 0.3s',
                    opacity: i < lives ? 1 : 0.3,
                    filter: i < lives ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'grayscale(100%)'
                  }} 
                />
              ))}
            </div>

            {medals.length > 0 && (
              <div className="medals-container" title="Suas Conquistas">
                {medals.map(medal => (
                  <span key={medal.id} className="medal-icon">{medal.icon}</span>
                ))}
              </div>
            )}

            <div className="xp-badge">
              <span className="star">⭐</span>
              <span className="xp-text">{xp} XP</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          {currentScreen === 'map' && (
            <MainMap 
              userGrade={user.grade} 
              completedTopics={completedTopics}
              onSelectTopic={handleTopicSelect} 
              onMinigameWin={handleMinigameWin}
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
          .app-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            position: relative;
            z-index: 1;
          }
          
          .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 3rem;
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(255,255,255,0.5);
            margin-bottom: 2rem;
            background: rgba(255, 255, 255, 0.95);
          }
          
          .logo-container {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .logo-container:hover {
            transform: scale(1.02);
          }

          .logo-icon {
            font-size: 2.2rem;
            background: linear-gradient(135deg, var(--primary-light), var(--secondary-light));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 2px 4px rgba(157, 116, 255, 0.3));
          }

          .logo {
            font-size: 2rem;
            margin: 0;
          }
          
          .user-stats {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .lives-container {
            display: flex;
            gap: 4px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: var(--radius-full);
            border: 2px solid var(--danger-light);
          }

          .heart-icon {
            font-size: 1.2rem;
            transition: opacity 0.3s;
          }

          .medals-container {
            display: flex;
            gap: 4px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: var(--radius-full);
            border: 2px solid var(--border-light);
          }

          .medal-icon {
            font-size: 1.2rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          
          .xp-badge {
            background: var(--warning-light);
            padding: 8px 16px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            gap: 8px;
            border: 2px solid rgba(245, 158, 11, 0.2);
            box-shadow: 0 4px 10px rgba(245, 158, 11, 0.15);
          }

          .xp-badge .star {
            font-size: 1.2rem;
          }

          .xp-badge .xp-text {
            color: var(--warning);
            font-weight: 800;
            font-size: 1.1rem;
          }
          
          .streak-badge {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
            padding: 8px 16px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 1.1rem;
            border: 2px solid rgba(239, 68, 68, 0.2);
          }

          .app-main {
            flex: 1;
            padding: 0 2rem 3rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          @media (max-width: 768px) {
            .app-header {
              flex-direction: column;
              gap: 1rem;
              padding: 1rem;
            }
            .user-info { display: none; }
            .user-stats { flex-wrap: wrap; justify-content: center; }
          }
        `}</style>
      </div>
    </>
  );
}

export default App;
