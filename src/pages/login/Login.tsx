import React, { useState } from 'react'
import { Form } from '@base-ui/react/form'
import { Field } from '@base-ui/react/field'
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

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

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem('sarah_auth_status', 'authenticated')
      localStorage.setItem('sarah_user_email', email)
      localStorage.setItem('sarah_auth_timestamp', new Date().toISOString())
      window.location.assign('/consent')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
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
