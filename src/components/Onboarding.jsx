import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('splash');
  const [role, setRole] = useState(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [regEmail, setRegEmail] = useState('');
  const [regGrade, setRegGrade] = useState('9');
  const [regInvite, setRegInvite] = useState('');
  const [regSubject, setRegSubject] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPass2, setRegPass2] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);
    const result = await onComplete({ action: 'login', email: loginEmail, password: loginPass });
    setIsLoading(false);
    if (result && !result.success) setFormError(result.error);
  };

  const handleGoogleLogin = async () => {
    setFormError('');
    setIsLoading(true);
    const result = await onComplete({
      action: 'google',
      role: role || 'aluno',
      grade: regGrade,
      subject: regSubject,
    });
    setIsLoading(false);
    if (result && !result.success && result.error) setFormError(result.error);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    if (regPass !== regPass2) { setFormError('As senhas não coincidem.'); return; }
    if (regPass.length < 6) { setFormError('A senha deve ter pelo menos 6 caracteres.'); return; }
    setIsLoading(true);
    const result = await onComplete({
      action: 'register',
      email: regEmail,
      password: regPass,
      grade: regGrade,
      role,
      inviteCode: regInvite,
      subject: regSubject,
    });
    setIsLoading(false);
    if (result && !result.success) setFormError(result.error);
  };

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">

        {/* === SPLASH === */}
        {step === 'splash' && (
          <div className="splash-screen">
            <img src="/logo.png" alt="GamificaEdu Logo" className="auth-logo" />
            <h2 className="welcome-title" style={{ color: '#4FB0FF' }}>Bem-vindo(a)!</h2>
            <p className="welcome-subtitle">Prepare-se para uma aventura incrível no seu aprendizado!</p>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '2rem auto', maxWidth: '235px' }}>
              <img src="/botoes aluno e professor.png" alt="Botões" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <div
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', cursor: 'pointer', zIndex: 10 }}
                onClick={() => { setRole('aluno'); setStep('login'); setFormError(''); }}
                title="Sou Aluno"
              />
              <div
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', cursor: 'pointer', zIndex: 10 }}
                onClick={() => { setRole('professor'); setStep('login'); setFormError(''); }}
                title="Sou Professor"
              />
            </div>
          </div>
        )}

        {/* === LOGIN === */}
        {step === 'login' && (
          <div className="login-screen slide-in">
            <button className="back-link modern-back" onClick={() => { setStep('splash'); setFormError(''); }}>
              <ArrowLeft size={20} /> Voltar
            </button>
            <img src="/logo.png" alt="Logo" className="auth-logo-small" />
            <h3 className="form-title">Entrar como {role === 'aluno' ? 'Aluno 🧑‍🎓' : 'Professor 👨‍🏫'}</h3>

            {formError && (
              <div className="form-alert error">
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            {/* Botão Google */}
            <button className="google-btn" onClick={handleGoogleLogin} disabled={isLoading}>
              <GoogleIcon />
              {isLoading ? <Loader2 size={18} className="spin" /> : 'Continuar com Google'}
            </button>

            <div className="divider"><span>ou entre com e-mail</span></div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>E-mail</label>
                <input
                  type="email"
                  className="custom-input"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    className="custom-input"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    placeholder="Sua senha secreta..."
                    required
                    disabled={isLoading}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowLoginPass(p => !p)}>
                    {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                {isLoading ? <Loader2 size={20} className="spin" /> : 'Entrar ➔'}
              </button>
            </form>

            <div className="toggle-form">
              <p>Ainda não tem conta? <span onClick={() => { setStep('register'); setFormError(''); }}>Cadastre-se</span></p>
            </div>
          </div>
        )}

        {/* === REGISTER === */}
        {step === 'register' && (
          <div className="register-screen slide-in">
            <button className="back-link modern-back" onClick={() => { setStep('login'); setFormError(''); }}>
              <ArrowLeft size={20} /> Voltar
            </button>
            <h3 className="form-title">Criar Conta {role === 'aluno' ? '🧑‍🎓' : '👨‍🏫'}</h3>

            {formError && (
              <div className="form-alert error">
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            {/* Botão Google no cadastro também */}
            <button className="google-btn" onClick={handleGoogleLogin} disabled={isLoading}>
              <GoogleIcon />
              {isLoading ? <Loader2 size={18} className="spin" /> : 'Cadastrar com Google'}
            </button>

            <div className="divider"><span>ou preencha os dados</span></div>

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" className="custom-input" value={regEmail} onChange={e => setRegEmail(e.target.value)} required disabled={isLoading} placeholder="seu@email.com" />
              </div>

              {role === 'aluno' && (
                <>
                  <div className="input-group">
                    <label>Série / Turma Escolar</label>
                    <select className="custom-input" value={regGrade} onChange={e => setRegGrade(e.target.value)} disabled={isLoading}>
                      <option value="9">🎓 9º Ano</option>
                    </select>
                    <small style={{ fontSize: '0.72rem', color: '#6366f1', marginTop: '4px', display: 'block' }}>
                      🚀 O GamificaEdu está focado no 9º Ano.
                    </small>
                  </div>
                  <div className="input-group">
                    <label>Código da Turma (opcional)</label>
                    <input type="text" className="custom-input" value={regInvite} onChange={e => setRegInvite(e.target.value)} placeholder="Ex: GMF-2026" disabled={isLoading} />
                  </div>
                </>
              )}

              {role === 'professor' && (
                <div className="input-group">
                  <label>Disciplina Principal</label>
                  <input type="text" className="custom-input" value={regSubject} onChange={e => setRegSubject(e.target.value)} placeholder="Ex: Matemática" required disabled={isLoading} />
                </div>
              )}

              <div className="input-group">
                <label>Criar Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    className="custom-input"
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowRegPass(p => !p)}>
                    {showRegPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Confirmar Senha</label>
                <input type="password" className="custom-input" value={regPass2} onChange={e => setRegPass2(e.target.value)} required disabled={isLoading} placeholder="Repita a senha" />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                {isLoading ? <Loader2 size={20} className="spin" /> : 'Finalizar Cadastro ➔'}
              </button>
            </form>

            <div className="toggle-form">
              <p>Já tem uma conta? <span onClick={() => { setStep('login'); setFormError(''); }}>Faça Login</span></p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 1rem;
          background: transparent;
        }

        .auth-card {
          width: 100%;
          padding: 2.5rem 2rem;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(10px);
          text-align: center;
          border-radius: 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 8px rgba(255,255,255,0.4);
        }

        .auth-logo {
          max-width: 220px;
          width: 100%;
          height: auto;
          margin-bottom: 1.5rem;
          object-fit: contain;
        }

        .auth-logo-small {
          max-width: 120px;
          margin-bottom: 1rem;
        }

        .welcome-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          font-weight: 600;
        }

        .form-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.2rem;
          text-align: left;
        }
        .form-alert.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        /* Botão Google */
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0.9rem 1.2rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0;
          font-family: inherit;
        }
        .google-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Divisor */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.2rem 0;
          color: #9ca3af;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .modern-back {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
        }
        .modern-back:hover { color: var(--text-main); }

        .form-title {
          font-size: 1.8rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .input-group {
          margin-bottom: 1.2rem;
          text-align: left;
        }
        .input-group label {
          display: block;
          font-weight: 800;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .custom-input {
          width: 100%;
          padding: 1rem 1.2rem;
          border: 2px solid var(--border-light);
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          outline: none;
          background: var(--background);
          color: var(--text-main);
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .custom-input:focus {
          background: #fff;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(157, 116, 255, 0.15);
        }
        .custom-input:disabled { opacity: 0.6; }

        .pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
        }

        .toggle-form {
          margin-top: 2rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .toggle-form span {
          color: var(--primary);
          cursor: pointer;
          font-weight: 800;
        }

        .w-100 {
          width: 100%;
          padding: 1.2rem;
          font-weight: 900;
          font-size: 1.1rem;
          color: #fff;
          background: linear-gradient(135deg, #10B981, #059669);
          border: none;
          border-radius: 16px;
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3), inset 0 -3px 0 rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }
        .w-100:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px rgba(16, 185, 129, 0.4), inset 0 -3px 0 rgba(0,0,0,0.1);
        }
        .w-100:disabled { opacity: 0.7; cursor: not-allowed; }

        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
