import React, { useState, useRef } from 'react';
import { Camera, Check, Sparkles, X, Image as ImageIcon, LogOut, Save, Settings } from 'lucide-react';
import AvatarDisplay from './AvatarDisplay';

// Avatares oficiais da pasta public/avatars/
// (Você pode adicionar quantos arquivos quiser em public/avatars/ e listá-los aqui!)
export const OFFICIAL_AVATARS = [
  { id: '/avatars/avatar1.png', name: 'Avatar 1', type: 'image' },
  { id: '/avatars/avatar2.png', name: 'Avatar 2', type: 'image' },
  { id: '/avatars/avatar3.png', name: 'Avatar 3', type: 'image' },
  { id: '/avatars/avatar4.png', name: 'Avatar 4', type: 'image' },
  { id: '/avatars/avatar5.png', name: 'Avatar 5', type: 'image' },
  { id: '/avatars/avatar6.png', name: 'Avatar 6', type: 'image' },
  { id: '/avatars/avatar7.jpg', name: 'Avatar 7', type: 'image' },
];

// Avatares temáticos adicionais
const CLASSIC_AVATARS = [
  { id: '👦🏽', name: 'Estudante Menino', type: 'emoji' },
  { id: '👧🏻', name: 'Estudante Menina', type: 'emoji' },
  { id: '🧑🏾‍🎓', name: 'Formando(a)', type: 'emoji' },
  { id: '🐱', name: 'Gato Curioso', type: 'emoji' },
  { id: '🦊', name: 'Raposa Esperta', type: 'emoji' },
  { id: '🦁', name: 'Leão Corajoso', type: 'emoji' },
  { id: '🤖', name: 'Robô do Saber', type: 'emoji' },
  { id: '👑', name: 'Mestre da Classe', type: 'emoji' },
  { id: '🚀', name: 'Foguete Nerd', type: 'emoji' }
];

