import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Gamepad2, Loader2, Trophy, UserRound } from 'lucide-react';
import { OFFICIAL_AVATARS } from './ShopModal';

const INTRO_STEPS = [
  {
    icon: BookOpen,
    title: 'Aprender pode ser uma aventura!',
    description: 'O GamificaEdu transforma os conteúdos do 9º ano em desafios para você aprender de um jeito mais divertido.',
  },
  {
    icon: Gamepad2,
    title: 'Estude jogando no seu ritmo',
    description: 'Escolha uma matéria no mapa, abra um tema e responda às perguntas. Você também pode explorar minijogos educativos.',
  },
  {
    icon: Trophy,
    title: 'Desafie amigos e suba no ranking',
    description: 'Ganhe XP ao aprender, acompanhe seu progresso e chame amigos para duelos. Em Matemática, cada acerto pode puxar a corda para o seu lado!',
  },
];

export default function FirstVisitSetup({ profile, onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.name === 'Jogador' ? '' : profile?.name || '');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const completeSetup = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 40) {
      setError('O nome deve ter entre 2 e 40 caracteres.');
      return;
    }
    if (!avatar) {
      setError('Escolha um avatar para continuar.');
      return;
    }

    setError('');
    setIsSaving(true);
    const result = await onComplete({ name: cleanName, avatar });
    setIsSaving(false);
    if (!result?.success) setError(result?.error || 'Não foi possível salvar seu perfil. Tente novamente.');
  };

  const isProfileStep = step === INTRO_STEPS.length;
  const CurrentIcon = !isProfileStep ? INTRO_STEPS[step].icon : UserRound;

  return (
    <div className="first-visit-page">
      <section className="first-visit-card">
        <img className="first-visit-logo" src="/logo.png" alt="GamificaEdu" />

        <div className="first-visit-progress" aria-label={`Etapa ${step + 1} de ${INTRO_STEPS.length + 1}`}>
          {INTRO_STEPS.map((item, index) => (
            <span key={item.title} className={index <= step ? 'active' : ''} />
          ))}
          <span className={isProfileStep ? 'active' : ''} />
        </div>

        <div className={`first-visit-icon ${isProfileStep ? 'profile' : ''}`}>
          <CurrentIcon size={38} />
        </div>

        {!isProfileStep ? (
          <>
            <span className="first-visit-kicker">CONHEÇA O GAMIFICAEdu</span>
            <h1 className="first-visit-title">{INTRO_STEPS[step].title}</h1>
            <p className="first-visit-description">{INTRO_STEPS[step].description}</p>
            <div className="first-visit-actions">
              {step > 0 && (
                <button className="first-visit-back" onClick={() => setStep(current => current - 1)}>
                  <ArrowLeft size={18} /> Voltar
                </button>
              )}
              <button className="first-visit-next" onClick={() => setStep(current => current + 1)}>
                Próximo <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="first-visit-kicker">PERSONALIZE SEU PERFIL</span>
            <h1 className="first-visit-title">Escolha seu nome e avatar</h1>
            <p className="first-visit-description">
              Esse nome e personagem vão aparecer no seu perfil, nas partidas e no ranking.
            </p>

            <form className="first-visit-form" onSubmit={completeSetup}>
              <label htmlFor="first-visit-name">Nome de usuário</label>
              <input
                id="first-visit-name"
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="Como quer ser chamado?"
                minLength={2}
                maxLength={40}
                autoComplete="nickname"
                required
                disabled={isSaving}
              />

              <span className="first-visit-avatar-label">Escolha seu avatar</span>
              <div className="first-visit-avatar-grid">
                {OFFICIAL_AVATARS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={`first-visit-avatar ${avatar === item.id ? 'selected' : ''}`}
                    onClick={() => { setAvatar(item.id); setError(''); }}
                    aria-label={item.name}
                    aria-pressed={avatar === item.id}
                    disabled={isSaving}
                  >
                    <img
                      className="first-visit-avatar-image"
                      src={`${item.id}?v=2`}
                      alt={item.name}
                      width="58"
                      height="58"
                      loading="eager"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>

              {error && <p className="first-visit-error" role="alert">{error}</p>}

              <div className="first-visit-actions">
                <button
                  type="button"
                  className="first-visit-back"
                  onClick={() => { setStep(current => current - 1); setError(''); }}
                  disabled={isSaving}
                >
                  <ArrowLeft size={18} /> Voltar
                </button>
                <button className="first-visit-next" type="submit" disabled={isSaving}>
                  {isSaving ? <><Loader2 size={18} className="first-visit-spinner" /> Salvando...</> : <>Entrar no app <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>
          </>
        )}
      </section>

      <style>{`
        .first-visit-page {
          display: grid;
          min-height: 100vh;
          place-items: center;
          padding: 22px 14px;
          background: linear-gradient(145deg, #eef2ff, #f8fafc 55%, #f5f3ff);
          font-family: inherit;
        }

        .first-visit-card {
          width: min(100%, 470px);
          padding: 24px 22px;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 20px 55px rgba(30, 41, 59, 0.13);
          text-align: center;
        }

        .first-visit-logo {
          width: 112px;
          max-height: 68px;
          margin-bottom: 16px;
          object-fit: contain;
        }

        .first-visit-progress {
          display: flex;
          justify-content: center;
          gap: 7px;
          margin-bottom: 22px;
        }

        .first-visit-progress span {
          width: 25px;
          height: 6px;
          border-radius: 99px;
          background: #e2e8f0;
          transition: background 180ms ease, width 180ms ease;
        }

        .first-visit-progress span.active {
          width: 38px;
          background: #7c3aed;
        }

        .first-visit-icon {
          display: grid;
          width: 82px;
          height: 82px;
          place-items: center;
          margin: 0 auto 15px;
          border-radius: 26px;
          background: linear-gradient(135deg, #ede9fe, #dbeafe);
          color: #6d28d9;
        }

        .first-visit-icon.profile {
          background: linear-gradient(135deg, #dcfce7, #dbeafe);
          color: #059669;
        }

        .first-visit-kicker {
          color: #7c3aed;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .first-visit-title {
          margin: 9px 0;
          color: #1e293b;
          font-size: clamp(1.45rem, 6vw, 1.9rem);
          font-weight: 950;
          line-height: 1.15;
        }

        .first-visit-description {
          min-height: 70px;
          margin: 0 auto 20px;
          color: #64748b;
          font-size: 0.98rem;
          line-height: 1.55;
        }

        .first-visit-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .first-visit-back,
        .first-visit-next {
          display: flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border: 0;
          border-radius: 14px;
          cursor: pointer;
          font: inherit;
          font-weight: 850;
        }

        .first-visit-back {
          background: #f1f5f9;
          color: #475569;
        }

        .first-visit-next {
          flex: 1;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 6px 14px rgba(91, 33, 182, 0.2);
          color: white;
        }

        .first-visit-next:disabled,
        .first-visit-back:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        .first-visit-form {
          text-align: left;
        }

        .first-visit-form label,
        .first-visit-avatar-label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 0.88rem;
          font-weight: 850;
        }

        .first-visit-form input {
          box-sizing: border-box;
          width: 100%;
          min-height: 48px;
          margin-bottom: 16px;
          padding: 11px 13px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          background: #f8fafc;
          color: #1e293b;
          font: inherit;
          outline: none;
        }

        .first-visit-form input:focus {
          border-color: #8b5cf6;
          background: white;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
        }

        .first-visit-avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .first-visit-avatar {
          display: grid;
          min-width: 0;
          min-height: 70px;
          aspect-ratio: 1;
          place-items: center;
          padding: 5px;
          border: 2px solid #e2e8f0;
          border-radius: 18px;
          background: #f8fafc;
          cursor: pointer;
          transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
        }

        .first-visit-avatar-image {
          display: block;
          width: min(100%, 58px);
          height: auto;
          aspect-ratio: 1;
          border-radius: 50%;
          object-fit: contain;
          background: white;
        }

        .first-visit-avatar:hover {
          transform: translateY(-2px);
        }

        .first-visit-avatar.selected {
          border-color: #7c3aed;
          background: #f3e8ff;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
        }

        .first-visit-error {
          margin: 12px 0 0;
          color: #dc2626;
          font-size: 0.84rem;
          font-weight: 750;
        }

        .first-visit-spinner {
          animation: firstVisitSpin 1s linear infinite;
        }

        @keyframes firstVisitSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 380px) {
          .first-visit-card { padding: 20px 16px; }
          .first-visit-avatar-grid { gap: 7px; }
          .first-visit-avatar { border-radius: 15px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .first-visit-progress span,
          .first-visit-avatar { transition: none; }
          .first-visit-spinner { animation-duration: 2s; }
        }
      `}</style>
    </div>
  );
}
