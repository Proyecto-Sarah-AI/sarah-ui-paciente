import React, { useEffect, useState } from 'react'
import { Form } from '@base-ui/react/form'
import { Field } from '@base-ui/react/field'
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react'
import {
  createThemeVars,
  getEffectiveTheme,
  getStoredTheme,
  THEME_PALETTES,
  type ThemeMode,
} from '../../styles/theme.ts'
import './Login.css'
import { AuthProvider, useAuth } from '../../utils/auth'

function LoginInner() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme())
  const effectiveTheme = getEffectiveTheme(themeMode)
  const palette = THEME_PALETTES[effectiveTheme]
  const themeVars = createThemeVars(palette)
  const { login } = useAuth()

  useEffect(() => {
    if (themeMode !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setThemeMode('system')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailError(emailRegex.test(value) ? '' : 'Por favor ingresa un correo válido')
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    validateEmail(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setAuthError('')

    try {
      await login(email, password)
      localStorage.setItem('sarah_auth_status', 'authenticated')
      localStorage.setItem('sarah_user_email', email)
      localStorage.setItem('sarah_auth_timestamp', new Date().toISOString())
      window.location.assign('/paciente/consent')
    } catch (err: any) {
        let msg = 'Error al iniciar sesión'

        const code: string | undefined = err?.code
        const rawMessage: string | undefined = typeof err?.message === 'string' ? err.message : undefined

        if (
          code === 'auth/invalid-credential' ||
          code === 'auth/wrong-password' ||
          code === 'auth/user-not-found'
        ) {
          msg = 'Correo o contraseña incorrectos'
        } else if (code === 'auth/too-many-requests' || (rawMessage && rawMessage.includes('auth/too-many-requests'))) {
          msg = 'Demasiados intentos. Intenta más tarde.'
        } else if (rawMessage && rawMessage.includes('auth/invalid-credential')) {
          msg = 'Correo o contraseña incorrectos'
        } else if (rawMessage) {
          msg = rawMessage.replace(/^Firebase: /, '')
        }

        setAuthError(msg)
      } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="login-container"
      style={{
        ...themeVars,
        background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.backgroundSecondary} 45%, ${palette.background} 100%)`,
        color: palette.textPrimary,
      }}
    >
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Bienvenido de vuelta</h1>
          <p className="login-subtitle">Ingresa para continuar con tu tratamiento</p>
        </div>

        <Form onSubmit={handleSubmit} className="login-form">
          <Field.Root className="form-group" invalid={!!emailError}>
            <Field.Label className="form-label">
              Correo electrónico
            </Field.Label>
            <div className="input-wrapper">
              <Mail size={24} className="input-icon" />
              <Field.Control
                name="email"
                type="email"
                value={email}
                onValueChange={handleEmailChange}
                placeholder="tu@correo.com"
                className={`form-input ${emailError ? 'input-error' : ''}`}
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
            </div>
            {emailError ? (
              <Field.Error id="email-error" className="error-message">
                {emailError}
              </Field.Error>
            ) : null}
          </Field.Root>

          <Field.Root className="form-group">
            <Field.Label className="form-label">
              Contraseña
            </Field.Label>
            <div className="input-wrapper">
              <KeyRound size={24} className="input-icon" />
              <Field.Control
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onValueChange={setPassword}
                placeholder="Tu contraseña"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </Field.Root>

          <button type="button" className="forgot-password-btn">
            ¿Olvidaste tu contraseña?
          </button>

          {authError ? (
            <div className="auth-error" style={{ color: 'var(--ca-danger)', marginTop: 8 }} role="alert" aria-live="polite">
              {authError}
            </div>
          ) : null}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </Form>

        <p className="privacy-notice">
          Tus datos están protegidos bajo las normas de privacidad médica
        </p>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <AuthProvider>
      <LoginInner />
    </AuthProvider>
  )
}
