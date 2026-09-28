import React from 'react';

const AVATARS = [
  { id: '👦🏽', name: 'Estudante', cost: 0, icon: '👦🏽' },
  { id: '🐱', name: 'Gato Curioso', cost: 1000, icon: '🐱' },
  { id: '🤖', name: 'Robô do Saber', cost: 2000, icon: '🤖' },
  { id: '👽', name: 'Alien Genial', cost: 5000, icon: '👽' },
  { id: '👑', name: 'Rei da Classe', cost: 10000, icon: '👑' },
  { id: '🧙‍♂️', name: 'Mago da Sabedoria', cost: 15000, icon: '🧙‍♂️' }
];

export default function ShopModal({ xp, currentAvatar, unlockedAvatars, onBuy, onEquip, onClose }) {
  
  const handleAction = (item) => {
    const isUnlocked = unlockedAvatars.includes(item.id);
    if (isUnlocked) {
      onEquip(item.id);
    } else {
      if (xp >= item.cost) {
        onBuy(item.id, item.cost);
      } else {
        alert('Você não tem XP suficiente!');
      }
    }
  };

  return (
    <div className="shop-overlay">
      <div className="shop-modal glass-card">
        <div className="shop-header">
          <h2>🛒 Loja de Recompensas</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="xp-balance text-center">
          <span style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>Seu Saldo:</span>
          <h3 className="text-gradient" style={{fontSize: '2.5rem', margin: 0}}>⭐ {xp} XP</h3>
          <p style={{color: 'var(--text-main)', marginTop: '0.5rem'}}>Use seu XP ganho nos estudos para comprar novos Avatares exclusivos!</p>
        </div>

        <div className="shop-grid">
          {AVATARS.map(item => {
            const isUnlocked = unlockedAvatars.includes(item.id);
            const isEquipped = currentAvatar === item.id;
            const canAfford = xp >= item.cost;

            return (
              <div key={item.id} className={`shop-item ${isEquipped ? 'equipped' : ''} ${!isUnlocked && !canAfford ? 'locked' : ''}`}>
                <div className="avatar-icon">{item.icon}</div>
                <h4>{item.name}</h4>
                
                <div className="item-action">
                  {isEquipped ? (
                    <button className="btn-primary" disabled style={{background: 'var(--success)'}}>Em Uso</button>
                  ) : isUnlocked ? (
                    <button className="btn-primary" onClick={() => handleAction(item)}>Equipar</button>
                  ) : (
                    <button 
                      className="btn-primary" 
                      onClick={() => handleAction(item)}
                      style={{ background: canAfford ? 'var(--warning)' : 'var(--border-light)', color: canAfford ? 'white' : 'var(--text-muted)' }}
                    >
                      {item.cost} XP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .shop-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .shop-modal {
          background: white;
          padding: 2rem;
          width: 95%;
          max-width: 700px;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          border: 4px solid var(--primary);
          max-height: 90vh;
          overflow-y: auto;
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .shop-header h2 { color: var(--primary); margin: 0; }

        .xp-balance {
          background: #F3F4F6;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          border: 2px dashed var(--border-light);
        }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
        }

        .shop-item {
          background: white;
          border: 2px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.5rem 1rem;
          text-align: center;
          transition: transform 0.2s;
          display: flex;
          flex-direction: column;
        }

        .shop-item:hover {
          transform: translateY(-5px);
          border-color: var(--primary-light);
        }

        .shop-item.equipped {
          border-color: var(--success);
          background: #f0fdf4;
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.2);
        }

        .shop-item.locked {
          opacity: 0.8;
          filter: grayscale(0.5);
        }

        .avatar-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .shop-item h4 {
          margin: 0 0 1rem 0;
          color: var(--text-main);
          font-size: 1.1rem;
        }

        .item-action {
          margin-top: auto;
        }
        
        .item-action button {
          width: 100%;
          padding: 8px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
