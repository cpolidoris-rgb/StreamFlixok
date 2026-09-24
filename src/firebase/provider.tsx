import React, { createContext, useContext, useMemo } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Real Firebase config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCUfeZrFDROx5M_PGgaCR4jTlwvEs2fyUw",
  authDomain: "streamflix-backup2-62066-60e39.firebaseapp.com",
  projectId: "streamflix-backup2-62066-60e39",
  storageBucket: "streamflix-backup2-62066-60e39.firebasestorage.app",
  messagingSenderId: "458200194904",
  appId: "1:458200194904:web:2dffb91aa31a30256d0f2d"
};

let app: FirebaseApp;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);

interface FirebaseContextType {
  auth: Auth;
  firestore: Firestore;
  app: FirebaseApp;
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  firestore,
  app,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({ auth, firestore, app }), []);
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useAuth(): Auth {
  const ctx = useContext(FirebaseContext);
  return ctx.auth || auth;
}

export function useFirestore(): Firestore {
  const ctx = useContext(FirebaseContext);
  return ctx.firestore || firestore;
}

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
