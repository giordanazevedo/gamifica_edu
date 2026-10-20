import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Clock, Copy, Crown, LogOut, Play, Users, X } from 'lucide-react';
import AvatarDisplay from './AvatarDisplay';
import {
  createStopRoom,
  joinStopRoom,
  leaveStopRoom,
  startStopRoomRound,
  STOP_CATEGORY_IDS,
  submitStopRoomAnswers,
  subscribeToStopRoom,
} from '../services/stopRoomService';

const CATEGORIES = [
  { id: 'portugues', name: 'Língua Portuguesa' },
  { id: 'matematica', name: 'Matemática & Física' },
  { id: 'ciencias', name: 'Ciências & Biologia' },
  { id: 'historia', name: 'História & Sociedade' },
  { id: 'geografia', name: 'Geografia' },
];

const EMPTY_ANSWERS = Object.fromEntries(STOP_CATEGORY_IDS.map((id) => [id, '']));

export default function OnlineStopGame({ profile, onExit }) {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState(null);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!roomCode) return undefined;
    return subscribeToStopRoom(
      roomCode,
      (nextRoom) => {
        setRoom(nextRoom);
        if (!nextRoom || nextRoom.status !== 'playing') {
          submittedRef.current = false;
        }
      },
      () => setError('Não foi possível acompanhar a sala. Confira sua conexão.')
    );
  }, [roomCode]);

  const myPlayer = room?.players?.[profile?.uid];
  const players = useMemo(
    () => Object.values(room?.players || {}).sort((a, b) => a.joinedAt - b.joinedAt),
    [room?.players]
  );

  const submitAnswers = useCallback(async () => {
    if (!roomCode || submittedRef.current) return;
    submittedRef.current = true;
    const result = await submitStopRoomAnswers(roomCode, profile.uid, answers);
    if (!result.success) {
      submittedRef.current = false;
      setError(result.error);
    }
  }, [answers, profile.uid, roomCode]);

  useEffect(() => {
    if (room?.status !== 'playing' || myPlayer?.submitted || !room.deadline) return undefined;
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((room.deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) submitAnswers();
    };
    updateTime();
    const timer = setInterval(updateTime, 250);
    return () => clearInterval(timer);
  }, [room?.status, room?.deadline, myPlayer?.submitted, submitAnswers]);

  const handleCreateRoom = async () => {
    setError('');
    setIsLoading(true);
    const result = await createStopRoom(profile);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setRoomCode(result.code);
  };

  const handleJoinRoom = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await joinStopRoom(roomCodeInput, profile);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setRoomCode(result.code);
  };

  const handleStartRound = async () => {
    setError('');
    const result = await startStopRoomRound(roomCode, profile.uid);
    if (!result.success) setError(result.error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitAnswers();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      console.error('Erro ao copiar código da sala:', copyError);
      setError('Não foi possível copiar. Anote o código para compartilhar.');
    }
  };

  const handleExit = async () => {
    if (roomCode && profile?.uid) {
      const result = await leaveStopRoom(roomCode, profile.uid);
      if (!result.success) {
        setError(result.error);
        return;
      }
    }
    onExit();
  };

  return (
    <section className="online-stop-card" role="dialog" aria-modal="true" aria-labelledby="online-stop-title">
      <header className="online-stop-header">
        <div>
          <span className="online-stop-kicker">STOP • MULTIPLAYER</span>
          <h2 id="online-stop-title">🛑 Stop em grupo</h2>
        </div>
        <button type="button" className="online-stop-close" onClick={handleExit} aria-label="Sair do Stop">
          <X size={20} />
        </button>
      </header>

      {error && <p className="online-stop-error" role="alert">{error}</p>}

      {!roomCode && (
        <div className="online-stop-entry">
          <p>Crie uma sala e convide até 7 amigos, ou entre com o código de uma sala existente.</p>
          <button type="button" className="online-stop-primary" onClick={handleCreateRoom} disabled={isLoading}>
            <Users size={18} /> {isLoading ? 'Criando sala...' : 'Criar sala'}
          </button>
          <div className="online-stop-separator"><span>ou entre em uma sala</span></div>
          <form className="online-stop-join" onSubmit={handleJoinRoom}>
            <input
              aria-label="Código da sala"
              autoComplete="off"
              maxLength={6}
              placeholder="Código com 6 caracteres"
              value={roomCodeInput}
              onChange={(event) => setRoomCodeInput(event.target.value.toUpperCase())}
            />
            <button type="submit" className="online-stop-secondary" disabled={isLoading || roomCodeInput.length !== 6}>
              Entrar
            </button>
          </form>
        </div>
      )}

      {roomCode && !room && (
        <div className="online-stop-entry">
          <p>Conectando à sala <strong>{roomCode}</strong>...</p>
        </div>
      )}

      {room?.status === 'waiting' && (
        <div className="online-stop-lobby">
          <div className="online-stop-room-code">
            <div><span>CÓDIGO DA SALA</span><strong>{roomCode}</strong></div>
            <button type="button" onClick={handleCopyCode} aria-label="Copiar código">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="online-stop-help">Compartilhe o código. A partida comporta até 8 jogadores.</p>
          <div className="online-stop-player-list">
            {players.map((player) => (
              <div className="online-stop-player" key={player.uid}>
                <span className="online-stop-avatar"><AvatarDisplay avatar={player.avatar} size="34px" /></span>
                <strong>{player.name}</strong>
                {player.uid === room.hostUid && <span className="online-stop-host">ANFITRIÃO</span>}
              </div>
            ))}
          </div>
          {room.hostUid === profile.uid ? (
            <button
              type="button"
              className="online-stop-primary"
              onClick={handleStartRound}
              disabled={players.length < 2}
            >
              <Play size={18} fill="currentColor" />
              {players.length < 2 ? 'Aguardando mais jogadores' : 'Iniciar partida'}
            </button>
          ) : (
            <p className="online-stop-help">Aguardando o anfitrião iniciar a partida...</p>
          )}
          <span className="online-stop-player-count">{players.length}/8 jogadores</span>
        </div>
      )}

      {room?.status === 'playing' && myPlayer && (
        myPlayer.submitted ? (
          <div className="online-stop-waiting">
            <div className="online-stop-letter">{room.letter}</div>
            <h3>Resposta enviada!</h3>
            <p>Você fez {myPlayer.score} pontos. Aguardando os outros jogadores terminarem.</p>
            <div className="online-stop-player-list compact">
              {players.map((player) => (
                <div className="online-stop-player" key={player.uid}>
                  <span className="online-stop-avatar"><AvatarDisplay avatar={player.avatar} size="34px" /></span>
                  <strong>{player.name}</strong>
                  <span className={`online-stop-status ${player.submitted ? 'done' : ''}`}>{player.submitted ? 'Pronto' : 'Jogando'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form className="online-stop-round" onSubmit={handleSubmit}>
            <div className="online-stop-round-hud">
              <div><span>LETRA</span><strong>{room.letter}</strong></div>
              <div className={`online-stop-clock ${timeLeft <= 10 ? 'urgent' : ''}`}><Clock size={18} /> {timeLeft}s</div>
            </div>
            {CATEGORIES.map((category) => (
              <label className="online-stop-category" key={category.id}>
                <span>{category.name}</span>
                <input
                  autoComplete="off"
                  placeholder={`Palavra com ${room.letter}...`}
                  value={answers[category.id]}
                  onChange={(event) => setAnswers((current) => ({ ...current, [category.id]: event.target.value }))}
                />
              </label>
            ))}
            <button type="submit" className="online-stop-primary">
              <Check size={18} /> STOP! Enviar respostas
            </button>
          </form>
        )
      )}

      {room?.status === 'results' && (
        <div className="online-stop-results">
          <span className="online-stop-kicker">RODADA FINALIZADA • LETRA {room.letter}</span>
          <h3>Placar da sala</h3>
          {players
            .slice()
            .sort((a, b) => b.score - a.score || (a.submittedAt || Infinity) - (b.submittedAt || Infinity))
            .map((player, index) => (
              <div className={`online-stop-result-row ${index === 0 ? 'winner' : ''}`} key={player.uid}>
                <span className="online-stop-rank">{index === 0 ? <Crown size={18} /> : `${index + 1}º`}</span>
                <strong>{player.name}{player.uid === profile.uid ? ' (você)' : ''}</strong>
                <span>{player.score} pts</span>
              </div>
            ))}
          <button type="button" className="online-stop-secondary full" onClick={handleExit}>
            <LogOut size={17} /> Sair da sala
          </button>
        </div>
      )}

      {room && room.status === 'closed' && (
        <div className="online-stop-entry">
          <p>Esta sala foi encerrada.</p>
          <button type="button" className="online-stop-secondary full" onClick={onExit}>Voltar</button>
        </div>
      )}

      <style>{`
        .online-stop-card {
          box-sizing: border-box;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 22px;
          border: 1px solid #ddd6fe;
          border-radius: 24px;
          background: #fff;
          color: #1e293b;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
        }
        .online-stop-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .online-stop-kicker { color: #7c3aed; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.12em; }
        .online-stop-header h2 { margin: 4px 0 0; font-size: 1.45rem; font-weight: 900; }
        .online-stop-close { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 0; border-radius: 50%; background: #f1f5f9; color: #475569; cursor: pointer; }
        .online-stop-entry, .online-stop-lobby, .online-stop-round, .online-stop-results, .online-stop-waiting { display: flex; flex-direction: column; gap: 14px; }
        .online-stop-entry > p, .online-stop-help, .online-stop-waiting p { margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.5; text-align: center; }
        .online-stop-primary, .online-stop-secondary { min-height: 46px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 16px; border: 0; border-radius: 13px; font-size: 0.92rem; font-weight: 850; cursor: pointer; }
        .online-stop-primary { background: linear-gradient(135deg, #7c3aed, #5b21b6); color: #fff; box-shadow: 0 6px 16px rgba(124, 58, 237, 0.22); }
        .online-stop-primary:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
        .online-stop-secondary { border: 1px solid #ddd6fe; background: #f5f3ff; color: #6d28d9; }
        .online-stop-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
        .online-stop-secondary.full { width: 100%; }
        .online-stop-separator { display: flex; align-items: center; gap: 12px; color: #94a3b8; font-size: 0.75rem; }
        .online-stop-separator::before, .online-stop-separator::after { content: ''; height: 1px; flex: 1; background: #e2e8f0; }
        .online-stop-join { display: flex; gap: 8px; }
        .online-stop-join input, .online-stop-category input { min-width: 0; flex: 1; padding: 12px; border: 1px solid #cbd5e1; border-radius: 11px; font: inherit; color: #1e293b; }
        .online-stop-join input { text-transform: uppercase; letter-spacing: 0.12em; }
        .online-stop-error { margin: 0; padding: 10px 12px; border-radius: 10px; background: #fef2f2; color: #b91c1c; font-size: 0.84rem; font-weight: 700; }
        .online-stop-room-code { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px; border: 1px dashed #c4b5fd; border-radius: 16px; background: #f5f3ff; }
        .online-stop-room-code div { display: flex; flex-direction: column; gap: 4px; }
        .online-stop-room-code div span { color: #7c3aed; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.1em; }
        .online-stop-room-code strong { color: #4c1d95; font-size: 1.8rem; letter-spacing: 0.2em; }
        .online-stop-room-code button { display: flex; align-items: center; gap: 6px; padding: 9px 10px; border: 0; border-radius: 10px; background: #fff; color: #6d28d9; font-size: 0.8rem; font-weight: 800; cursor: pointer; }
        .online-stop-player-list { display: flex; flex-direction: column; gap: 8px; }
        .online-stop-player { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; }
        .online-stop-player strong { min-width: 0; flex: 1; overflow: hidden; color: #334155; font-size: 0.86rem; text-overflow: ellipsis; white-space: nowrap; }
        .online-stop-avatar { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 50%; background: #f1f5f9; font-size: 1.25rem; flex-shrink: 0; }
        .online-stop-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .online-stop-host { padding: 4px 6px; border-radius: 6px; background: #ede9fe; color: #6d28d9; font-size: 0.58rem; font-weight: 900; }
        .online-stop-player-count { color: #64748b; font-size: 0.76rem; text-align: center; }
        .online-stop-round-hud { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: 15px; background: #f5f3ff; }
        .online-stop-round-hud > div:first-child { display: flex; flex-direction: column; gap: 2px; }
        .online-stop-round-hud > div:first-child span { color: #7c3aed; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.1em; }
        .online-stop-round-hud > div:first-child strong { color: #4c1d95; font-size: 1.8rem; }
        .online-stop-clock { display: flex; align-items: center; gap: 6px; color: #334155; font-size: 1rem; font-weight: 900; }
        .online-stop-clock.urgent { color: #dc2626; }
        .online-stop-category { display: flex; flex-direction: column; gap: 6px; color: #475569; font-size: 0.8rem; font-weight: 800; }
        .online-stop-category input { box-sizing: border-box; width: 100%; font-size: 0.9rem; }
        .online-stop-waiting { align-items: center; text-align: center; }
        .online-stop-letter { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #7c3aed; color: #fff; font-size: 2rem; font-weight: 900; }
        .online-stop-waiting h3, .online-stop-results h3 { margin: 0; color: #1e1b4b; font-size: 1.25rem; font-weight: 900; }
        .online-stop-player-list.compact { width: 100%; }
        .online-stop-status { color: #d97706; font-size: 0.75rem; font-weight: 800; }
        .online-stop-status.done { color: #059669; }
        .online-stop-results > .online-stop-kicker { text-align: center; }
        .online-stop-results h3 { text-align: center; }
        .online-stop-result-row { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .online-stop-result-row.winner { border-color: #fbbf24; background: #fffbeb; }
        .online-stop-rank { width: 28px; display: flex; align-items: center; justify-content: center; color: #7c3aed; font-weight: 900; }
        .online-stop-result-row strong { flex: 1; color: #334155; font-size: 0.85rem; }
        .online-stop-result-row > span:last-child { color: #5b21b6; font-size: 0.85rem; font-weight: 900; }
        @media (max-width: 380px) {
          .online-stop-card { padding: 16px; }
          .online-stop-room-code strong { font-size: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
