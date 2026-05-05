import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCNjy1mc1lvHtwlytUyV4-Iku5gEn3ZtK8',
  authDomain: 'clinicausers.firebaseapp.com',
  projectId: 'clinicausers',
  storageBucket: 'clinicausers.firebasestorage.app',
  messagingSenderId: '271345446078',
  appId: '1:271345446078:web:af566e034119aeec7a42ef',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      setUser(credential.user)
      return credential.user
    } catch (err: any) {
      const code: string = err?.code || ''
      // Map specific Firebase auth errors to friendly Spanish messages
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        throw new Error('Correo o contraseña incorrectos')
      }

      if (code === 'auth/too-many-requests') {
        throw new Error('Demasiados intentos. Intenta más tarde.')
      }

      // Fallback: preserve a cleaned-up Firebase message if available
      const fallback = typeof err?.message === 'string' ? err.message.replace(/^Firebase: /, '') : 'Error al iniciar sesión.'
      throw new Error(fallback)
    }
  }

  const logout = async () => {
    await firebaseSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export default auth
