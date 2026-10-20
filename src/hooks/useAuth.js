// Hook centralizado para toda a lógica de autenticação e dados do usuário
import { useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
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
  increment
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);       // dados do Firebase Auth
  const [profile, setProfile] = useState(null); // dados do Firestore
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }
    } catch (e) {
      console.error('Erro ao carregar perfil:', e);
    }
  };

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
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
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
      }
      setUser(firebaseUser);
      return { success: true };
    } catch (e) {
      if (e.code === 'auth/popup-closed-by-user') return { success: false, error: '' };
      const msg = translateFirebaseError(e.code);
      setError(msg);
      return { success: false, error: msg };
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
      updates.level = Math.floor((xp || 0) / 1000) + 1;
      updates.lastSeen = serverTimestamp();

      await updateDoc(ref, updates);
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (e) {
      console.error('Erro ao salvar progresso:', e);
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
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('xp', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
    } catch (e) {
      console.error('Erro ao buscar ranking:', e);
      return [];
    }
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    setError,
    register,
    login,
    loginWithGoogle,
    logout,
    updateAccountProfile,
    completeFirstVisitSetup,
    saveProgress,
    addBattleReward,
    fetchRanking,
    reloadProfile: () => user && loadProfile(user.uid),
  };
}

// Traduz erros do Firebase para PT-BR
function translateFirebaseError(code) {
  const map = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };
  return map[code] || `Erro: ${code}`;
}

function normalizeStudentGrade(profileData) {
  if (profileData.role === 'professor') return profileData;
  return { ...profileData, grade: '9' };
}
