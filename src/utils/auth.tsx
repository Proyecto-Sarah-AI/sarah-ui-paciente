import React, { createContext, useContext, useEffect, useState } from 'react'

type AuthSession = {
  uid: string
  email: string
  nombre: string | null
  accessToken: string
}

type AuthContextValue = {
  user: AuthSession | null
  loading: boolean
  login: (email: string, password: string, rol?: string) => Promise<AuthSession>
  logout: () => Promise<void>
}

type LoginApiRequest = {
  email: string
  password: string
  rol: string
}

type LoginApiResponse = {
  access_token: string
  token_type?: string
  uid: string
  email: string
  nombre?: string | null
}

const API_URL =
  ((import.meta.env.VITE_API_URL as string | undefined) ?? (import.meta.env.VITE_BACKEND_URL as string | undefined))
    ?.replace(/\/$/, '') ?? 'http://localhost:8000'
const LOGIN_URL = `${API_URL}/auth/login`
const DEFAULT_LOGIN_ROLE = 'paciente'
const AUTH_STATUS_KEY = 'sarah_auth_status'
const AUTH_TIMESTAMP_KEY = 'sarah_auth_timestamp'
const AUTH_TOKEN_KEY = 'sarah_access_token'
const AUTH_EMAIL_KEY = 'sarah_user_email'
const AUTH_UID_KEY = 'sarah_user_uid'
const AUTH_NAME_KEY = 'sarah_user_name'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredSession(): AuthSession | null {
  const accessToken = localStorage.getItem(AUTH_TOKEN_KEY)
  const email = localStorage.getItem(AUTH_EMAIL_KEY)
  const uid = localStorage.getItem(AUTH_UID_KEY)

  if (!accessToken || !email || !uid) {
    return null
  }

  return {
    accessToken,
    email,
    uid,
    nombre: localStorage.getItem(AUTH_NAME_KEY),
  }
}

function persistSession(session: AuthSession) {
  localStorage.setItem(AUTH_STATUS_KEY, 'authenticated')
  localStorage.setItem(AUTH_TIMESTAMP_KEY, new Date().toISOString())
  localStorage.setItem(AUTH_TOKEN_KEY, session.accessToken)
  localStorage.setItem(AUTH_EMAIL_KEY, session.email)
  localStorage.setItem(AUTH_UID_KEY, session.uid)

  if (session.nombre) {
    localStorage.setItem(AUTH_NAME_KEY, session.nombre)
  } else {
    localStorage.removeItem(AUTH_NAME_KEY)
  }
}

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string }
    if (typeof payload.detail === 'string' && payload.detail.trim()) {
      return payload.detail
    }
  } catch {
    // Ignore JSON parsing failures and fall back to a generic message.
  }

  return 'Error al iniciar sesión.'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(readStoredSession())
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, rol: string = DEFAULT_LOGIN_ROLE) => {
    const requestBody: LoginApiRequest = {
      email,
      password,
      rol,
    }

    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response))
    }

    const payload = (await response.json()) as LoginApiResponse
    const session: AuthSession = {
      accessToken: payload.access_token,
      uid: payload.uid,
      email: payload.email,
      nombre: payload.nombre ?? null,
    }

    setUser(session)
    persistSession(session)
    return session
  }

  const logout = async () => {
    localStorage.removeItem(AUTH_STATUS_KEY)
    localStorage.removeItem(AUTH_TIMESTAMP_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_EMAIL_KEY)
    localStorage.removeItem(AUTH_UID_KEY)
    localStorage.removeItem(AUTH_NAME_KEY)
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

export default AuthProvider
