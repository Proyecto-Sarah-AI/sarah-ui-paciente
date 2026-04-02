import React, { useState, useEffect } from 'react';
import LegalConsent from './components/LegalConsent';
// import Home from './components/Home'; // Cuando Lorenzo lo tenga listo

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
    <div className="main-dashboard">
      <nav> Barra de Navegación - Sarah </nav>
      <h1>¡Bienvenido, Paciente!</h1>
      <p>Aquí se deberia redireccionar al home page.</p>
      <button onClick={() => {
        localStorage.removeItem('sarah_consent_status');
        window.location.reload();
      }}>
        Resetear (Solo para pruebas de desarrollo)
      </button>
    </div>
  );
}

export default App;