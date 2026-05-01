import React, { useState } from 'react'
import './Consent.css'

export default function Consent() {
  const [accepted, setAccepted] = useState({
    terms: false,
    dataPrivacy: false,
    supportNetwork: false,
  })
  const [loading, setLoading] = useState(false)

  const canContinue = accepted.terms && accepted.dataPrivacy

  const handleContinue = async () => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      localStorage.setItem('sarah_consent_status', 'accepted')
      localStorage.setItem('sarah_consent_timestamp', new Date().toISOString())
      window.location.assign('/paciente/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="consent-container">
      <main className="consent-card">
        <div className="consent-card-accent" aria-hidden="true" />

        <div className="consent-card-body">
          <h1 className="consent-title">Consentimiento Informado</h1>
          <p className="consent-subtitle">
            Proyecto <strong>Sarah</strong> — Plataforma de acompañamiento clínico
          </p>

          <p className="consent-welcome">
            Bienvenido/a. Antes de continuar, por favor lea detenidamente los términos
            de uso y el tratamiento de sus datos personales.
          </p>

          <div className="terms-box" role="region" aria-label="Términos y condiciones">
            <h2 className="terms-title">Términos de Uso y Privacidad</h2>
            <p>
              Al utilizar este asistente, usted acepta que sus interacciones sean registradas
              como parte de su historial clínico, de conformidad con la Ley N°19.628 sobre
              Protección de la Vida Privada y la Ley N°20.584 sobre Derechos y Deberes de los
              Pacientes en Chile.
            </p>
            <p>
              La información recopilada será utilizada exclusivamente con fines de atención
              clínica y mejora continua de los servicios. Sus datos no serán compartidos con
              terceros sin su consentimiento explícito, salvo en los casos previstos por la
              legislación vigente.
            </p>
            <p>
              Usted tiene derecho a acceder, rectificar y cancelar sus datos personales en
              cualquier momento, comunicándose directamente con el equipo médico.
            </p>
            <p>
              El uso de este sistema es voluntario. Puede interrumpir su participación en
              cualquier momento sin que esto afecte la calidad de su atención médica.
            </p>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={accepted.terms}
                onChange={(e) => setAccepted({ ...accepted, terms: e.target.checked })}
              />
              <span className="checkbox-custom" aria-hidden="true" />
              <span>Acepto los <strong>términos de uso</strong> de la aplicación.</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={accepted.dataPrivacy}
                onChange={(e) => setAccepted({ ...accepted, dataPrivacy: e.target.checked })}
              />
              <span className="checkbox-custom" aria-hidden="true" />
              <span>Consiento el <strong>tratamiento de mis datos personales y clínicos</strong>.</span>
            </label>

            <label className="checkbox-label optional">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={accepted.supportNetwork}
                onChange={(e) => setAccepted({ ...accepted, supportNetwork: e.target.checked })}
              />
              <span className="checkbox-custom" aria-hidden="true" />
              <span>
                Autorizo compartir información con mi <strong>red de apoyo</strong>.{' '}
                <span className="optional-tag">Opcional</span>
              </span>
            </label>
          </div>

          <button
            className={`consent-btn${canContinue ? '' : ' consent-btn--disabled'}`}
            disabled={loading}
            onClick={handleContinue}
            aria-disabled={loading}
          >
            {loading ? 'Procesando...' : canContinue ? 'Continuar al tratamiento' : 'Acepte los términos para continuar'}
            {canContinue && !loading ? (
              <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : null}
          </button>

          <p className="consent-footer-note">
            Al continuar, confirma que ha leído y comprendido el consentimiento informado.
          </p>
        </div>
      </main>

    </div>
  )
}
