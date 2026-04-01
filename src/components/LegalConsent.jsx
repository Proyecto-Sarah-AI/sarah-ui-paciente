import React, { useState } from 'react';

const LegalConsent = ({ onAccept }) => {
  const [accepted, setAccepted] = useState({
    terms: false,
    dataPrivacy: false,
    supportNetwork: false // Opcional según el paciente [cite: 47]
  });

  const canContinue = accepted.terms && accepted.dataPrivacy;

  return (
    <div className="consent-container">
      <h2>Consentimiento Informado - Proyecto Sarah</h2>
      <p>Bienvenido a la plataforma de acompañamiento clínico de la Clínica Alemana de Valdivia.</p>
      
      <div className="terms-box" style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc' }}>
        {/* Aquí va el texto legal según leyes chilenas [cite: 22, 49] */}
        <p>Al utilizar este asistente, usted acepta que sus interacciones sean registradas como parte de su historial clínico[cite: 54, 55]...</p>
      </div>

      <div className="checkbox-group">
        <label>
          <input 
            type="checkbox" 
            checked={accepted.terms} 
            onChange={(e) => setAccepted({...accepted, terms: e.target.checked})} 
          />
          Acepto los términos de uso de la aplicación[cite: 13].
        </label>

        <label>
          <input 
            type="checkbox" 
            checked={accepted.dataPrivacy} 
            onChange={(e) => setAccepted({...accepted, dataPrivacy: e.target.checked})} 
          />
          Consiento el tratamiento de mis datos personales y clínicos[cite: 13, 47].
        </label>
      </div>

      <button 
        disabled={!canContinue} 
        onClick={() => onAccept(accepted)}
        style={{ backgroundColor: canContinue ? '#007bff' : '#ccc' }}
      >
        Continuar al tratamiento
      </button>
    </div>
  );
};

export default LegalConsent;