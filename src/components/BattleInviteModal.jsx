import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { acceptBattleInvite, declineBattleInvite } from '../services/pvpService';
import { Check, X, ShieldAlert } from 'lucide-react';
import AvatarDisplay from './AvatarDisplay';

export default function BattleInviteModal({ currentProfile, onAcceptBattle }) {
  const [activeInvite, setActiveInvite] = useState(null);

  // Escuta convites pendentes em tempo real para este usuário
  useEffect(() => {
    if (!currentProfile?.uid) return;

    const q = query(
      collection(db, 'invites'),
      where('toUid', '==', currentProfile.uid),
      where('status', '==', 'pending')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const inv = snapshot.docs[0].data();
        setActiveInvite(inv);
      } else {
        setActiveInvite(null);
      }
    });

    return () => unsub();
  }, [currentProfile?.uid]);

  if (!activeInvite) return null;

  const handleAccept = async () => {
    const res = await acceptBattleInvite(activeInvite, currentProfile);
    if (res.success) {
      onAcceptBattle(activeInvite.battleId);
      setActiveInvite(null);
    }
  };

  const handleDecline = async () => {
    await declineBattleInvite(activeInvite.id, activeInvite.battleId);
    setActiveInvite(null);
  };

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal-card">
        <div className="invite-swords-icon">
          <img src="/duelo.png" alt="Duelo" style={{ width: 52, height: 52, objectFit: 'contain' }} />
        </div>

        <span className="invite-badge">⚔️ DESAFIO DE BATALHA!</span>
        <h3 className="invite-title">{activeInvite.fromName} te desafiou!</h3>

        <div className="challenger-preview">
          <span className="challenger-avatar"><AvatarDisplay avatar={activeInvite.fromAvatar || '👦🏽'} size="48px" /></span>
          <div className="challenger-meta">
            <strong>{activeInvite.fromName}</strong>
            <span>Duelo de {activeInvite.subject?.toUpperCase() || 'GERAL'}</span>
          </div>
        </div>

        <p className="invite-text">
          Prepare seus reflexos! A batalha 1v1 começará assim que você aceitar.
        </p>

        <div className="invite-actions">
          <button className="accept-invite-btn" onClick={handleAccept}>
            <Check size={20} />
            <span>ACEITAR DESAFIO!</span>
          </button>
          <button className="decline-invite-btn" onClick={handleDecline}>
            <X size={18} />
            <span>Recusar</span>
          </button>
        </div>
      </div>

      <style>{`
        .invite-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .invite-modal-card {
          background: white;
          width: 100%;
          max-width: 380px;
          border-radius: 24px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border: 3px solid #7c3aed;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popUp {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .invite-swords-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #f3e8ff;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          animation: pulseIcon 1.2s infinite;
        }

        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .invite-badge {
          background: #fee2e2;
          color: #ef4444;
          font-weight: 900;
          font-size: 0.75rem;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .invite-title {
          font-size: 1.3rem;
          font-weight: 900;
          color: #1e293b;
        }

        .challenger-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 14px;
          width: 100%;
          text-align: left;
        }

        .challenger-avatar {
          font-size: 2.2rem;
        }

        .challenger-meta {
          display: flex;
          flex-direction: column;
        }

        .challenger-meta strong {
          color: #1e293b;
          font-size: 0.95rem;
        }

        .challenger-meta span {
          color: #7c3aed;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .invite-text {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
        }

        .invite-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 6px;
        }

        .accept-invite-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.3);
          transition: transform 0.2s ease;
        }

        .accept-invite-btn:hover {
          transform: translateY(-2px);
        }

        .decline-invite-btn {
          background: #f1f5f9;
          color: #64748b;
          border: none;
          padding: 10px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
        }

        .decline-invite-btn:hover {
          background: #e2e8f0;
          color: #334155;
        }
      `}</style>
    </div>
  );
}