export default function ShopModal({
  currentAvatar,
  profile,
  onEquip,
  onUpdateProfile,
  onLogout,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarTab, setAvatarTab] = useState('official');
  const [uploadError, setUploadError] = useState('');
  const [name, setName] = useState(profile?.name || '');
  const [profileError, setProfileError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileMessage('');
    setIsSavingProfile(true);
    const result = await onUpdateProfile({ name });
    setIsSavingProfile(false);
    if (!result.success) {
      setProfileError(result.error);
      return;
    }
    setProfileMessage('Nome atualizado com sucesso.');
  };

  const handleLogout = async () => {
    setProfileError('');
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      setProfileError('Não foi possível sair da conta. Tente novamente.');
      setIsLoggingOut(false);
    }
  };

  // Redimensiona e converte foto do celular/PC para base64 compacto (<= 150x150px)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecione um arquivo de imagem (PNG, JPG, WEBP).');
      return;
    }

    setUploadError('');
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Redimensiona em canvas para ficar super leve (máximo 160px)
        const canvas = document.createElement('canvas');
        const maxSize = 160;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        // Equipa imediatamente e salva no perfil
        onEquip(dataUrl);
      };
      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="avatar-modal-overlay">
      <div className="avatar-modal-card">
        {/* HEADER */}
        <div className="modal-header">
          <div className="header-title">
            <span className="badge">PERFIL</span>
            <h2>👤 Minha conta</h2>
          </div>
          <button onClick={onClose} className="close-btn" title="Fechar">
            <X size={22} />
          </button>
        </div>

        <div className="avatar-tabs profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Settings size={16} />
            <span>Minha conta</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'avatars' ? 'active' : ''}`}
            onClick={() => setActiveTab('avatars')}
          >
            <ImageIcon size={16} />
            <span>Avatares</span>
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="account-panel">
            <div className="account-summary">
              <div className="account-avatar">
                <AvatarDisplay avatar={currentAvatar} size="58px" />
              </div>
              <div className="account-details">
                <strong>{profile?.name || 'Jogador'}</strong>
                <span>{profile?.role === 'professor' ? 'Professor' : `${profile?.grade || '9'}º Ano`}</span>
              </div>
            </div>

            <form className="account-form" onSubmit={handleProfileSave}>
              <label className="account-label" htmlFor="account-name">Nome de usuário</label>
              <input
                id="account-name"
                className="account-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={40}
                required
              />
              <label className="account-label" htmlFor="account-email">E-mail da conta</label>
              <input
                id="account-email"
                className="account-input readonly"
                value={profile?.email || ''}
                readOnly
              />
              <div className="account-stats">
                <span><strong>{(profile?.xp || 0).toLocaleString('pt-BR')}</strong> XP</span>
                <span><strong>{profile?.streak || 1}</strong> dias seguidos</span>
              </div>
              {profileError && <p className="account-error" role="alert">{profileError}</p>}
              {profileMessage && <p className="account-success" role="status">{profileMessage}</p>}
              <button className="save-done-btn" type="submit" disabled={isSavingProfile}>
                <Save size={17} /> {isSavingProfile ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>

            <button
              className="logout-account-btn"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={18} /> {isLoggingOut ? 'Saindo...' : 'Sair do aplicativo'}
            </button>
          </div>
        )}

        {activeTab === 'avatars' && (
          <>
            <div className="current-avatar-preview">
              <div className="preview-avatar-circle">
                <AvatarDisplay avatar={currentAvatar} size="72px" />
              </div>
              <div className="preview-info">
                <span className="preview-label">Seu Avatar Atual:</span>
                <strong>{profile?.name || 'Pronto para os desafios!'}</strong>
              </div>
            </div>

            <div className="custom-upload-box">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                className="upload-trigger-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={20} />
                <span>Enviar Minha Própria Foto / Imagem</span>
              </button>
              <small className="upload-tip">
                Envie qualquer foto ou personagem da sua galeria do celular ou PC!
              </small>
              {uploadError && <p className="upload-error">{uploadError}</p>}
            </div>

            <div className="avatar-tabs">
              <button
                className={`tab-btn ${avatarTab === 'official' ? 'active' : ''}`}
                onClick={() => setAvatarTab('official')}
              >
                <ImageIcon size={16} />
                <span>Escolares</span>
              </button>
              <button
                className={`tab-btn ${avatarTab === 'classic' ? 'active' : ''}`}
                onClick={() => setAvatarTab('classic')}
              >
                <Sparkles size={16} />
                <span>Divertidos</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'avatars' && avatarTab === 'official' && (
          <div className="avatar-grid-wrapper">
            <p className="tab-description">
              Avatares temáticos do GamificaEdu. Escolha o que mais combina com você:
            </p>
            <div className="avatars-grid">
              {OFFICIAL_AVATARS.map((item) => {
                const isSelected = currentAvatar === item.id;
                return (
                  <div
                    key={item.id}
                    className={`avatar-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => onEquip(item.id)}
                  >
                    <div className="avatar-img-frame">
                      <AvatarDisplay avatar={item.id} size="54px" />
                    </div>
                    <span className="avatar-name">{item.name}</span>
                    {isSelected ? (
                      <span className="equipped-tag">
                        <Check size={12} /> Em Uso
                      </span>
                    ) : (
                      <button className="equip-btn">Escolher</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTEÚDO: CLÁSSICOS / EMOJIS */}
        {activeTab === 'avatars' && avatarTab === 'classic' && (
          <div className="avatar-grid-wrapper">
            <div className="avatars-grid">
              {CLASSIC_AVATARS.map((item) => {
                const isSelected = currentAvatar === item.id;
                return (
                  <div
                    key={item.id}
                    className={`avatar-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => onEquip(item.id)}
                  >
                    <div className="avatar-img-frame emoji-frame">
                      <AvatarDisplay avatar={item.id} size="46px" />
                    </div>
                    <span className="avatar-name">{item.name}</span>
                    {isSelected ? (
                      <span className="equipped-tag">
                        <Check size={12} /> Em Uso
                      </span>
                    ) : (
                      <button className="equip-btn">Escolher</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'avatars' && (
          <button className="save-done-btn" onClick={onClose}>
            Concluir
          </button>
        )}
      </div>

      <style>{`
        .avatar-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }

        .avatar-modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 460px;
          border-radius: 28px;
          padding: 22px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: popUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 10px;
        }

        .header-title h2 {
          font-size: 1.25rem;
          font-weight: 900;
          color: #1e293b;
          margin-top: 2px;
        }

        .badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: #f3e8ff;
          color: #7c3aed;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .close-btn {
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        /* CURRENT PREVIEW */
        .current-avatar-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          color: white;
          padding: 14px 18px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(49, 46, 129, 0.3);
        }

        .preview-avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #facc15;
          overflow: hidden;
          flex-shrink: 0;
        }

        .preview-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preview-label {
          font-size: 0.75rem;
          color: #93c5fd;
          font-weight: 700;
        }

        .preview-info strong {
          font-size: 1.05rem;
          color: #ffffff;
        }

        /* UPLOAD PRÓPRIO */
        .custom-upload-box {
          background: #fdf4ff;
          border: 2px dashed #d8b4fe;
          border-radius: 18px;
          padding: 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .upload-trigger-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
          transition: transform 0.2s ease;
        }

        .upload-trigger-btn:hover {
          transform: translateY(-2px);
        }

        .upload-tip {
          font-size: 0.72rem;
          color: #7e22ce;
          font-weight: 600;
        }

        .upload-error {
          font-size: 0.75rem;
          color: #ef4444;
          font-weight: 700;
        }

        /* ABAS */
        .avatar-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
          gap: 6px;
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          background: white;
          color: #7c3aed;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .tab-description {
          font-size: 0.78rem;
          color: #64748b;
          margin-bottom: 8px;
        }

        .account-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .account-summary {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 18px;
          background: linear-gradient(135deg, #f5f3ff, #eff6ff);
        }

        .account-avatar {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: white;
          border: 2px solid #c4b5fd;
        }

        .account-details {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
        }

        .account-details strong {
          overflow: hidden;
          color: #1e293b;
          font-size: 1.05rem;
          text-overflow: ellipsis;
        }

        .account-details span {
          color: #64748b;
          font-size: 0.85rem;
        }

        .account-form {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .account-label {
          margin-top: 3px;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .account-input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 11px;
          color: #1e293b;
          font: inherit;
        }

        .account-input:focus {
          outline: 2px solid #c4b5fd;
          border-color: #8b5cf6;
        }

        .account-input.readonly {
          background: #f8fafc;
          color: #64748b;
        }

        .account-stats {
          display: flex;
          justify-content: space-around;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.85rem;
        }

        .account-stats strong {
          color: #5b21b6;
        }

        .account-error,
        .account-success {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .account-error { color: #dc2626; }
        .account-success { color: #059669; }

        .logout-account-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 1px solid #fecaca;
          border-radius: 14px;
          background: #fff1f2;
          color: #be123c;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
        }

        .logout-account-btn:disabled,
        .save-done-btn:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        /* AVATARS GRID */
        .avatars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .avatar-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .avatar-card:hover {
          transform: translateY(-2px);
          border-color: #9d74ff;
          background: #fbf9ff;
        }

        .avatar-card.selected {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .avatar-img-frame {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e2e8f0;
          overflow: hidden;
        }

        .avatar-card.selected .avatar-img-frame {
          border-color: #10b981;
        }

        .avatar-name {
          font-size: 0.72rem;
          font-weight: 800;
          color: #1e293b;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90px;
        }

        .equip-btn {
          background: #ede9fe;
          color: #7c3aed;
          border: none;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
        }

        .equipped-tag {
          background: #10b981;
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .save-done-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
