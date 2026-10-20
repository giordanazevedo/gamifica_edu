// Serviço de PvP, Amizades e Matchmaking em Tempo Real via Firestore
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  runTransaction,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { getPreparedQuestionPool } from '../data/questionBank';

// Gera um código de amigo amigável (ex: LEO-7281)
export function getOrGenerateFriendCode(profile) {
  if (profile?.friendCode) return profile.friendCode;
  const cleanName = (profile?.name || 'EDU').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'JOG';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}-${randomNum}`;
}

// Atualiza presença online do jogador
export async function updatePresence(uid, isOnline = true, friendCode = null) {
  if (!uid) return;
  try {
    const ref = doc(db, 'users', uid);
    const data = {
      isOnline,
      lastActive: serverTimestamp()
    };
    if (friendCode) data.friendCode = friendCode;
    await updateDoc(ref, data);
  } catch (e) {
    console.error('Erro ao atualizar presença:', e);
  }
}

// Busca todos os jogadores online (ativos nos últimos 15 min)
export async function fetchOnlinePlayers(currentUid) {
  try {
    const q = query(
      collection(db, 'users'),
      limit(25)
    );
    const snap = await getDocs(q);
    const players = [];
    snap.forEach((d) => {
      const data = d.data();
      if (data.uid !== currentUid) {
        players.push({
          uid: data.uid,
          name: data.name || 'Jogador',
          avatar: data.avatar || '👦🏽',
          grade: data.role === 'professor' ? 'Professor' : '9',
          level: data.level || 1,
          xp: data.xp || 0,
          friendCode: data.friendCode || '',
          isOnline: data.isOnline !== false
        });
      }
    });
    return players;
  } catch (e) {
    console.error('Erro ao buscar jogadores online:', e);
    return [];
  }
}

// Adiciona um amigo pelo código de amigo ou e-mail
export async function addFriendByCode(currentUid, currentFriends = [], searchCode) {
  try {
    const clean = searchCode.trim().toUpperCase();
    if (!clean) return { success: false, error: 'Digite um código válido!' };

    // Busca usuário com esse friendCode ou email
    const q1 = query(collection(db, 'users'), where('friendCode', '==', clean), limit(1));
    let snap = await getDocs(q1);

    if (snap.empty) {
      const q2 = query(collection(db, 'users'), where('email', '==', searchCode.trim().toLowerCase()), limit(1));
      snap = await getDocs(q2);
    }

    if (snap.empty) {
      return { success: false, error: 'Jogador não encontrado! Verifique o código.' };
    }

    const friendDoc = snap.docs[0];
    const friendData = friendDoc.data();

    if (friendData.uid === currentUid) {
      return { success: false, error: 'Você não pode adicionar a si mesmo!' };
    }

    if (currentFriends.includes(friendData.uid)) {
      return { success: false, error: `${friendData.name} já está na sua lista de amigos!` };
    }

    const updatedFriends = [...currentFriends, friendData.uid];
    await updateDoc(doc(db, 'users', currentUid), {
      friends: updatedFriends
    });

    return {
      success: true,
      friend: {
        uid: friendData.uid,
        name: friendData.name,
        avatar: friendData.avatar || '👦🏽',
        level: friendData.level || 1,
        friendCode: friendData.friendCode
      }
    };
  } catch (e) {
    console.error('Erro ao adicionar amigo:', e);
    return { success: false, error: 'Erro ao conectar. Tente novamente.' };
  }
}

// Remove amigo
export async function removeFriend(currentUid, currentFriends, friendUid) {
  try {
    const updated = currentFriends.filter(id => id !== friendUid);
    await updateDoc(doc(db, 'users', currentUid), {
      friends: updated
    });
    return { success: true, updatedFriends: updated };
  } catch (e) {
    console.error('Erro ao remover amigo:', e);
    return { success: false };
  }
}

// Busca dados detalhados dos amigos
export async function fetchFriendsDetails(friendUids = []) {
  if (!friendUids || friendUids.length === 0) return [];
  try {
    const friends = [];
    for (const uid of friendUids) {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const d = snap.data();
        friends.push({
          uid: d.uid,
          name: d.name,
          avatar: d.avatar || '👦🏽',
          level: d.level || 1,
          xp: d.xp || 0,
          friendCode: d.friendCode || '',
          isOnline: d.isOnline !== false
        });
      }
    }
    return friends;
  } catch (e) {
    console.error('Erro ao buscar detalhes dos amigos:', e);
    return [];
  }
}

// Sorteia perguntas já preparadas no banco local para a disciplina da batalha.
export async function generateBattleQuestions(subjectId = 'geral') {
  const pool = getPreparedQuestionPool(subjectId);
  if (pool.length < 5) {
    throw new Error('Ainda não há cinco perguntas preparadas para essa disciplina.');
  }

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }

  return pool.slice(0, 5).map((question, index) => ({
    ...question,
    id: `prepared-${question.subject}-${Date.now()}-${index}`,
  }));
}

// Envia convite de duelo para um amigo
export async function sendBattleInvite(senderProfile, targetUid, subjectId = 'geral') {
  try {
    const inviteId = `${senderProfile.uid}_vs_${targetUid}_${Date.now()}`;
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const questions = await generateBattleQuestions(subjectId);

    // Cria documento da batalha já preparado
    await setDoc(doc(db, 'battles', battleId), {
      id: battleId,
      status: 'waiting', // waiting, in_progress, finished, cancelled
      subject: subjectId,
      gameMode: subjectId === 'matematica' ? 'tug_of_war' : 'classic',
      tugPosition: 0,
      questions,
      player1: {
        uid: senderProfile.uid,
        name: senderProfile.name,
        avatar: senderProfile.avatar || '👦🏽',
        score: 0,
        health: 100,
        currentQuestion: 0,
        answeredCurrent: false,
        lastAnswerCorrect: null,
        ready: true
      },
      player2: {
        uid: targetUid,
        name: 'Oponente',
        avatar: '👤',
        score: 0,
        health: 100,
        currentQuestion: 0,
        answeredCurrent: false,
        lastAnswerCorrect: null,
        ready: false
      },
      currentQuestionIdx: 0,
      winner: null,
      createdAt: serverTimestamp()
    });

    // Cria o convite para o oponente
    await setDoc(doc(db, 'invites', inviteId), {
      id: inviteId,
      battleId,
      fromUid: senderProfile.uid,
      fromName: senderProfile.name,
      fromAvatar: senderProfile.avatar || '👦🏽',
      toUid: targetUid,
      subject: subjectId,
      status: 'pending', // pending, accepted, declined
      createdAt: serverTimestamp()
    });

    return { success: true, battleId, inviteId };
  } catch (e) {
    console.error('Erro ao enviar convite:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Erro ao enviar desafio.' };
  }
}

// Aceita convite de duelo
export async function acceptBattleInvite(invite, currentProfile) {
  try {
    // Atualiza status do convite
    await updateDoc(doc(db, 'invites', invite.id), {
      status: 'accepted'
    });

    // Atualiza jogador 2 na batalha e inicia a partida
    const battleRef = doc(db, 'battles', invite.battleId);
    await updateDoc(battleRef, {
      status: 'in_progress',
      'player2.uid': currentProfile.uid,
      'player2.name': currentProfile.name,
      'player2.avatar': currentProfile.avatar || '👦🏽',
      'player2.ready': true,
      startedAt: serverTimestamp()
    });

    return { success: true, battleId: invite.battleId };
  } catch (e) {
    console.error('Erro ao aceitar convite:', e);
    return { success: false, error: 'Erro ao aceitar partida.' };
  }
}

// Recusa convite de duelo
export async function declineBattleInvite(inviteId, battleId) {
  try {
    await updateDoc(doc(db, 'invites', inviteId), { status: 'declined' });
    if (battleId) {
      await updateDoc(doc(db, 'battles', battleId), { status: 'cancelled' });
    }
    return { success: true };
  } catch (e) {
    console.error('Erro ao recusar convite:', e);
    return { success: false };
  }
}

// Fila de Matchmaking Rápido (Encontrar oponente aleatório)
export async function findOrCreateQuickMatch(currentProfile, subjectId = 'geral') {
  try {
    // Procura uma sala aberta esperando oponente
    const q = query(
      collection(db, 'battles'),
      where('status', '==', 'waiting_quickmatch'),
      where('subject', '==', subjectId),
      limit(1)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const roomDoc = snap.docs[0];
      const roomData = roomDoc.data();

      // Evita entrar na própria sala
      if (roomData.player1.uid !== currentProfile.uid) {
        await updateDoc(doc(db, 'battles', roomData.id), {
          status: 'in_progress',
          gameMode: subjectId === 'matematica' ? 'tug_of_war' : 'classic',
          player2: {
            uid: currentProfile.uid,
            name: currentProfile.name,
            avatar: currentProfile.avatar || '👦🏽',
            score: 0,
            health: 100,
            currentQuestion: 0,
            answeredCurrent: false,
            lastAnswerCorrect: null,
            ready: true
          },
          startedAt: serverTimestamp()
        });
        return { success: true, battleId: roomData.id, isHost: false };
      }
    }

    // Se não encontrou sala aberta, cria uma sala esperando jogador
    const battleId = `quick_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const questions = await generateBattleQuestions(subjectId);

    await setDoc(doc(db, 'battles', battleId), {
      id: battleId,
      status: 'waiting_quickmatch',
      subject: subjectId,
      gameMode: subjectId === 'matematica' ? 'tug_of_war' : 'classic',
      tugPosition: 0,
      questions,
      player1: {
        uid: currentProfile.uid,
        name: currentProfile.name,
        avatar: currentProfile.avatar || '👦🏽',
        score: 0,
        health: 100,
        currentQuestion: 0,
        answeredCurrent: false,
        lastAnswerCorrect: null,
        ready: true
      },
      player2: null,
      currentQuestionIdx: 0,
      winner: null,
      createdAt: serverTimestamp()
    });

    return { success: true, battleId, isHost: true };
  } catch (e) {
    console.error('Erro no matchmaking rápido:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar partida rápida.' };
  }
}

