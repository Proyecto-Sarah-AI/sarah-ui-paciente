import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import '../styles/Register.css';
import logoClinicaAlemana from '../assets/clinica-alemana-logo.png';

export function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const validateEmail = (value) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Por favor ingresa un correo válido';
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#D1D5DB' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Débil', color: '#EF4444' };
    if (strength === 3) return { strength: 2, label: 'Media', color: '#F59E0B' };
    if (strength === 4) return { strength: 3, label: 'Buena', color: '#10B981' };
    return { strength: 4, label: 'Excelente', color: '#059669' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'email') {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    }

    if (field === 'confirmPassword' || field === 'password') {
      if (field === 'confirmPassword' && value && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      } else if (field === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).every(error => !error) && acceptedTerms) {
      console.log('Registration attempt:', formData);
      alert('Registro simulado. En producción se conectaria al backend.');
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !errors.email &&
    !errors.confirmPassword &&
    acceptedTerms;

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img
            src={logoClinicaAlemana}
            alt="Clínica Alemana"
            className="register-logo"
          />
          <h1 className="register-title">Crea tu cuenta</h1>
          <p className="register-subtitle">
            Solo te tomará 1 minuto empezar a cuidar tu salud
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre completo
            </label>
            <div className="input-wrapper">
              <User size={24} className="input-icon" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Juan Pérez"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <div className="input-wrapper">
              <Mail size={24} className="input-icon" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="tu@correo.com"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p
                id="email-error"
                className="error-message"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Teléfono <span className="optional">(opcional)</span>
            </label>
            <div className="input-wrapper">
              <Phone size={24} className="input-icon" />
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+56 9 1234 5678"
                className="form-input"
              />
            </div>
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
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
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
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="strength-bar"
                      style={{
                        backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : '#E5E7EB'
                      }}
                    />
                  ))}
                </div>
                <p className="strength-label" style={{ color: passwordStrength.color }}>
                  Seguridad: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
            </label>
            <div className="input-wrapper">
              <Lock size={24} className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Repite tu contraseña"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? (
                  <EyeOff size={24} />
                ) : (
                  <Eye size={24} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="error-message"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="terms-checkbox"
            />
            <label htmlFor="terms" className="terms-label">
              Acepto los{' '}
              <a href="#" className="terms-link">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="terms-link">
                política de privacidad
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="submit-btn"
          >
            Crear cuenta
          </button>
        </form>

        <div className="register-footer">
          <p className="footer-text">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="switch-link"
            >
              Inicia sesión
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
