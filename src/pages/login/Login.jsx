import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import './Login.css'
import logoClinicaAlemana from '../../assets/clinica-alemana-logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailError(emailRegex.test(value) ? '' : 'Por favor ingresa un correo válido')
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem('sarah_auth_status', 'authenticated')
      localStorage.setItem('sarah_user_email', email)
      localStorage.setItem('sarah_auth_timestamp', new Date().toISOString())
      window.location.assign('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src={logoClinicaAlemana}
            alt="Clínica Alemana"
            className="login-logo"
          />
          <h1 className="login-title">Bienvenido de vuelta</h1>
          <p className="login-subtitle">Ingresa para continuar con tu tratamiento</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <div className="input-wrapper">
              <Mail size={24} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="tu@correo.com"
                className={`form-input ${emailError ? 'input-error' : ''}`}
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
            </div>
            {emailError ? (
              <p id="email-error" className="error-message">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-wrapper">
              <Lock size={24} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button type="button" className="forgot-password-btn">
            ¿Olvidaste tu contraseña?
          </button>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="privacy-notice">
          🔒 Tus datos están protegidos bajo las normas de privacidad médica
        </p>
      </div>
    </div>
  )
}
