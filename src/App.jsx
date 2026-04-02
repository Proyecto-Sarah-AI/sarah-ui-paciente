import React, { useState, useEffect } from 'react';
import LegalConsent from './components/LegalConsent';
import { Home } from "./pages/home";

function App() {
  // Estado inicial: revisamos si ya aceptó en sesiones anteriores (UX/Usabilidad)
  const [hasConsented, setHasConsented] = useState(() => {
    return localStorage.getItem('sarah_consent_status') === 'accepted';
  });

  const [loading, setLoading] = useState(false);

  const handleAccept = async (datos) => {
    setLoading(true);
    
    try {
      // --- SIMULACIÓN DE LLAMADA AL BACKEND EXTERNO ---
      console.log("Enviando datos al Backend Externo...", datos);
      
      // Simulamos 1.5 segundos de espera (Rendimiento/UX)
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Guardamos localmente para que no pida los términos de nuevo al refrescar
      localStorage.setItem('sarah_consent_status', 'accepted');
      localStorage.setItem('sarah_consent_timestamp', new Date().toISOString());
      
      setHasConsented(true);
      // ------------------------------------------------
      
      /* TODO: Cuando el equipo de Backend entregue la API:
      const response = await fetch('https://api-externa.cl/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if(response.ok) setHasConsented(true);
      */

    } catch (error) {
      console.error("Error en la conexión con el servicio:", error);
      alert("Hubo un problema al registrar su consentimiento. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Registrando su consentimiento en Sarah...</div>;
  }

  if (!hasConsented) {
    return <LegalConsent onAccept={handleAccept} />;
  }

  // Aquí es donde Lorenzo (Home) y Martín (Agente) pondrán su magia
  return (
    <>
      {/* Solo se muestra Home si hay consentimiento, si no, muestra el Consentimiento */}
      {hasConsented ? (
        <Home />
      ) : (
        <ConsentScreen onAccept={handleAccept} />
      )}
      
      {/* Botón de reset temporal para desarrollo */}
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', opacity: 0.5 }}>
        <button 
          onClick={() => {
            localStorage.removeItem('sarah_consent_status');
            window.location.reload();
          }}
          style={{ fontSize: '10px', padding: '5px', cursor: 'pointer' }}
        >
          Reset Consent (Dev Only)
        </button>
      </div>
    </>
  );
}
export default App;