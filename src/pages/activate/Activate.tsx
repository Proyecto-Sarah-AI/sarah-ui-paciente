import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Field } from '@base-ui/react/field'
import { Form } from '@base-ui/react/form'
import { KeyRound, Mail } from 'lucide-react'
import {
  createThemeVars,
  getEffectiveTheme,
  getStoredTheme,
  THEME_PALETTES,
  type ThemeMode,
} from '../../styles/theme.ts'
import '../login/Login.css'

const API_URL = import.meta.env.VITE_API_URL as string

function ActivateInner() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activationToken] = useState(() => searchParams.get('token') ?? '')
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(Boolean(activationToken))
  const [tokenInvalid, setTokenInvalid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredTheme())

  const effectiveTheme = getEffectiveTheme(themeMode)
  const palette = THEME_PALETTES[effectiveTheme]
  const themeVars = createThemeVars(palette)

  useEffect(() => {
    if (!activationToken) {
      setTokenInvalid(true)
      return
    }

    let active = true

    void (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/activate?token=${encodeURIComponent(activationToken)}`)
        if (!active) return

        if (!response.ok) {
          setTokenInvalid(true)
          return
        }

        const data = await response.json() as { email: string }
        setEmail(data.email)
      } catch {
        if (active) setTokenInvalid(true)
      } finally {
        if (active) setEmailLoading(false)
      }
    })()

    return () => { active = false }
  }, [activationToken])

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

  const passwordError = password.length > 0 && password.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : ''
  const confirmError =
    confirmPassword.length > 0 && confirmPassword !== password
      ? 'Las contraseñas no coinciden'
      : ''
  const statusMessage = (() => {
    if (!password && !confirmPassword) {
      return ''
    }

    if (password.length > 0 && password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }

    if (confirmPassword.length > 0 && confirmPassword !== password) {
      return 'Las contraseñas no coinciden'
    }

    if (password.length >= 8 && confirmPassword.length >= 8 && password === confirmPassword) {
      return 'Las contraseñas coinciden y cumplen con el mínimo requerido'
    }

    return ''
  })()

  const isStatusSuccess =
    password.length >= 8 && confirmPassword.length >= 8 && password === confirmPassword
  const canSubmit = Boolean(email) && !tokenInvalid && !emailLoading && password.length >= 8 && password === confirmPassword && !loading

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setLoading(true)
    setApiError('')

    try {
      const response = await fetch(`${API_URL}/auth/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          password_confirm: confirmPassword,
          activation_token: activationToken,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const detail: string = data?.detail ?? 'Error al activar la cuenta. Intenta de nuevo.'
        setApiError(detail)
        return
      }

      navigate('/login', { replace: true })
    } catch {
      setApiError('No se pudo conectar con el servidor. Intenta de nuevo.')
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
          <h1 className="login-title">Activar cuenta</h1>
          <p className="login-subtitle">Define tu contraseña para continuar</p>
        </div>

        <Form onSubmit={handleSubmit} className="login-form">
          <Field.Root className="form-group">
            <Field.Label className="form-label">Correo electrónico</Field.Label>
            <div className="input-wrapper">
              <Mail size={24} className="input-icon" />
              <Field.Control
                name="email"
                type="email"
                value={emailLoading ? '' : email}
                readOnly
                tabIndex={-1}
                placeholder={emailLoading ? 'Verificando enlace...' : ''}
                className="form-input form-input--readonly"
                aria-readonly="true"
                aria-label="Correo electrónico de la cuenta"
              />
            </div>
          </Field.Root>

          <Field.Root className="form-group" invalid={!!passwordError}>
            <Field.Label className="form-label">Contraseña</Field.Label>
            <div className="input-wrapper">
              <KeyRound size={24} className="input-icon" />
              <Field.Control
                name="password"
                type="password"
                value={password}
                onValueChange={setPassword}
                placeholder="Mínimo 8 caracteres"
                className={`form-input ${passwordError ? 'input-error' : ''}`}
                aria-invalid={passwordError ? 'true' : 'false'}
                aria-describedby={passwordError ? 'password-error' : undefined}
              />
            </div>
            {passwordError ? (
              <Field.Error id="password-error" className="error-message">
                {passwordError}
              </Field.Error>
            ) : null}
          </Field.Root>

          <Field.Root className="form-group" invalid={!!confirmError}>
            <Field.Label className="form-label">Confirmar contraseña</Field.Label>
            <div className="input-wrapper">
              <KeyRound size={24} className="input-icon" />
              <Field.Control
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                placeholder="Repite la contraseña"
                className={`form-input ${confirmError ? 'input-error' : ''}`}
                aria-invalid={confirmError ? 'true' : 'false'}
                aria-describedby={confirmError ? 'confirm-password-error' : undefined}
              />
            </div>
            {confirmError ? (
              <Field.Error id="confirm-password-error" className="error-message">
                {confirmError}
              </Field.Error>
            ) : null}
          </Field.Root>

          {tokenInvalid ? (
            <div className="error-message" role="alert" aria-live="polite">
              El enlace de activación es inválido o ha expirado.
            </div>
          ) : null}

          {apiError ? (
            <div className="auth-error" style={{ color: 'var(--ca-danger)', marginTop: 8 }} role="alert" aria-live="polite">
              {apiError}
            </div>
          ) : null}

          {statusMessage ? (
            <div
              className={isStatusSuccess ? 'status-message status-message--success' : 'status-message'}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </div>
          ) : null}

          <button type="submit" disabled={!canSubmit} className="submit-btn">
            {loading ? 'Activando...' : 'Activar cuenta'}
          </button>
        </Form>

        <p className="privacy-notice">Al activar, tu cuenta quedará lista para iniciar sesión</p>
      </div>
    </div>
  )
}

export default function Activate() {
  return <ActivateInner />
}