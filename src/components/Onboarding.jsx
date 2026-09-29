import React, { useState } from 'react';
import { Gamepad2, UserCircle2, ArrowLeft, Send } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState('splash'); // splash, login, register
  const [role, setRole] = useState(null); // 'aluno' | 'professor'

  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regGrade, setRegGrade] = useState('6');
  const [regInvite, setRegInvite] = useState('');
  const [regSubject, setRegSubject] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login for now - always bypasses to Dashboard
    onComplete({ name: loginId || 'Jogador', grade: '9', role: role || 'aluno' });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    onComplete({ name: regName || 'Novo Jogador', grade: role === 'aluno' ? regGrade : 'Professor', role });
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">

        {step === 'splash' && (
          <div className="splash-screen">
            <img src="/logo.png" alt="GamificaEdu Logo" className="auth-logo" />
            <h2 className="welcome-title" style={{ color: '#4FB0FF' }}>Bem-vindo(a)!</h2>
            <p className="welcome-subtitle">Prepare-se para uma aventura incrível no seu aprendizado!</p>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '2rem auto', maxWidth: '235px' }}>
              <img src="/botoes aluno e professor.png" alt="Botões" style={{ width: '100%', height: 'auto', display: 'block' }} />

              {/* Overlay invisível para Aluno (metade SUPERIOR) */}
              <div
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', cursor: 'pointer', zIndex: 10 }}
                onClick={() => { setRole('aluno'); setStep('login'); }}
                title="Sou Aluno"
              />

              {/* Overlay invisível para Professor (metade INFERIOR) */}
              <div
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', cursor: 'pointer', zIndex: 10 }}
                onClick={() => { setRole('professor'); setStep('login'); }}
                title="Sou Professor"
              />
            </div>
          </div>
        )}

        {step === 'login' && (
          <div className="login-screen slide-in">
            <button className="back-link modern-back" onClick={() => setStep('splash')}><ArrowLeft size={20} /> Voltar</button>
            <img src="/logo.png" alt="Logo" className="auth-logo-small bouncy-logo" />
            <h3 className="form-title">Entrar como {role === 'aluno' ? 'Aluno' : 'Professor'}</h3>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>{role === 'aluno' ? 'Matrícula ou E-mail' : 'E-mail Institucional'}</label>
                <input
                  type="text"
                  className="custom-input"
                  value={loginId}
                  onChange={e => setLoginId(e.target.value)}
                  placeholder="Seu usuário..."
                  required
                />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input
                  type="password"
                  className="custom-input"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  placeholder="Sua senha secreta..."
                  required
                />
              </div>
              <div className="forgot-password">
                <span>Esqueci minha senha</span>
              </div>
              <button type="submit" className="btn btn-primary w-100">Entrar ➔</button>
            </form>

            <div className="toggle-form">
              <p>Ainda não tem conta? <span onClick={() => setStep('register')}>Cadastre-se</span></p>
            </div>
          </div>
        )}

        {step === 'register' && (
          <div className="register-screen slide-in">
            <button className="back-link modern-back" onClick={() => setStep('login')}><ArrowLeft size={20} /> Voltar</button>
            <h3 className="form-title">Criar Conta</h3>

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Nome Completo (ou Apelido Heróico)</label>
                <input type="text" className="custom-input" value={regName} onChange={e => setRegName(e.target.value)} required />
              </div>

              {role === 'aluno' && (
                <>
                  <div className="input-group">
                    <label>Matrícula / E-mail</label>
                    <input type="text" className="custom-input" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>Série / Ano</label>
                    <select className="custom-input" value={regGrade} onChange={e => setRegGrade(e.target.value)}>
                      <option value="6">6º Ano</option>
                      <option value="7">7º Ano</option>
                      <option value="8">8º Ano</option>
                      <option value="9">9º Ano</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Código da Turma (Convite)</label>
                    <input type="text" className="custom-input" value={regInvite} onChange={e => setRegInvite(e.target.value)} placeholder="Ex: GMF-2026" />
                  </div>
                </>
              )}

              {role === 'professor' && (
                <>
                  <div className="input-group">
                    <label>E-mail Institucional</label>
                    <input type="email" className="custom-input" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>Disciplina Principal</label>
                    <input type="text" className="custom-input" value={regSubject} onChange={e => setRegSubject(e.target.value)} placeholder="Ex: Matemática" required />
                  </div>
                </>
              )}

              <div className="input-group">
                <label>Criar Senha</label>
                <input type="password" className="custom-input" value={regPass} onChange={e => setRegPass(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary w-100">Finalizar Cadastro ➔</button>
            </form>

            <div className="toggle-form">
              <p>Já tem uma conta? <span onClick={() => setStep('login')}>Faça Login</span></p>
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
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.95);
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
          text-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .welcome-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          font-weight: 600;
        }

        .role-selection {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .role-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 1.2rem;
          border-radius: 20px;
          font-size: 1.2rem;
          font-weight: 800;
          cursor: pointer;
          border: none;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: white;
        }

        .role-btn:active {
          transform: scale(0.95);
        }

        .role-btn.aluno { 
          background: linear-gradient(135deg, #4FB0FF, #2b8ee3);
          box-shadow: 0 10px 20px rgba(79, 176, 255, 0.3), inset 0 -4px 0 rgba(0,0,0,0.1); 
        }
        .role-btn.aluno:hover { transform: translateY(-5px); box-shadow: 0 15px 25px rgba(79, 176, 255, 0.4), inset 0 -4px 0 rgba(0,0,0,0.1); }
        
        .role-btn.professor { 
          background: linear-gradient(135deg, #9D74FF, #8253e6);
          box-shadow: 0 10px 20px rgba(157, 116, 255, 0.3), inset 0 -4px 0 rgba(0,0,0,0.1); 
        }
        .role-btn.professor:hover { transform: translateY(-5px); box-shadow: 0 15px 25px rgba(157, 116, 255, 0.4), inset 0 -4px 0 rgba(0,0,0,0.1); }

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
        .modern-back:hover {
          color: var(--text-main);
        }

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
        }

        .custom-input:focus {
          background: #fff;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(157, 116, 255, 0.15);
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 1.5rem;
        }
        
        .forgot-password span {
          color: var(--primary);
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
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
          text-decoration: none;
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
        }

        .w-100:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px rgba(16, 185, 129, 0.4), inset 0 -3px 0 rgba(0,0,0,0.1);
        }
        
        .w-100:active {
          transform: scale(0.97);
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
