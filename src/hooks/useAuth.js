// Hook centralizado para toda a lógica de autenticação e dados do usuário
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  arrayUnion,
  runTransaction
} from 'firebase/firestore';
import { auth, db } from '../firebase';

let nativeGoogleLoginInitialization = null;

// Data local no formato AAAA-MM-DD (usada para contar dias seguidos)
function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNextStreak(currentProfile, todayKey) {
  const currentStreak = Number.isFinite(currentProfile.streak) && currentProfile.streak > 0
    ? currentProfile.streak
    : 1;
  const lastActiveDate = currentProfile.lastActiveDate;
  if (lastActiveDate === todayKey) return currentStreak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastActiveDate === getLocalDateKey(yesterday)) return currentStreak + 1;

  // Perfis antigos sem data registrada mantêm a sequência atual
  if (!lastActiveDate) return currentStreak;
  return 1;
}

export function useAuth() {
  const [user, setUser] = useState(null);       // dados do Firebase Auth
  const [profile, setProfile] = useState(null); // dados do Firestore
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pendingXpWrites = useRef(new Set());

  // Escuta mudanças de autenticação
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadProfile = async (uid) => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const profileData = normalizeStudentGrade({
          ...snap.data(),
          onboardingCompleted: snap.data().onboardingCompleted ?? true,
        });
        setProfile(profileData);
        if (profileData.grade !== snap.data().grade && profileData.role !== 'professor') {
          await updateDoc(ref, { grade: '9' });
        }
        await registerDailyActivity(uid);
      }
    } catch (e) {
      console.error('Erro ao carregar perfil:', e);
    }
  };

  // Atualiza a sequência de dias seguidos uma vez por dia
  const registerDailyActivity = async (uid) => {
    const todayKey = getLocalDateKey();
    const ref = doc(db, 'users', uid);
    try {
      const updates = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return null;
        const currentProfile = snap.data();
        if (currentProfile.lastActiveDate === todayKey) return null;
        const nextUpdates = {
          streak: getNextStreak(currentProfile, todayKey),
          lastActiveDate: todayKey,
          lastSeen: serverTimestamp(),
        };
        transaction.update(ref, nextUpdates);
        return nextUpdates;
      });
      if (updates) {
        setProfile(prev => prev ? { ...prev, streak: updates.streak, lastActiveDate: updates.lastActiveDate } : prev);
      }
    } catch (e) {
      console.error('Erro ao atualizar dias seguidos:', e);
    }
  };

  // Mantém a sequência correta se o app ficar aberto de um dia para o outro
  useEffect(() => {
    if (!user?.uid) return undefined;
    const checkNewDay = () => {
      if (document.visibilityState === 'visible') registerDailyActivity(user.uid);
    };
    const interval = setInterval(checkNewDay, 60 * 60 * 1000);
    document.addEventListener('visibilitychange', checkNewDay);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', checkNewDay);
    };
  }, [user?.uid]);

  // Cadastro de novo usuário
  const register = async ({ email, password, role, inviteCode, subject }) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: 'Jogador' });

      const profileData = {
        uid: cred.user.uid,
        name: 'Jogador',
        email,
        role,           // 'aluno' | 'professor'
        grade: role === 'aluno' ? '9' : 'Professor',
        inviteCode: inviteCode || '',
        subject: subject || '',
        xp: 0,
        level: 1,
        streak: 1,
        lastActiveDate: getLocalDateKey(),
        medals: [],
        completedTopics: [],
        avatar: '👦🏽',
        unlockedAvatars: ['👦🏽'],
        onboardingCompleted: false,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', cred.user.uid), profileData);
      setProfile(profileData);
      return { success: true };
    } catch (e) {
      const msg = translateFirebaseError(e.code);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Login
  const login = async ({ email, password }) => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await loadProfile(cred.user.uid);
      // Atualiza lastSeen
      await updateDoc(doc(db, 'users', cred.user.uid), {
        lastSeen: serverTimestamp()
      });
      return { success: true };
    } catch (e) {
      const msg = translateFirebaseError(e.code);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Login com Google
  const loginWithGoogle = async ({ role, inviteCode, subject }) => {
    setError(null);
    try {
      let cred;
      if (Capacitor.getPlatform() === 'android') {
        const webClientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID?.trim();
        if (!webClientId) {
          throw new Error('O login Google no aplicativo ainda precisa ser configurado.');
        }

        if (!nativeGoogleLoginInitialization) {
          nativeGoogleLoginInitialization = SocialLogin.initialize({
            google: { webClientId, mode: 'online' },
          }).catch((initializationError) => {
            nativeGoogleLoginInitialization = null;
            throw initializationError;
          });
        }
        await nativeGoogleLoginInitialization;

        const googleResult = await SocialLogin.login({ provider: 'google' });
        const idToken = googleResult.result?.idToken;
        if (!idToken) {
          throw new Error('O Google não retornou um token de autenticação. Tente novamente.');
        }

        const credential = GoogleAuthProvider.credential(
          idToken,
          googleResult.result.accessToken?.token || undefined
        );
        cred = await signInWithCredential(auth, credential);
      } else {
        const provider = new GoogleAuthProvider();
        cred = await signInWithPopup(auth, provider);
      }
      const firebaseUser = cred.user;

      // Verifica se já tem perfil no Firestore
      const ref = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Primeiro login com Google — cria perfil
        const profileData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Jogador',
          email: firebaseUser.email,
          role: role || 'aluno',
          grade: role === 'professor' ? 'Professor' : '9',
          inviteCode: inviteCode || '',
          subject: subject || '',
          xp: 0,
          level: 1,
          streak: 1,
          lastActiveDate: getLocalDateKey(),
          medals: [],
          completedTopics: [],
          avatar: '👦🏽',
          unlockedAvatars: ['👦🏽'],
          onboardingCompleted: false,
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
        };
        await setDoc(ref, profileData);
        setProfile(profileData);
      } else {
        // Login recorrente
        await updateDoc(ref, { lastSeen: serverTimestamp() });
        const profileData = normalizeStudentGrade({
          ...snap.data(),
          onboardingCompleted: snap.data().onboardingCompleted ?? true,
        });
        if (profileData.grade !== snap.data().grade && profileData.role !== 'professor') {
          await updateDoc(ref, { grade: '9' });
        }
        setProfile(profileData);
        await registerDailyActivity(firebaseUser.uid);
      }
      setUser(firebaseUser);
      return { success: true };
    } catch (e) {
      if (e.code === 'auth/popup-closed-by-user') return { success: false, error: '' };
      if (e.code === 'USER_CANCELLED' || e.message?.toLowerCase().includes('cancel')) {
        return { success: false, error: '' };
      }
      const msg = e.code ? translateFirebaseError(e.code) : e.message || 'Não foi possível entrar com Google.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Envia e-mail de redefinição de senha
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (e) {
      // Não revela se o e-mail existe: só erros de formato/conexão são mostrados
      if (e.code === 'auth/user-not-found') return { success: true };
      return { success: false, error: translateFirebaseError(e.code) };
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  const updateAccountProfile = useCallback(async ({ name }) => {
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 40) {
      return { success: false, error: 'O nome deve ter entre 2 e 40 caracteres.' };
    }
    if (!user) {
      return { success: false, error: 'Entre na sua conta para atualizar o perfil.' };
    }

    try {
      await updateProfile(user, { displayName: cleanName });
      await updateDoc(doc(db, 'users', user.uid), { name: cleanName });
      setProfile((current) => current ? { ...current, name: cleanName } : current);
      return { success: true };
    } catch (e) {
      console.error('Erro ao atualizar perfil:', e);
      return { success: false, error: 'Não foi possível salvar seu nome. Tente novamente.' };
    }
  }, [user]);

  const completeFirstVisitSetup = useCallback(async ({ name, avatar }) => {
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (cleanName.length < 2 || cleanName.length > 40) {
      return { success: false, error: 'O nome deve ter entre 2 e 40 caracteres.' };
    }
    if (typeof avatar !== 'string' || !avatar) {
      return { success: false, error: 'Escolha um avatar para continuar.' };
    }
    if (!user) {
      return { success: false, error: 'Sua sessão expirou. Entre novamente para continuar.' };
    }

    try {
      await updateProfile(user, { displayName: cleanName });
      const updates = {
        name: cleanName,
        avatar,
        unlockedAvatars: [avatar],
        onboardingCompleted: true,
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      setProfile(current => current ? { ...current, ...updates } : current);
      return { success: true };
    } catch (e) {
      console.error('Erro ao concluir configuração inicial:', e);
      return { success: false, error: 'Não foi possível salvar seu perfil. Tente novamente.' };
    }
  }, [user]);

  // Salva progresso (XP, tópicos, etc.)
  const saveProgress = useCallback(async ({ xp, medals, completedTopics, avatar, unlockedAvatars, streak }) => {
    if (!user) return;
    try {
      const ref = doc(db, 'users', user.uid);
      const updates = {};
      if (xp !== undefined) updates.xp = xp;
      if (medals !== undefined) updates.medals = medals;
      if (completedTopics !== undefined) updates.completedTopics = completedTopics;
      if (avatar !== undefined) updates.avatar = avatar;
      if (unlockedAvatars !== undefined) updates.unlockedAvatars = unlockedAvatars;
      if (streak !== undefined) updates.streak = streak;
      if (xp !== undefined) updates.level = Math.floor(xp / 1000) + 1;
      updates.lastSeen = serverTimestamp();

      await updateDoc(ref, updates);
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (e) {
      console.error('Erro ao salvar progresso:', e);
    }
  }, [user]);

  const addQuizReward = useCallback(async ({ earnedXp, completedTopicKey, medal }) => {
    if (!user) {
      throw new Error('Sua sessão expirou. Entre novamente para salvar seus pontos.');
    }
    if (!Number.isFinite(earnedXp) || earnedXp < 0) {
      throw new Error('A pontuação recebida é inválida. Tente finalizar o quiz novamente.');
    }

    const ref = doc(db, 'users', user.uid);
    try {
      // Espera os XP creditados por acerto chegarem ao Firestore antes de ler o perfil
      await Promise.allSettled([...pendingXpWrites.current]);
      const updatedProfile = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) {
          throw new Error('Não encontramos seu perfil para salvar os pontos. Entre novamente.');
        }

        const currentProfile = snap.data();
        const currentXp = Number.isFinite(currentProfile.xp) ? currentProfile.xp : 0;
        const nextXp = currentXp + earnedXp;
        const completedTopics = Array.isArray(currentProfile.completedTopics)
          ? currentProfile.completedTopics
          : [];
        const medals = Array.isArray(currentProfile.medals) ? currentProfile.medals : [];
        const nextCompletedTopics = completedTopicKey && !completedTopics.includes(completedTopicKey)
          ? [...completedTopics, completedTopicKey]
          : completedTopics;
        const nextMedals = medal && !medals.some(existingMedal => existingMedal.id === medal.id)
          ? [...medals, medal]
          : medals;
        // Conta as fases concluídas hoje para a meta diária do painel
        const todayKey = getLocalDateKey();
        const previousDaily = currentProfile.dailyProgress?.date === todayKey
          ? currentProfile.dailyProgress.completed || 0
          : 0;
        const dailyProgress = {
          date: todayKey,
          completed: previousDaily + (completedTopicKey ? 1 : 0),
        };

        // increment evita sobrescrever pontos já creditados por resposta
        transaction.update(ref, {
          xp: increment(earnedXp),
          level: Math.floor(nextXp / 1000) + 1,
          completedTopics: nextCompletedTopics,
          medals: nextMedals,
          dailyProgress,
          lastSeen: serverTimestamp(),
        });

        return {
          ...currentProfile,
          xp: nextXp,
          level: Math.floor(nextXp / 1000) + 1,
          completedTopics: nextCompletedTopics,
          medals: nextMedals,
          dailyProgress,
        };
      });

      setProfile(updatedProfile);
      return updatedProfile;
    } catch (e) {
      console.error('Erro ao salvar recompensa do quiz:', e);
      throw e;
    }
  }, [user]);

  // Credita XP imediatamente (ex.: a cada acerto no modo solo)
  const addXp = useCallback(async (earnedXp) => {
    if (!user || !Number.isFinite(earnedXp) || earnedXp <= 0) return;
    setProfile(prev => {
      if (!prev) return prev;
      const nextXp = (prev.xp || 0) + earnedXp;
      return { ...prev, xp: nextXp, level: Math.floor(nextXp / 1000) + 1 };
    });
    const write = updateDoc(doc(db, 'users', user.uid), {
      xp: increment(earnedXp),
      lastSeen: serverTimestamp(),
    });
    pendingXpWrites.current.add(write);
    try {
      await write;
    } catch (e) {
      console.error('Erro ao salvar XP:', e);
      setProfile(prev => prev ? { ...prev, xp: Math.max(0, (prev.xp || 0) - earnedXp) } : prev);
      throw e;
    } finally {
      pendingXpWrites.current.delete(write);
    }
  }, [user]);

  // Guarda as perguntas já respondidas no perfil para não repeti-las em outro aparelho
  const markQuestionAnswered = useCallback(async (questionId) => {
    if (!user || !questionId) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        answeredQuestions: arrayUnion(questionId),
      });
    } catch (e) {
      console.error('Erro ao salvar pergunta respondida:', e);
    }
  }, [user]);

  // Salva recompensa de batalha com increment atômico no Firestore
  const addBattleReward = useCallback(async (earnedXp, isWinner) => {
    if (!user) return 0;
    try {
      const ref = doc(db, 'users', user.uid);
      const updates = {
        xp: increment(earnedXp),
        pvpMatches: increment(1),
        lastSeen: serverTimestamp(),
      };
      if (isWinner) {
        updates.pvpWins = increment(1);
      }
      await updateDoc(ref, updates);

      // Recarrega dados atualizados
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const fresh = snap.data();
        setProfile(fresh);
        return fresh.xp;
      }
      return (profile?.xp || 0) + earnedXp;
    } catch (e) {
      console.error('Erro ao salvar recompensa de batalha:', e);
      return (profile?.xp || 0) + earnedXp;
    }
  }, [user, profile?.xp]);

  // Busca ranking global (top 50)
  const fetchRanking = useCallback(async () => {
    const q = query(
      collection(db, 'users'),
      orderBy('xp', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
  }, []);

  return {
    user,
    profile,
    todayKey: getLocalDateKey(),
    loading,
    error,
    setError,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
    updateAccountProfile,
    completeFirstVisitSetup,
    saveProgress,
    addQuizReward,
    addXp,
    markQuestionAnswered,
    addBattleReward,
    fetchRanking,
    reloadProfile: () => user && loadProfile(user.uid),
  };
}

// Traduz erros do Firebase para PT-BR
function translateFirebaseError(code) {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'este endereço';
  const map = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/unauthorized-domain': `O domínio "${currentDomain}" não está autorizado para login com Google. Adicione-o em Firebase Console > Authentication > Configurações > Domínios autorizados.`,
  };
  return map[code] || `Erro: ${code}`;
}

function normalizeStudentGrade(profileData) {
  if (profileData.role === 'professor') return profileData;
  return { ...profileData, grade: '9' };
}
