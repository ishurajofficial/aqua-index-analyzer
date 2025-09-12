"use client";

import React from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, googleProvider, db, firebaseEnabled } from "@/lib/firebase";

type Role = "admin" | "researcher" | "guest";

type AuthContextValue = {
  user: User | null;
  role: Role;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<Role>("guest");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!firebaseEnabled) {
      setUser(null);
      setRole("guest");
      setLoading(false);
      return;
    }
    const auth = firebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async current => {
      setUser(current);
      if (current) {
        try {
          const roleDoc = await getDoc(doc(db(), "roles", current.uid));
          const roleVal = (roleDoc.exists() && (roleDoc.data()?.role as Role)) || "researcher";
          setRole(roleVal);
        } catch {
          setRole("researcher");
        }
      } else {
        setRole("guest");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    if (!firebaseEnabled) return;
    await signInWithPopup(firebaseAuth(), googleProvider);
  }, []);

  const signOutUser = React.useCallback(async () => {
    if (!firebaseEnabled) return;
    await signOut(firebaseAuth());
  }, []);

  const value: AuthContextValue = {
    user,
    role,
    loading,
    signInWithGoogle,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


