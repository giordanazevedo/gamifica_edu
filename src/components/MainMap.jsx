import React, { useState } from 'react';
import { BookOpen, Calculator, FlaskConical, Landmark, Globe, MessageCircle, Palette, Activity, Heart, Trophy, X, Plus, BrainCircuit, OctagonAlert, Zap, Lock, Gamepad2, UserCircle2 } from 'lucide-react';
import { curriculum } from '../data/curriculum';
import MemoryGame from './MemoryGame';
import JumperGame from './JumperGame';
import StopGame from './StopGame';

const allSubjects = [
  { id: 'portugues', name: 'Português', icon: <BookOpen size={18} />, color: '#9D74FF' },
  { id: 'matematica', name: 'Matemática', icon: <Calculator size={18} />, color: '#4FB0FF' },
  { id: 'ciencias', name: 'Ciências', icon: <FlaskConical size={18} />, color: '#10B981' },
  { id: 'historia', name: 'História', icon: <Landmark size={18} />, color: '#F59E0B' },
  { id: 'geografia', name: 'Geografia', icon: <Globe size={18} />, color: '#06B6D4' },
  { id: 'ingles', name: 'Inglês', icon: <MessageCircle size={18} />, color: '#EF4444' },
  { id: 'arte', name: 'Arte', icon: <Palette size={18} />, color: '#EC4899' },
  { id: 'ed_fisica', name: 'Ed. Física', icon: <Activity size={18} />, color: '#F97316' },
  { id: 'religiao', name: 'Ensino Relig.', icon: <Heart size={18} />, color: '#8B5CF6' },
];

