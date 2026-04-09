import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import '../styles/Login.css';
import logoClinicaAlemana from '../assets/clinica-alemana-logo.png';

export function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Por favor ingresa un correo válido');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && !emailError) {
      console.log('Login attempt:', { email });
      alert('Inicio de sesión simulado. En producción se conectaria al backend.');
    }
  };

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
          <p className="login-subtitle">
            Ingresa para continuar con tu tratamiento
          </p>
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
            {emailError && (
              <p
                id="email-error"
                className="error-message"
              >
                {emailError}
              </p>
            )}
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
                {showPassword ? (
                  <EyeOff size={24} />
                ) : (
                  <Eye size={24} />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="forgot-password-btn"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="submit"
            disabled={!email || !password || !!emailError}
            className="submit-btn"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="switch-link"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        <p className="privacy-notice">
          🔒 Tus datos están protegidos bajo las normas de privacidad médica
        </p>
      </div>
    </div>
  );
}
