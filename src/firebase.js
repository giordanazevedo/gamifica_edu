// =====================================================
// CONFIGURAÇÃO DO FIREBASE
// =====================================================
// IMPORTANTE: Substitua os valores abaixo pelas
// configurações do SEU projeto Firebase!
// Vá em: console.firebase.google.com
// → Seu projeto → Configurações → Apps web → Configuração
// =====================================================

import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCAiN5AHrj0_DTiGoT5N60EPBVYi6hqCFI",
  authDomain: "gamifica-edu.firebaseapp.com",
  projectId: "gamifica-edu",
  storageBucket: "gamifica-edu.firebasestorage.app",
  messagingSenderId: "705452956053",
  appId: "1:705452956053:web:d145bdd5e201079e7d7e9c",
  measurementId: "G-S7GF20TJ57"
};

const app = initializeApp(firebaseConfig);

export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6Lf9dvctAAAAAH6hCttV7GuMQhVXvXTNX_RhB4nx'),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