export default function MainMap({ userGrade, completedTopics, onSelectTopic, onMinigameWin, initialSubjectId }) {
  const [activeSubjectId, setActiveSubjectId] = useState(initialSubjectId || allSubjects[0].id);

  React.useEffect(() => {
    if (initialSubjectId) {
      setActiveSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);
  const [showRanking, setShowRanking] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const [showJumper, setShowJumper] = useState(false);
  const [showStop, setShowStop] = useState(false);
  
  // Friend System Mock
  const [friends, setFriends] = useState([
    { name: 'Mari', score: 3200, avatar: '👧' },
    { name: 'Lucas', score: 1500, avatar: '👦' },
    { name: 'João', score: 800, avatar: '🧑' }
  ]);
  const [newFriendName, setNewFriendName] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      const avatars = ['👦', '👧', '🧑', '👩', '👨'];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      const randomScore = Math.floor(Math.random() * 3000);
      setFriends([...friends, { name: newFriendName, score: randomScore, avatar: randomAvatar }]);
      setNewFriendName('');
    }
  };

  const getRanking = () => {
    const all = [...friends, { name: 'Você', score: 2800, avatar: '😎', isMe: true }];
    return all.sort((a, b) => b.score - a.score);
  };
  
  const activeSubject = allSubjects.find(s => s.id === activeSubjectId);
  const topics = curriculum[activeSubjectId]?.[userGrade] || [];

  return (
    <div className="dashboard-wrapper">
      {/* Botão de Ranking Flutuante */}
      <button className="ranking-fab" onClick={() => setShowRanking(true)}>
        <Trophy size={18} /> Ranking
      </button>

      {/* Modal de Ranking */}
      {showRanking && (
        <div className="ranking-modal glass-card" style={{ maxWidth: '450px' }}>
          <div className="ranking-header">
            <h3>Competição (Amigos)</h3>
            <button onClick={() => setShowRanking(false)}><X size={20} /></button>
          </div>
          
          <form onSubmit={handleAddFriend} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Adicionar amigo..."
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border-light)', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 15px', display: 'flex', alignItems: 'center' }}><Plus size={20} /></button>
          </form>

          <div className="ranking-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {getRanking().map((player, index) => {
              let medal = `${index + 1}º`;
              let itemClass = '';
              if (index === 0) { medal = '🥇'; itemClass = 'first'; }
              else if (index === 1) { medal = '🥈'; itemClass = 'second'; }
              else if (index === 2) { medal = '🥉'; itemClass = 'third'; }
              
              return (
                <div key={index} className={`ranking-item ${itemClass}`} style={player.isMe ? { border: '2px solid var(--primary)' } : {}}>
                  <span style={{ width: '30px', textAlign: 'center' }}>{medal}</span> 
                  <span className="avatar"><UserCircle2 size={24} color="var(--primary)" /></span> 
                  <span>{player.name}</span> 
                  <span className="score">{player.score} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Barra de Matérias */}
      <div className="subjects-nav glass">
        {allSubjects.map(subject => (
          <div 
            key={subject.id} 
            className={`subject-tab ${activeSubjectId === subject.id ? 'active' : ''}`}
            style={{ '--s-color': subject.color }}
            onClick={() => setActiveSubjectId(subject.id)}
          >
            <span className="tab-icon">{subject.icon}</span>
            <span className="tab-name">{subject.name}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-header text-center" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: activeSubject.color }}>{activeSubject.name}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Escolha qualquer conteúdo do {userGrade}º Ano para estudar</p>
      </div>

      {/* Banners de Minigames */}
      <div className="minigames-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="fliperama-banner glass-card" onClick={() => setShowMinigame(true)} style={{ marginBottom: 0, padding: '1rem', borderColor: activeSubject.color }}>
          <div className="fliperama-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BrainCircuit size={32} color={activeSubject.color} /></div>
          <div className="fliperama-info">
            <h3 style={{ fontSize: '1.2rem', color: activeSubject.color }}>Memória</h3>
            <p style={{ fontSize: '0.85rem' }}>Ache os pares!</p>
          </div>
        </div>

        <div className="fliperama-banner glass-card" onClick={() => setShowStop(true)} style={{ marginBottom: 0, padding: '1rem', borderColor: activeSubject.color }}>
          <div className="fliperama-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><OctagonAlert size={32} color={activeSubject.color} /></div>
          <div className="fliperama-info">
            <h3 style={{ fontSize: '1.2rem', color: activeSubject.color }}>Stop</h3>
            <p style={{ fontSize: '0.85rem' }}>Letras e Categorias!</p>
          </div>
        </div>

        <div className="fliperama-banner glass-card" onClick={() => setShowJumper(true)} style={{ marginBottom: 0, padding: '1rem', borderColor: activeSubject.color }}>
          <div className="fliperama-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={32} color={activeSubject.color} /></div>
          <div className="fliperama-info">
            <h3 style={{ fontSize: '1.2rem', color: activeSubject.color }}>Corrida XP</h3>
            <p style={{ fontSize: '0.85rem' }}>Farme muito XP!</p>
          </div>
        </div>
      </div>

      {/* Grid Livre de Conteúdos */}
      {topics.length > 0 ? (
        <div className="topics-grid">
          {topics.map((topic, index) => {
            const topicKey = `${activeSubject.id}_${userGrade}_${topic.id}`;
            const isCompleted = completedTopics.includes(topicKey);

            return (
              <div 
                key={topic.id} 
                className={`topic-card glass-card ${isCompleted ? 'completed' : ''}`}
                onClick={() => onSelectTopic(activeSubject, topic)}
                style={{ '--node-color': activeSubject.color }}
              >
                <div className="topic-icon-wrapper" style={{ background: isCompleted ? 'var(--success)' : activeSubject.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isCompleted ? <Trophy size={20} color="white" /> : <Gamepad2 size={20} color="white" />}
                </div>
                
                <div className="topic-content">
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {topic.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {topic.desc}
                  </p>
                </div>

                <div className="topic-footer" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: isCompleted ? 'var(--success)' : activeSubject.color }}>
                    {isCompleted ? '✓ Concluído' : '▶ Iniciar Missão'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    30 Questões
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Em Construção 🚧</h3>
          <p style={{ color: 'var(--text-muted)' }}>Os conteúdos desta matéria serão adicionados em breve.</p>
        </div>
      )}

      {showMinigame && (
        <MemoryGame 
          subjectId={activeSubjectId}
          onClose={() => setShowMinigame(false)} 
          onWin={(xp) => {
            onMinigameWin(xp);
            setShowMinigame(false);
          }} 
        />
      )}

      {showJumper && (
        <JumperGame 
          onClose={() => setShowJumper(false)} 
          onWin={(xp) => {
            onMinigameWin(xp);
            setShowJumper(false);
          }} 
        />
      )}

      {showStop && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StopGame 
            onExit={() => setShowStop(false)}
            onComplete={(xp) => {
              onMinigameWin(xp);
              setShowStop(false);
            }}
          />
        </div>
      )}

      <style>{`
        .dashboard-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
        }

        .ranking-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: linear-gradient(135deg, #F59E0B, #EA580C);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-full);
          font-weight: 900;
          font-size: 1.1rem;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          border: 3px solid white;
          cursor: pointer;
          z-index: 50;
          transition: transform 0.2s;
        }
        .ranking-fab:hover { transform: scale(1.1); }

        .ranking-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 400px;
          background: white;
          z-index: 100;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 4px solid var(--warning);
          border-radius: var(--radius-lg);
        }

        .ranking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--border-light);
          padding-bottom: 1rem;
        }

        .ranking-header button {
          background: var(--danger-light);
          color: var(--danger);
          border: none;
          width: 30px; height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-weight: bold;
        }

        .ranking-list { display: flex; flex-direction: column; gap: 10px; }
        .ranking-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: var(--radius-md);
          background: var(--background);
          font-weight: 800;
        }
        .ranking-item.first { background: #FEF3C7; color: #B45309; }
        .ranking-item.second { background: #F3F4F6; color: #374151; }
        .ranking-item.third { background: #FFEDD5; color: #9A3412; }
        .ranking-item .score { margin-left: auto; color: var(--text-muted); }
        .ranking-item .avatar { font-size: 1.5rem; }

        .subjects-nav {
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-full);
          margin-bottom: 2rem;
          scrollbar-width: none;
        }
        .subjects-nav::-webkit-scrollbar { display: none; }
        
        .subject-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-weight: 800;
          color: var(--text-muted);
          transition: all 0.2s;
          white-space: nowrap;
          border: 2px solid transparent;
        }
        .subject-tab:hover { background: rgba(0,0,0,0.03); }
        .subject-tab.active {
          background: white;
          color: var(--s-color);
          border-color: var(--s-color);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transform: scale(1.05);
        }

        /* Fliperama Banner */
        .fliperama-banner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .fliperama-banner:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(139, 92, 246, 0.2);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
        }

        .fliperama-icon {
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
        }

        .fliperama-info h3 {
          margin: 0 0 0.5rem 0;
          color: var(--primary);
          font-size: 1.5rem;
        }

        .fliperama-info p {
          margin: 0;
          color: var(--text-main);
          font-size: 1rem;
        }

        /* Grid Livre */
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding-bottom: 4rem;
        }

        .topic-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          background: white;
          border: 2px solid var(--border-light);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .topic-card:hover {
          transform: translateY(-5px);
          border-color: var(--node-color);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }

        .topic-card.completed {
          background: #f8fafc;
          border-color: var(--success-light);
        }
        .topic-card.completed:hover {
          border-color: var(--success);
        }

        .topic-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          margin-bottom: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .topic-content {
          flex: 1;
        }

        @media (max-width: 768px) {
          .topics-grid {
            grid-template-columns: 1fr;
          }
          .minigames-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
