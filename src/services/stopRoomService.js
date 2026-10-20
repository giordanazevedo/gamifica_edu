import { doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';

const ROOM_CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const STOP_CATEGORY_IDS = ['portugues', 'matematica', 'ciencias', 'historia', 'geografia'];

function createRoomCode() {
  return Array.from({ length: 6 }, () =>
    ROOM_CODE_CHARACTERS[Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length)]
  ).join('');
}

function createPlayer(profile) {
  return {
    uid: profile.uid,
    name: profile.name || 'Jogador',
    avatar: profile.avatar || '👦🏽',
    score: 0,
    answers: null,
    submitted: false,
    submittedAt: null,
    joinedAt: Date.now(),
  };
}

export async function createStopRoom(profile) {
  if (!profile?.uid) return { success: false, error: 'Entre na sua conta para criar uma sala.' };

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createRoomCode();
    const roomRef = doc(db, 'stopRooms', code);
    try {
      const created = await runTransaction(db, async (transaction) => {
        const room = await transaction.get(roomRef);
        if (room.exists()) return false;

        transaction.set(roomRef, {
          code,
          hostUid: profile.uid,
          status: 'waiting',
          round: 0,
          letter: null,
          deadline: null,
          players: { [profile.uid]: createPlayer(profile) },
          createdAt: Date.now(),
        });
        return true;
      });

      if (created) return { success: true, code };
    } catch (error) {
      console.error('Erro ao criar sala de Stop:', error);
      return { success: false, error: 'Não foi possível criar a sala. Tente novamente.' };
    }
  }

  return { success: false, error: 'Não foi possível gerar um código de sala. Tente novamente.' };
}

export async function joinStopRoom(code, profile) {
  const normalizedCode = code.trim().toUpperCase();
  if (!profile?.uid) return { success: false, error: 'Entre na sua conta para entrar em uma sala.' };
  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(normalizedCode)) {
    return { success: false, error: 'Digite um código de sala válido com 6 caracteres.' };
  }

  try {
    const roomRef = doc(db, 'stopRooms', normalizedCode);
    const result = await runTransaction(db, async (transaction) => {
      const roomSnap = await transaction.get(roomRef);
      if (!roomSnap.exists()) return { success: false, error: 'Sala não encontrada. Confira o código.' };

      const room = roomSnap.data();
      const players = room.players || {};
      if (players[profile.uid]) return { success: true, code: normalizedCode };
      if (room.status !== 'waiting') {
        return { success: false, error: 'Esta partida já começou ou terminou.' };
      }
      if (Object.keys(players).length >= 8) {
        return { success: false, error: 'A sala já atingiu o limite de 8 jogadores.' };
      }

      transaction.update(roomRef, {
        players: { ...players, [profile.uid]: createPlayer(profile) },
      });
      return { success: true, code: normalizedCode };
    });
    return result;
  } catch (error) {
    console.error('Erro ao entrar na sala de Stop:', error);
    return { success: false, error: 'Não foi possível entrar na sala. Tente novamente.' };
  }
}

export function subscribeToStopRoom(code, onRoom, onError) {
  return onSnapshot(
    doc(db, 'stopRooms', code),
    (roomSnap) => onRoom(roomSnap.exists() ? roomSnap.data() : null),
    (error) => {
      console.error('Erro ao acompanhar sala de Stop:', error);
      onError(error);
    }
  );
}

export async function startStopRoomRound(code, uid) {
  try {
    const roomRef = doc(db, 'stopRooms', code);
    await runTransaction(db, async (transaction) => {
      const roomSnap = await transaction.get(roomRef);
      if (!roomSnap.exists()) throw new Error('A sala não foi encontrada.');

      const room = roomSnap.data();
      const players = room.players || {};
      if (room.hostUid !== uid) throw new Error('Somente quem criou a sala pode iniciar.');
      if (room.status !== 'waiting') throw new Error('A sala não está aguardando jogadores.');
      if (Object.keys(players).length < 2) throw new Error('É preciso ter pelo menos 2 jogadores.');

      const letters = 'ABCDEFGHIJKLMNOPQRSTUV';
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const resetPlayers = Object.fromEntries(
        Object.entries(players).map(([playerUid, player]) => [
          playerUid,
          { ...player, answers: null, submitted: false, submittedAt: null, score: 0 },
        ])
      );

      transaction.update(roomRef, {
        players: resetPlayers,
        status: 'playing',
        letter,
        round: (room.round || 0) + 1,
        deadline: Date.now() + 60000,
      });
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao iniciar rodada de Stop:', error);
    return { success: false, error: error.message || 'Não foi possível iniciar a rodada.' };
  }
}

function scoreAnswers(answers, letter) {
  let score = 0;
  let validCount = 0;
  for (const categoryId of STOP_CATEGORY_IDS) {
    const answer = (answers[categoryId] || '').trim();
    const isValid = answer.length >= 2 && answer.toLocaleUpperCase('pt-BR').startsWith(letter);
    if (isValid) {
      score += 20;
      validCount += 1;
    }
  }
  if (validCount === STOP_CATEGORY_IDS.length) score += 20;
  return score;
}

export async function submitStopRoomAnswers(code, uid, answers = {}) {
  try {
    const roomRef = doc(db, 'stopRooms', code);
    await runTransaction(db, async (transaction) => {
      const roomSnap = await transaction.get(roomRef);
      if (!roomSnap.exists()) throw new Error('A sala não foi encontrada.');

      const room = roomSnap.data();
      const players = room.players || {};
      const player = players[uid];
      if (room.status !== 'playing' || !player || player.submitted) return;
      const submittedAnswers = Date.now() >= room.deadline ? {} : answers;

      const submittedPlayer = {
        ...player,
        answers: submittedAnswers,
        score: scoreAnswers(submittedAnswers, room.letter),
        submitted: true,
        submittedAt: Date.now(),
      };
      const updatedPlayers = { ...players, [uid]: submittedPlayer };
      const allSubmitted = Object.values(updatedPlayers).every((entry) => entry.submitted);

      transaction.update(roomRef, {
        players: updatedPlayers,
        ...(allSubmitted ? { status: 'results' } : {}),
      });
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar respostas do Stop:', error);
    return { success: false, error: 'Não foi possível enviar suas respostas. Tente novamente.' };
  }
}

export async function leaveStopRoom(code, uid) {
  try {
    const roomRef = doc(db, 'stopRooms', code);
    await runTransaction(db, async (transaction) => {
      const roomSnap = await transaction.get(roomRef);
      if (!roomSnap.exists()) return;

      const room = roomSnap.data();
      const players = { ...(room.players || {}) };
      delete players[uid];
      const playerIds = Object.keys(players);

      if (playerIds.length === 0) {
        transaction.update(roomRef, { players, status: 'closed' });
        return;
      }

      const allSubmitted = Object.values(players).every((player) => player.submitted);
      transaction.update(roomRef, {
        players,
        ...(room.hostUid === uid ? { hostUid: playerIds[0] } : {}),
        ...(room.status === 'playing' && allSubmitted ? { status: 'results' } : {}),
      });
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao sair da sala de Stop:', error);
    return { success: false, error: 'Não foi possível sair da sala. Tente novamente.' };
  }
}