// Cancela busca rápida
export async function cancelQuickMatch(battleId) {
  if (!battleId) return;
  try {
    await updateDoc(doc(db, 'battles', battleId), { status: 'cancelled' });
  } catch (e) {
    console.error('Erro ao cancelar matchmaking:', e);
  }
}

// Registra resposta de um jogador na batalha
export async function submitBattleAnswer({
  battleId,
  isPlayer1,
  questionIdx,
  isCorrect,
  pointsEarned
}) {
  try {
    const battleRef = doc(db, 'battles', battleId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(battleRef);
      if (!snap.exists()) {
        throw new Error('A batalha não foi encontrada.');
      }

      const battle = snap.data();
      if (battle.status !== 'in_progress') return;

      const pKey = isPlayer1 ? 'player1' : 'player2';
      const oppKey = isPlayer1 ? 'player2' : 'player1';
      const currentP = battle[pKey];
      const currentOpp = battle[oppKey];
      const questionCount = battle.questions?.length || 0;

      if (battle.gameMode === 'tug_of_war') {
        const currentQuestionIdx = battle.currentQuestionIdx || 0;
        if (
          !currentP ||
          currentP.answeredCurrent ||
          currentQuestionIdx !== questionIdx ||
          questionIdx >= questionCount
        ) {
          return;
        }

        const newScore = (currentP.score || 0) + (isCorrect ? pointsEarned : 0);
        const updates = {
          [`${pKey}.score`]: newScore,
          [`${pKey}.answeredCurrent`]: true,
          [`${pKey}.lastAnswerCorrect`]: isCorrect,
        };

        if (!currentOpp?.answeredCurrent) {
          transaction.update(battleRef, updates);
          return;
        }

        const p1Correct = isPlayer1 ? isCorrect : currentOpp.lastAnswerCorrect === true;
        const p2Correct = isPlayer1 ? currentOpp.lastAnswerCorrect === true : isCorrect;
        const tugPosition = Math.max(
          -3,
          Math.min(3, (battle.tugPosition || 0) + Number(p1Correct) - Number(p2Correct))
        );
        const nextQuestion = currentQuestionIdx + 1;
        const reachedGoal = Math.abs(tugPosition) === 3;
        const ranOutOfQuestions = nextQuestion >= questionCount;
        const finalP1Score = isPlayer1 ? newScore : (currentOpp.score || 0);
        const finalP2Score = isPlayer1 ? (currentOpp.score || 0) : newScore;

        updates.currentQuestionIdx = nextQuestion;
        updates.tugPosition = tugPosition;
        updates['player1.currentQuestion'] = nextQuestion;
        updates['player2.currentQuestion'] = nextQuestion;
        updates['player1.answeredCurrent'] = false;
        updates['player2.answeredCurrent'] = false;

        if (reachedGoal || ranOutOfQuestions) {
          updates.status = 'finished';
          if (tugPosition > 0) updates.winner = battle.player1.uid;
          else if (tugPosition < 0) updates.winner = battle.player2.uid;
          else if (finalP1Score > finalP2Score) updates.winner = battle.player1.uid;
          else if (finalP2Score > finalP1Score) updates.winner = battle.player2.uid;
          else updates.winner = 'draw';
        }

        transaction.update(battleRef, updates);
        return;
      }

      if (!currentP || currentP.currentQuestion !== questionIdx || questionIdx >= questionCount) {
        return;
      }

      const newScore = (currentP.score || 0) + (isCorrect ? pointsEarned : 0);
      const newOppHealth = isCorrect
        ? Math.max(0, (currentOpp?.health || 100) - 20)
        : (currentOpp?.health || 100);
      const nextQuestion = questionIdx + 1;
      const updates = {
        [`${pKey}.score`]: newScore,
        [`${pKey}.currentQuestion`]: nextQuestion,
        [`${pKey}.answeredCurrent`]: true,
        [`${pKey}.lastAnswerCorrect`]: isCorrect,
        [`${oppKey}.health`]: newOppHealth
      };
      const opponentQuestion = currentOpp?.currentQuestion || 0;

      if (nextQuestion >= questionCount && opponentQuestion >= questionCount) {
        const finalP1Score = isPlayer1 ? newScore : (currentOpp?.score || 0);
        const finalP2Score = isPlayer1 ? (currentOpp?.score || 0) : newScore;

        updates.status = 'finished';
        if (finalP1Score > finalP2Score) updates.winner = battle.player1.uid;
        else if (finalP2Score > finalP1Score) updates.winner = battle.player2.uid;
        else updates.winner = 'draw';
      }

      transaction.update(battleRef, updates);
    });
  } catch (e) {
    console.error('Erro ao submeter resposta:', e);
  }
}
