import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { submitBattleAnswer, cancelQuickMatch, claimBattleReward } from '../services/pvpService';
import { Zap, Swords, Clock, Award, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import AvatarDisplay from './AvatarDisplay';

const WIN_XP = 300;
const DRAW_XP = 150;
const PARTICIPATION_XP = 75;

export default function PvPBattleArena({
  battleId,
  currentUid,
  onExit,
  onFinishReward
}) {
  const [battle, setBattle] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [inCountdown, setInCountdown] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(30);
  const [roundFeedback, setRoundFeedback] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [rewardGranted, setRewardGranted] = useState(false);

  const timerRef = useRef(null);
  const rewardRequested = useRef(false);

  // Escuta a sala de batalha em TEMPO REAL via Firestore
  useEffect(() => {
    if (!battleId) return;

    const unsub = onSnapshot(doc(db, 'battles', battleId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBattle(data);
      }
    });

    return () => unsub();
  }, [battleId]);

  const isLive = battle?.status === 'in_progress';

  // Contagem regressiva inicial: só começa quando os dois jogadores estão na sala
  useEffect(() => {
    if (!isLive || !inCountdown) return undefined;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    setInCountdown(false);
    return undefined;
  }, [isLive, inCountdown, countdown]);

  const isPlayer1 = battle?.player1?.uid === currentUid;
  const me = isPlayer1 ? battle?.player1 : battle?.player2;
  const opponent = isPlayer1 ? battle?.player2 : battle?.player1;
  const isTugOfWar = battle?.gameMode === 'tug_of_war';
  const currentIdx = isTugOfWar
    ? battle?.currentQuestionIdx || 0
    : me?.currentQuestion || 0;
  const currentQuestion = battle?.questions?.[currentIdx];
  const questionSizeClass = (currentQuestion?.question?.length || 0) > 220
    ? 'question-text-very-long'
    : (currentQuestion?.question?.length || 0) > 120
      ? 'question-text-long'
      : '';
  const questionCount = battle?.questions?.length || 0;
  const isFinished = battle?.status === 'finished';
  const hasFinishedQuestions = questionCount > 0 && currentIdx >= questionCount;

  // Reseta estado quando o progresso deste jogador avançar para outra pergunta.
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setRoundFeedback(null);
    setTimer(30);
  }, [currentIdx]);

  // Cronômetro da pergunta ativa (não corre enquanto espera o oponente)
  useEffect(() => {
    if (!isLive || inCountdown || isAnswered || !currentQuestion) return undefined;

    timerRef.current = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLive, inCountdown, isAnswered, currentIdx, currentQuestion]);

  // Trata tempo esgotado
  useEffect(() => {
    if (timer > 0 || isAnswered || !isLive || inCountdown || !currentQuestion) return;
    clearInterval(timerRef.current);
    setIsAnswered(true);
    setRoundFeedback('timeout');

    submitBattleAnswer({
      battleId,
      isPlayer1,
      questionIdx: currentIdx,
      isCorrect: false,
      pointsEarned: 0
    });
  }, [timer, isAnswered, isLive, inCountdown, currentQuestion, battleId, isPlayer1, currentIdx]);

  // Trata clique na resposta
  const handleSelectOption = (idx) => {
    if (isAnswered || inCountdown || !isLive) return;
    clearInterval(timerRef.current);

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correct;
    // Bônus de velocidade: quanto mais rápido responder dentro dos 30s, mais pontos!
    const points = isCorrect ? (100 + timer * 5) : 0;

    setRoundFeedback(isCorrect ? 'correct' : 'wrong');

    submitBattleAnswer({
      battleId,
      isPlayer1,
      questionIdx: currentIdx,
      isCorrect,
      pointsEarned: points
    });
  };

  const isWinner = battle?.winner === currentUid;
  const isDraw = battle?.winner === 'draw';
  const earnedXp = isWinner ? WIN_XP : isDraw ? DRAW_XP : PARTICIPATION_XP;

  // Concede recompensa de XP uma única vez por batalha (registrado na própria sala)
  useEffect(() => {
    if (!isFinished || !me || !onFinishReward || rewardRequested.current) return;
    rewardRequested.current = true;
    claimBattleReward(battleId, currentUid)
      .then((claimed) => {
        if (claimed) onFinishReward(earnedXp, isWinner);
        setRewardGranted(claimed);
      })
      .catch((error) => console.error('Erro ao resgatar recompensa da batalha:', error));
  }, [isFinished, me, onFinishReward, battleId, currentUid, earnedXp, isWinner]);

  const handleCancelWaiting = async () => {
    if (isPlayer1) await cancelQuickMatch(battleId);
    onExit();
  };

  if (!battle) {
    return (
      <div className="arena-waiting-container">
        <p>Carregando a sala de batalha...</p>
      </div>
    );
  }

  if (battle.status === 'cancelled') {
    return (
      <div className="arena-waiting-container">
        <h2>Duelo cancelado</h2>
        <p>Esta batalha foi cancelada ou o desafio foi recusado.</p>
        <button className="back-lobby-btn" onClick={onExit}>
          Voltar para o Lobby de Batalha
        </button>
      </div>
    );
  }

  // Se ainda estiver aguardando oponente aceitar
  if (battle?.status === 'waiting' || battle?.status === 'waiting_quickmatch') {
    return (
      <div className="arena-waiting-container">
        <div className="waiting-battle-card">
          <div className="waiting-card-glow" />
          <div className="waiting-card-content">
            <div className="waiting-emblem">
              <span className="pulsing-swords">
                <img src="/duelo.png" alt="" />
              </span>
              <span className="waiting-emblem-dot" />
            </div>
            <span className="waiting-kicker">
              {battle.status === 'waiting' ? 'CONVITE ENVIADO' : 'BUSCA EM ANDAMENTO'}
            </span>
            <h2>{battle.status === 'waiting' ? 'Desafio lançado!' : 'Aguardando oponente...'}</h2>
            <p className="waiting-description">
              {battle.status === 'waiting'
                ? 'A batalha começa quando o outro jogador aceitar o desafio.'
                : 'A arena está pronta. Assim que alguém entrar, a batalha começa!'}
            </p>

            <div className="waiting-player-card">
              <AvatarDisplay avatar={me?.avatar || '👦🏽'} size="48px" />
              <div className="waiting-player-info">
                <span>VOCÊ ESTÁ PRONTO</span>
                <strong>{me?.name || 'Jogador'}</strong>
              </div>
              <span className="waiting-ready-badge">PRONTO</span>
            </div>

            <div className="waiting-progress" aria-label="Aguardando resposta do oponente">
              <span className="waiting-progress-step complete"><CheckCircle2 size={16} /> Desafio enviado</span>
              <span className="waiting-progress-line" />
              <span className="waiting-progress-step active"><span className="waiting-progress-dot" /> Aguardando resposta</span>
            </div>

            <span className="waiting-subject">
              <Swords size={15} />
              Duelo de {battle.subject?.toUpperCase() || 'GERAL'}
            </span>
            <button className="cancel-match-btn" onClick={handleCancelWaiting}>
              <ArrowLeft size={17} />
              Cancelar e voltar ao lobby
            </button>
          </div>
        </div>
        <style>{`
          .arena-waiting-container {
            min-height: min(620px, 68vh);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 12px;
            text-align: center;
          }

          .waiting-battle-card {
            width: 100%;
            max-width: 460px;
            position: relative;
            overflow: hidden;
            padding: 3px;
            border-radius: 30px;
            background: linear-gradient(135deg, #a78bfa, #7c3aed 45%, #fbbf24);
            box-shadow: 0 24px 55px rgba(76, 29, 149, 0.17);
            animation: waitingCardEnter 0.45s ease both;
          }

          .waiting-card-glow {
            position: absolute;
            width: 220px;
            height: 220px;
            top: -120px;
            left: calc(50% - 110px);
            border-radius: 50%;
            background: rgba(167, 139, 250, 0.35);
            filter: blur(28px);
            pointer-events: none;
          }

          .waiting-card-content {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: clamp(24px, 6vw, 36px) clamp(18px, 5vw, 30px) 26px;
            border-radius: 27px;
            background: linear-gradient(160deg, #fff 0%, #fbfaff 62%, #f8f7ff 100%);
          }

          @keyframes waitingCardEnter {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .waiting-emblem {
            width: 94px;
            height: 94px;
            position: relative;
            display: grid;
            place-items: center;
            margin-bottom: 2px;
            border: 1px solid #ede9fe;
            border-radius: 28px;
            background: linear-gradient(145deg, #f5f3ff, #fff7ed);
          }

          .waiting-emblem .pulsing-swords {
            width: 68px;
            height: 68px;
            display: grid;
            place-items: center;
            border-radius: 22px;
            background: white;
            box-shadow: 0 8px 20px rgba(124, 58, 237, 0.12);
            animation: swordsPulse 1.5s infinite alternate;
          }

          .waiting-emblem .pulsing-swords img {
            width: 54px;
            height: 54px;
            object-fit: contain;
          }

          .waiting-emblem-dot {
            position: absolute;
            right: 3px;
            bottom: 5px;
            width: 14px;
            height: 14px;
            border: 3px solid white;
            border-radius: 50%;
            background: #34d399;
            box-shadow: 0 0 0 3px #d1fae5;
          }

          .waiting-kicker {
            padding: 6px 10px;
            border-radius: 999px;
            background: #f3e8ff;
            color: #7c3aed;
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 0.1em;
          }

          .waiting-card-content h2 {
            margin: 0;
            color: #172033;
            font-size: clamp(1.45rem, 5vw, 1.8rem);
            font-weight: 950;
            letter-spacing: -0.04em;
          }

          .waiting-description {
            max-width: 330px;
            margin: 0;
            color: #64748b;
            font-size: 0.92rem;
            line-height: 1.55;
          }

          .waiting-player-card {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 8px;
            padding: 12px;
            border: 1px solid #e9e5f5;
            border-radius: 18px;
            background: white;
            text-align: left;
          }

          .waiting-player-info {
            min-width: 0;
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 3px;
          }

          .waiting-player-info span {
            color: #94a3b8;
            font-size: 0.61rem;
            font-weight: 900;
            letter-spacing: 0.07em;
          }

          .waiting-player-info strong {
            overflow: hidden;
            color: #1e293b;
            font-size: 0.9rem;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .waiting-ready-badge {
            padding: 6px 8px;
            border-radius: 9px;
            background: #dcfce7;
            color: #15803d;
            font-size: 0.62rem;
            font-weight: 900;
          }

          .waiting-progress {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 4px 0;
            color: #64748b;
          }

          .waiting-progress-step {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 0.65rem;
            font-weight: 800;
            white-space: nowrap;
          }

          .waiting-progress-step.complete { color: #059669; }
          .waiting-progress-step.active { color: #7c3aed; }

          .waiting-progress-line {
            width: clamp(12px, 5vw, 32px);
            height: 2px;
            border-radius: 2px;
            background: #ddd6fe;
          }

          .waiting-progress-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #8b5cf6;
            box-shadow: 0 0 0 4px #ede9fe;
            animation: waitingDotPulse 1.5s ease-in-out infinite;
          }

          @keyframes waitingDotPulse {
            50% { box-shadow: 0 0 0 7px rgba(237, 233, 254, 0.45); }
          }

          .waiting-subject {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #64748b;
            font-size: 0.72rem;
            font-weight: 800;
          }

          .cancel-match-btn {
            width: 100%;
            min-height: 48px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 4px;
            padding: 11px 16px;
            border: 1px solid #ddd6fe;
            border-radius: 14px;
            background: white;
            color: #6d28d9;
            font-size: 0.84rem;
            font-weight: 850;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .cancel-match-btn:hover {
            background: #f5f3ff;
            transform: translateY(-1px);
          }

          @media (max-width: 400px) {
            .arena-waiting-container { padding: 14px 4px; }
            .waiting-card-content { gap: 10px; }
            .waiting-progress { gap: 6px; }
            .waiting-progress-step { font-size: 0.58rem; }
          }
        `}</style>
      </div>
    );
  }

  // Contagem regressiva antes de iniciar
  if (inCountdown && !isFinished) {
    return (
      <div className="duel-intro">
        <div className="duel-intro-glow" />
        <div className="duel-intro-content">
          <span className="duel-kicker">{isTugOfWar ? 'DUELO DE MATEMÁTICA' : 'BATALHA 1V1'}</span>
          <h1 className="duel-heading">
            {isTugOfWar ? 'Cabo de guerra matemático!' : 'Prepare-se para o duelo!'}
          </h1>

          <div className="duel-lineup">
            <div className="duel-player-card">
              <span className="duel-player-avatar">
                <AvatarDisplay avatar={me?.avatar || '👦🏽'} size="48px" />
              </span>
              <span className="duel-player-name">{me?.name || 'Você'}</span>
            </div>

            <div className="duel-center-icon">
              <img src="/duelo.png" alt="Duelo" />
            </div>

            <div className="duel-player-card opponent">
              <span className="duel-player-avatar">
                <AvatarDisplay avatar={opponent?.avatar || '👤'} size="48px" />
              </span>
              <span className="duel-player-name">{opponent?.name || 'Oponente'}</span>
            </div>
          </div>

          <div className="duel-countdown" key={countdown > 0 ? countdown : 'fight'}>
            {countdown > 0 ? countdown : 'LUTA!'}
          </div>
          <p className="duel-tip">
            {isTugOfWar
              ? 'Acertem as questões para puxar a corda para o seu lado!'
              : 'Responda rápido e some pontos para vencer!'}
          </p>
        </div>

        <style>{`
          .duel-intro {
            position: relative;
            isolation: isolate;
            box-sizing: border-box;
            width: 100%;
            min-height: min(560px, 75vh);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 28px 16px;
            border: 1px solid rgba(196, 181, 253, 0.8);
            border-radius: 28px;
            background: radial-gradient(ellipse at 50% 10%, #f5f3ff 0%, #ffffff 58%, #eff6ff 100%);
            box-shadow: 0 18px 50px rgba(76, 29, 149, 0.12);
            font-family: 'Inter', 'Segoe UI', sans-serif;
          }

          .duel-intro-glow {
            position: absolute;
            z-index: -1;
            top: 24%;
            left: 50%;
            width: 210px;
            height: 210px;
            border-radius: 50%;
            background: rgba(167, 139, 250, 0.18);
            filter: blur(38px);
            transform: translateX(-50%);
            animation: duelGlow 2.4s ease-in-out infinite alternate;
          }

          .duel-intro-content {
            width: 100%;
            max-width: 430px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .duel-kicker {
            padding: 6px 12px;
            border: 1px solid #ddd6fe;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.85);
            color: #6d28d9;
            font-size: 0.7rem;
            font-weight: 900;
            letter-spacing: 0.16em;
          }

          .duel-heading {
            margin: 12px 0 24px;
            color: #1e1b4b;
            font-size: clamp(1.45rem, 6vw, 2rem);
            font-weight: 900;
            letter-spacing: -0.045em;
            line-height: 1.1;
            text-wrap: balance;
          }

          .duel-lineup {
            box-sizing: border-box;
            width: 100%;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 58px minmax(0, 1fr);
            align-items: center;
            gap: 8px;
            padding: 14px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.88);
            box-shadow: 0 10px 30px rgba(30, 27, 75, 0.08);
          }

          .duel-player-card {
            min-width: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .duel-player-card.opponent {
            flex-direction: row-reverse;
          }

          .duel-player-avatar {
            box-sizing: border-box;
            width: 54px;
            height: 54px;
            display: flex;
            flex: 0 0 54px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 3px solid white;
            border-radius: 50%;
            background: linear-gradient(135deg, #ede9fe, #dbeafe);
            box-shadow: 0 4px 12px rgba(76, 29, 149, 0.18);
          }

          .duel-player-name {
            min-width: 0;
            color: #334155;
            font-size: clamp(0.65rem, 2.6vw, 0.82rem);
            font-weight: 800;
            line-height: 1.2;
            overflow-wrap: anywhere;
          }

          .duel-center-icon {
            width: 58px;
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: linear-gradient(145deg, #f5f3ff, #ede9fe);
            box-shadow: 0 5px 16px rgba(124, 58, 237, 0.16);
            animation: duelIconFloat 1.8s ease-in-out infinite;
          }

          .duel-center-icon img {
            display: block;
            width: 42px !important;
            height: 42px !important;
            max-width: 42px !important;
            max-height: 42px !important;
            object-fit: contain;
          }

          .duel-countdown {
            width: 104px;
            height: 104px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 28px;
            border: 4px solid rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            background: linear-gradient(145deg, #8b5cf6, #6d28d9);
            box-shadow: 0 12px 32px rgba(109, 40, 217, 0.3), inset 0 2px 8px rgba(255,255,255,0.28);
            color: white;
            font-size: ${countdown > 0 ? '3.6rem' : '1.65rem'};
            font-weight: 1000;
            letter-spacing: -0.06em;
            animation: duelCountPop 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both, duelCountPulse 0.9s ease-in-out 0.55s infinite alternate;
          }

          .duel-tip {
            margin: 16px 0 0;
            color: #64748b;
            font-size: 0.88rem;
            font-weight: 650;
          }

          @keyframes duelGlow {
            from { opacity: 0.55; transform: translateX(-50%) scale(0.88); }
            to { opacity: 1; transform: translateX(-50%) scale(1.12); }
          }

          @keyframes duelIconFloat {
            0%, 100% { transform: translateY(0) rotate(-4deg); }
            50% { transform: translateY(-5px) rotate(4deg); }
          }

          @keyframes duelCountPop {
            from { opacity: 0; transform: scale(0.45) rotate(-12deg); }
            to { opacity: 1; transform: scale(1) rotate(0); }
          }

          @keyframes duelCountPulse {
            from { transform: scale(1); }
            to { transform: scale(1.07); }
          }

          @media (max-width: 360px) {
            .duel-lineup { grid-template-columns: minmax(0, 1fr) 48px minmax(0, 1fr); gap: 4px; padding: 12px 6px; }
            .duel-center-icon { width: 48px; height: 48px; }
            .duel-center-icon img { width: 36px !important; height: 36px !important; max-width: 36px !important; max-height: 36px !important; }
            .duel-player-avatar { width: 46px; height: 46px; flex-basis: 46px; }
            .duel-player-avatar img { width: 40px !important; height: 40px !important; }
            .duel-player-card { gap: 5px; }
          }
        `}</style>
      </div>
    );
  }

  // TELA DE VITÓRIA / DERROTA
  if (isFinished) {
    return (
      <div className="arena-result-container">
        <div className={`result-card ${isWinner ? 'win' : isDraw ? 'draw' : 'lose'}`}>
          <div className="trophy-wrapper">
            {isWinner ? (
              <div className="winner-animation">
                <img className="winner-trophy-image" src="/trofeu.png" alt="Troféu da vitória" />
                <div className="confetti-particles">🎉 👑 ⚡ 🏆 ✨</div>
              </div>
            ) : isDraw ? (
              <Swords size={72} color="#3b82f6" />
            ) : (
              <Award size={72} color="#94a3b8" />
            )}
          </div>

          <h1 className={`result-title ${isWinner ? 'winner-title' : ''}`}>
            {isWinner ? 'VITÓRIA ÉPICA!' : isDraw ? 'EMPATE DISPUTADO!' : 'FIM DA BATALHA!'}
          </h1>
          <p className="result-subtitle">
            {isWinner
              ? isTugOfWar
                ? 'Você puxou a corda até a vitória com seus acertos!'
                : 'Você derrotou seu oponente com reflexos e conhecimento afiado!'
              : isDraw
              ? 'Uma batalha equilibrada até o último segundo!'
              : isTugOfWar
                ? 'Seu oponente puxou a corda desta vez. Tente novamente!'
                : 'Foi por pouco! Pratique mais e vença a próxima revanche!'}
          </p>

          <div className="final-scoreboard">
            <div className={`player-final-card ${isWinner ? 'winner-glow' : ''}`}>
              <span className="final-avatar"><AvatarDisplay avatar={me?.avatar} size="46px" /></span>
              <strong>{me?.name}</strong>
              <span className="final-score">{me?.score || 0} pts</span>
            </div>
            <div className="score-divider">VS</div>
            <div className={`player-final-card ${!isWinner && !isDraw ? 'winner-glow' : ''}`}>
              <span className="final-avatar"><AvatarDisplay avatar={opponent?.avatar} size="46px" /></span>
              <strong>{opponent?.name}</strong>
              <span className="final-score">{opponent?.score || 0} pts</span>
            </div>
          </div>

          <div className="xp-reward-box">
            <Zap size={22} color="#eab308" />
            <span>
              +{earnedXp} XP
            </span>
            <small>{rewardGranted ? 'adicionados ao ranking' : 'recompensa desta batalha'}</small>
          </div>

          <button className="back-lobby-btn" onClick={onExit}>
            Voltar para o Lobby de Batalha
          </button>
        </div>
        <style>{`
          .arena-result-container {
            width: min(100%, 520px);
            margin: 0 auto;
            padding: 18px 14px 28px;
            color: #172033;
            font-family: inherit;
          }

          .arena-result-container .result-card {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
            overflow: hidden;
            padding: 28px 20px 22px;
            border: 1px solid #e2e8f0;
            border-radius: 28px;
            background: linear-gradient(180deg, #fff 0%, #f8faff 100%);
            box-shadow: 0 18px 45px rgba(30, 41, 59, 0.12);
            text-align: center;
          }

          .arena-result-container .result-card::before {
            position: absolute;
            inset: 0 0 auto;
            height: 7px;
            background: linear-gradient(90deg, #fbbf24, #f97316);
            content: '';
          }

          .arena-result-container .result-card.lose::before {
            background: linear-gradient(90deg, #94a3b8, #64748b);
          }

          .arena-result-container .result-card.draw::before {
            background: linear-gradient(90deg, #60a5fa, #8b5cf6);
          }

          .arena-result-container .trophy-wrapper {
            display: grid;
            width: 96px;
            height: 96px;
            place-items: center;
            border-radius: 28px;
            background: #fff7dd;
          }

          .arena-result-container .winner-animation {
            position: relative;
            display: grid;
            place-items: center;
            animation: resultTrophyPop 650ms cubic-bezier(.2, .8, .2, 1) both;
          }

          .arena-result-container .winner-trophy-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
            filter: drop-shadow(0 5px 7px rgba(180, 83, 9, 0.2));
          }

          .arena-result-container .confetti-particles {
            position: absolute;
            top: -10px;
            left: 50%;
            width: max-content;
            font-size: 15px;
            transform: translateX(-50%);
          }

          .arena-result-container .result-title {
            margin: 0;
            color: #172033;
            font-size: clamp(1.55rem, 7vw, 2rem);
            font-weight: 950;
            letter-spacing: -0.04em;
            line-height: 1.1;
          }

          .arena-result-container .result-title.winner-title {
            background: linear-gradient(100deg, #f59e0b 8%, #facc15 48%, #ea580c 92%);
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 3px 0 rgba(217, 119, 6, 0.13));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .arena-result-container .result-subtitle {
            max-width: 360px;
            margin: 0;
            color: #64748b;
            font-size: 0.98rem;
            line-height: 1.5;
          }

          .arena-result-container .final-scoreboard {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr);
            align-items: center;
            gap: 8px;
            width: 100%;
            margin: 4px 0;
          }

          .arena-result-container .player-final-card {
            display: flex;
            min-width: 0;
            flex-direction: column;
            align-items: center;
            gap: 7px;
            padding: 14px 8px;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            background: #f8fafc;
          }

          .arena-result-container .player-final-card.winner-glow {
            border-color: #fbbf24;
            background: linear-gradient(180deg, #fffbeb, #fff7dd);
            box-shadow: 0 6px 18px rgba(245, 158, 11, 0.12);
          }

          .arena-result-container .final-avatar {
            display: grid;
            width: 64px;
            height: 64px;
            place-items: center;
            border: 3px solid white;
            border-radius: 50%;
            background: white;
            box-shadow: 0 3px 10px rgba(15, 23, 42, 0.12);
          }

          .arena-result-container .player-final-card strong {
            max-width: 100%;
            overflow: hidden;
            color: #273449;
            font-size: clamp(0.78rem, 3.5vw, 0.95rem);
            font-weight: 850;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .arena-result-container .final-score {
            color: #5b42c8;
            font-size: 1.1rem;
            font-weight: 950;
          }

          .arena-result-container .score-divider {
            color: #94a3b8;
            font-size: 0.68rem;
            font-weight: 950;
          }

          .arena-result-container .xp-reward-box {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #fde68a;
            border-radius: 16px;
            background: #fffbeb;
            color: #92400e;
            font-size: 1rem;
            font-weight: 900;
          }

          .arena-result-container .xp-reward-box small {
            color: #a16207;
            font-size: 0.78rem;
            font-weight: 700;
          }

          .arena-result-container .back-lobby-btn {
            width: 100%;
            min-height: 52px;
            padding: 13px 16px;
            border: 0;
            border-radius: 16px;
            background: linear-gradient(135deg, #7c3aed, #5b21b6);
            box-shadow: 0 8px 18px rgba(91, 33, 182, 0.22);
            color: white;
            cursor: pointer;
            font: inherit;
            font-size: 0.96rem;
            font-weight: 850;
            transition: transform 160ms ease, box-shadow 160ms ease;
          }

          .arena-result-container .back-lobby-btn:hover {
            box-shadow: 0 10px 24px rgba(91, 33, 182, 0.3);
            transform: translateY(-2px);
          }

          @keyframes resultTrophyPop {
            from { opacity: 0; transform: scale(.7) rotate(-8deg); }
            to { opacity: 1; transform: scale(1) rotate(0); }
          }

          @media (max-width: 380px) {
            .arena-result-container { padding: 12px 8px 20px; }
            .arena-result-container .result-card { gap: 11px; padding: 24px 14px 18px; }
            .arena-result-container .final-scoreboard { grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1fr); gap: 5px; }
            .arena-result-container .player-final-card { padding: 11px 5px; }
          }

          @media (prefers-reduced-motion: reduce) {
            .arena-result-container .winner-animation { animation: none; }
          }
        `}</style>
      </div>
    );
  }

  if (hasFinishedQuestions) {
    return (
      <div className="arena-waiting-container">
        <div className="pulsing-swords">
          <img src="/duelo.png" alt="Duelo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
        </div>
        <h2>Você terminou suas perguntas!</h2>
        <p>
          {opponent?.name || 'O oponente'} ainda está respondendo.
          O resultado aparece assim que a batalha acabar.
        </p>
        <div className="round-badge">
          Sua pontuação: {me?.score || 0} pts
        </div>
      </div>
    );
  }

  // ARENA DE BATALHA AO VIVO
  return (
    <div className="pvp-arena-wrapper">
      {/* HUD SUPERIOR DE COMBATE */}
      <div className="combat-hud">
        {/* Você */}
        <div className="hud-player me">
          <div className="hud-avatar-wrapper">
            <span className="hud-avatar"><AvatarDisplay avatar={me?.avatar} size="42px" /></span>
            {me?.lastAnswerCorrect === true && <span className="status-badge hit">🔥 +pts</span>}
            {me?.lastAnswerCorrect === false && <span className="status-badge miss">❌</span>}
          </div>
          <div className="hud-info">
            <span className="hud-name">{me?.name || 'Você'}</span>
            {!isTugOfWar && (
              <div className="hud-hp-bar">
                <div
                  className="hud-hp-fill me-hp"
                  style={{ width: `${Math.max(5, me?.health ?? 100)}%` }}
                ></div>
              </div>
            )}
            <span className="hud-score">{me?.score || 0} pts</span>
          </div>
        </div>

        {/* Cronômetro Central */}
        <div className="hud-center-timer">
          <div className={`timer-circle ${timer <= 8 ? 'timer-danger' : timer <= 15 ? 'timer-warn' : ''}`}>
            <Clock size={16} />
            <span>{timer}s</span>
          </div>
          <span className="round-badge">
            {isTugOfWar ? `PERGUNTA ${currentIdx + 1}/${questionCount}` : `Q ${currentIdx + 1}/${questionCount}`}
          </span>
        </div>

        {/* Oponente */}
        <div className="hud-player opp">
          <div className="hud-info opp-info">
            <span className="hud-name">{opponent?.name || 'Oponente'}</span>
            {!isTugOfWar && (
              <div className="hud-hp-bar">
                <div
                  className="hud-hp-fill opp-hp"
                  style={{ width: `${Math.max(5, opponent?.health ?? 100)}%` }}
                ></div>
              </div>
            )}
            <span className="hud-score">{opponent?.score || 0} pts</span>
          </div>
          <div className="hud-avatar-wrapper">
            <span className="hud-avatar"><AvatarDisplay avatar={opponent?.avatar} size="42px" /></span>
            <span className="status-badge opp-acted">
              {opponent?.currentQuestion >= questionCount
                ? '🏁 Finalizou'
                : `Q ${opponent?.currentQuestion || 0}/${questionCount}`}
            </span>
          </div>
        </div>
      </div>

      {isTugOfWar && (
        <div className="tug-of-war-panel">
          <div className="tug-of-war-players">
            <div className="tug-of-war-player">
              <span>{me?.name || 'Você'}</span>
            </div>
            <span className="tug-of-war-vs">VS</span>
            <div className="tug-of-war-player opponent">
              <span>{opponent?.name || 'Oponente'}</span>
            </div>
          </div>
          <div className="tug-of-war-track">
            <span className="tug-goal left">VITÓRIA</span>
            <span className="tug-goal right">VITÓRIA</span>
            <span className="tug-center-mark" />
            <span
              className="tug-side-avatar left"
              title={me?.name || 'Você'}
              aria-label={`Avatar de ${me?.name || 'Você'}`}
            >
              <AvatarDisplay avatar={me?.avatar || '👦🏽'} size="58px" />
            </span>
            <span
              className="tug-rope-knot"
              style={{
                left: `calc(50% - ${(isPlayer1 ? (battle?.tugPosition || 0) : -(battle?.tugPosition || 0)) * 12}%)`
              }}
            >
              🪢
            </span>
            <span
              className="tug-side-avatar right"
              title={opponent?.name || 'Oponente'}
              aria-label={`Avatar de ${opponent?.name || 'Oponente'}`}
            >
              <AvatarDisplay avatar={opponent?.avatar || '👤'} size="58px" />
            </span>
          </div>
          <p className="tug-of-war-hint">
            {me?.answeredCurrent
              ? 'Resposta enviada! Aguarde o outro jogador para avançar.'
              : opponent?.answeredCurrent
                ? 'Seu oponente já respondeu. Responda para puxar a corda!'
                : 'Cada resposta correta puxa a corda para o seu lado.'}
          </p>
        </div>
      )}

      {/* FEEDBACK STATUS RÁPIDO */}
      {roundFeedback && (
        <div className={`round-feedback-banner ${roundFeedback}`}>
          {roundFeedback === 'correct' && (
            <>
              <CheckCircle2 size={20} />
              <span>ACERTOU! Resposta Rápida! +{100 + timer * 5} pts</span>
            </>
          )}
          {roundFeedback === 'wrong' && (
            <>
              <XCircle size={20} />
              <span>ERROU! Tente acertar a próxima pergunta.</span>
            </>
          )}
          {roundFeedback === 'timeout' && (
            <>
              <Clock size={20} />
              <span>TEMPO ESGOTADO!</span>
            </>
          )}
        </div>
      )}

      {/* CARD DA PERGUNTA */}
      <div className="battle-question-card">
        <div className="question-header">
          <span className="subject-tag">Matéria: {currentQuestion?.subject || 'Geral'}</span>
          <span className="points-tip">+{100 + timer * 5} pts se acertar agora!</span>
        </div>
        <h3 className={`question-text ${questionSizeClass}`}>{currentQuestion?.question}</h3>
      </div>

      {/* OPÇÕES DE RESPOSTA */}
      <div className="battle-options-grid">
        {currentQuestion?.options?.map((opt, idx) => {
          let btnClass = 'battle-opt-btn';
          if (isAnswered) {
            if (idx === currentQuestion.correct) btnClass += ' correct';
            else if (selectedOption === idx) btnClass += ' wrong';
            else btnClass += ' dimmed';
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
            >
              <span className="opt-letter">{['A', 'B', 'C', 'D'][idx]}</span>
              <span className="opt-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* ESTILOS DA ARENA */}
      <style>{`
        .pvp-arena-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* COMBAT HUD */
        .combat-hud {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
          border-radius: 20px;
          padding: 14px;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(49, 46, 129, 0.4);
          position: relative;
        }

        .hud-player {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .hud-player.opp {
          justify-content: flex-end;
          text-align: right;
        }

        .hud-avatar-wrapper {
          position: relative;
        }

        .hud-avatar {
          font-size: 2.2rem;
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          padding: 4px;
        }

        .status-badge {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 10px;
          white-space: nowrap;
        }

        .status-badge.hit { background: #10b981; color: white; }
        .status-badge.miss { background: #ef4444; color: white; }
        .status-badge.opp-acted { background: #eab308; color: #1e1b4b; }

        .hud-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hud-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #e0e7ff;
        }

        .hud-hp-bar {
          width: 75px;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .hud-hp-fill {
          height: 100%;
          transition: width 0.4s ease;
        }

        .me-hp { background: #10b981; }
        .opp-hp { background: #ef4444; }

        .hud-score {
          font-size: 0.8rem;
          font-weight: 800;
          color: #facc15;
        }

        .tug-of-war-panel {
          padding: 18px;
          border: 1px solid #bfdbfe;
          border-radius: 18px;
          background: linear-gradient(135deg, #eff6ff, #f5f3ff);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08);
        }

        .tug-of-war-players {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 14px;
        }

        .tug-of-war-player {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #1e3a8a;
          font-size: 0.76rem;
          font-weight: 850;
        }

        .tug-of-war-player > span {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tug-of-war-player.opponent {
          flex-direction: row-reverse;
          color: #9a3412;
          text-align: right;
        }

        .tug-of-war-vs {
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 1000;
        }

        .tug-of-war-track {
          position: relative;
          height: 104px;
          margin: 4px 0 0;
          border-radius: 24px;
          background: linear-gradient(90deg, #dbeafe 0%, #f8fafc 48%, #f8fafc 52%, #ffedd5 100%);
          overflow: hidden;
        }

        .tug-of-war-track::before {
          position: absolute;
          top: 50%;
          left: 7%;
          right: 7%;
          height: 9px;
          border-radius: 999px;
          background: repeating-linear-gradient(90deg, #92400e 0 12px, #d6a64f 12px 24px);
          box-shadow: 0 2px 4px rgba(120, 53, 15, 0.25);
          content: '';
          transform: translateY(-50%);
        }

        .tug-goal {
          position: absolute;
          top: 9px;
          color: #64748b;
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          z-index: 1;
        }

        .tug-goal.left { left: 14px; color: #2563eb; }
        .tug-goal.right { right: 14px; color: #ea580c; }

        .tug-center-mark {
          position: absolute;
          top: 24px;
          bottom: 24px;
          left: 50%;
          width: 3px;
          border-radius: 3px;
          background: rgba(71, 85, 105, 0.45);
        }

        .tug-side-avatar {
          position: absolute;
          z-index: 2;
          top: 50%;
          display: flex;
          width: 68px;
          height: 68px;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
          transform: translate(-50%, -50%);
        }

        .tug-side-avatar.left {
          left: 8%;
          background: #2563eb;
        }

        .tug-side-avatar.right {
          left: 92%;
          background: #ea580c;
        }

        .tug-rope-knot {
          position: absolute;
          z-index: 3;
          top: 50%;
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          border-radius: 50%;
          background: #fef3c7;
          box-shadow: 0 4px 10px rgba(120, 53, 15, 0.35);
          font-size: 1.55rem;
          transition: left 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translate(-50%, -50%);
        }

        .tug-of-war-hint {
          margin: 11px 0 0;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          text-align: center;
        }

        .hud-center-timer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin: 0 8px;
        }

        .timer-circle {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 10px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.9rem;
          color: #a7f3d0;
          transition: all 0.3s ease;
        }

        .timer-circle.timer-warn {
          background: rgba(245, 158, 11, 0.3);
          color: #fbbf24;
        }

        .timer-circle.timer-danger {
          background: rgba(239, 68, 68, 0.4);
          color: #f87171;
          animation: pulseFast 0.5s infinite;
        }

        @keyframes pulseFast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .round-badge {
          font-size: 0.7rem;
          font-weight: 700;
          color: #93c5fd;
          text-transform: uppercase;
        }

        /* FEEDBACK BANNER */
        .round-feedback-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 700;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .round-feedback-banner.correct {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .round-feedback-banner.wrong, .round-feedback-banner.timeout {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        /* CARD DE PERGUNTA */
        .battle-question-card {
          background: white;
          border-radius: 20px;
          padding: 18px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 2px solid rgba(157, 116, 255, 0.2);
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .subject-tag {
          color: #7c3aed;
          background: #f3e8ff;
          padding: 4px 10px;
          border-radius: 8px;
          text-transform: capitalize;
        }

        .points-tip {
          color: #d97706;
          background: #fef3c7;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .question-text {
          font-size: clamp(0.95rem, 4vw, 1.05rem);
          font-weight: 700;
          color: #1e293b;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .question-text-long {
          font-size: clamp(0.9rem, 3.6vw, 0.98rem);
        }

        .question-text-very-long {
          font-size: clamp(0.82rem, 3.2vw, 0.9rem);
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .battle-question-card {
            padding: 14px;
          }

          .question-header {
            flex-wrap: wrap;
            gap: 6px;
          }

          .battle-opt-btn {
            min-width: 0;
            padding: 11px 12px;
            font-size: 0.9rem;
          }

          .opt-text {
            min-width: 0;
            overflow-wrap: anywhere;
          }
        }

        /* OPÇÕES DE RESPOSTA */
        .battle-options-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .battle-opt-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .battle-opt-btn:hover:not(:disabled) {
          border-color: #9d74ff;
          background: #fbf9ff;
          transform: translateY(-2px);
        }

        .opt-letter {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #ede9fe;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          flex-shrink: 0;
        }

        .battle-opt-btn.correct {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
        }
        .battle-opt-btn.correct .opt-letter {
          background: #10b981;
          color: white;
        }

        .battle-opt-btn.wrong {
          background: #fef2f2;
          border-color: #ef4444;
          color: #991b1b;
        }
        .battle-opt-btn.wrong .opt-letter {
          background: #ef4444;
          color: white;
        }

        .battle-opt-btn.dimmed {
          opacity: 0.5;
        }

        .waiting-opponent-banner {
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #6366f1;
          padding: 10px;
          background: #eef2ff;
          border-radius: 12px;
        }

        .pulse-text {
          animation: pulseOpacity 1.2s infinite;
        }

        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* WAITING & COUNTDOWN STYLES */
        .arena-waiting-container, .arena-countdown-container {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          padding: 24px;
        }

        .pulsing-swords {
          animation: swordsPulse 1.5s infinite alternate;
          color: #7c3aed;
        }

        @keyframes swordsPulse {
          from { transform: scale(1) rotate(0deg); }
          to { transform: scale(1.15) rotate(10deg); }
        }

        .vs-preview {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .fighter-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .fighter-avatar {
          font-size: 3rem;
          background: white;
          border-radius: 50%;
          padding: 8px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .fighter-name {
          font-weight: 800;
          font-size: 0.95rem;
          color: #1e293b;
        }

        .countdown-number {
          font-size: 4.5rem;
          font-weight: 900;
          color: #7c3aed;
          animation: popCountdown 0.8s infinite;
        }

        @keyframes popCountdown {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }

        .countdown-tip {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        /* RESULT SCREEN */
        .arena-result-container {
          padding: 10px;
        }

        .result-card {
          background: white;
          border-radius: 28px;
          padding: 28px 20px;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .result-card.win { border-top: 8px solid #f59e0b; }
        .result-card.lose { border-top: 8px solid #94a3b8; }
        .result-card.draw { border-top: 8px solid #3b82f6; }

        .result-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #1e293b;
        }

        .result-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.4;
        }

        .final-scoreboard {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          margin: 10px 0;
        }

        .player-final-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: #f8fafc;
          padding: 14px 10px;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
        }

        .player-final-card.winner-glow {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .final-avatar {
          font-size: 2.2rem;
        }

        .final-score {
          font-size: 1.1rem;
          font-weight: 900;
          color: #7c3aed;
        }

        .xp-reward-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef3c7;
          color: #92400e;
          padding: 10px 18px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .back-lobby-btn {
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
          transition: transform 0.2s ease;
        }

        .back-lobby-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
