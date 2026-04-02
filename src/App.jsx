import React, { useState, useEffect } from 'react';
import LegalConsent from './components/LegalConsent';
import { Login } from './components/Login';
import { Register } from './components/Register';
// import Home from './components/Home'; // Cuando Lorenzo lo tenga listo

function App() {
  // Siempre mostrar página de consentimiento al iniciar
  const [hasConsented, setHasConsented] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sarah_auth_status') === 'authenticated';
  });

  const [showRegister, setShowRegister] = useState(false);
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

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      console.log("Intentando autenticación con:", email);

      // Simulamos la autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Guardamos el estado de autenticación
      localStorage.setItem('sarah_auth_status', 'authenticated');
      localStorage.setItem('sarah_user_email', email);
      localStorage.setItem('sarah_auth_timestamp', new Date().toISOString());

      setIsAuthenticated(true);

      /* TODO: Cuando el equipo de Backend entregue la API:
      const response = await fetch('https://api-externa.cl/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if(response.ok) {
        const data = await response.json();
        localStorage.setItem('sarah_auth_token', data.token);
        setIsAuthenticated(true);
      }
      */
    } catch (error) {
      console.error("Error en la autenticación:", error);
      alert("Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      console.log("Intentando registro con:", formData.email);

      // Simulamos el registro
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Guardamos el estado de autenticación
      localStorage.setItem('sarah_auth_status', 'authenticated');
      localStorage.setItem('sarah_user_email', formData.email);
      localStorage.setItem('sarah_auth_timestamp', new Date().toISOString());

      setIsAuthenticated(true);

      /* TODO: Cuando el equipo de Backend entregue la API:
      const response = await fetch('https://api-externa.cl/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(response.ok) {
        const data = await response.json();
        localStorage.setItem('sarah_auth_token', data.token);
        setIsAuthenticated(true);
      }
      */
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error al crear la cuenta. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sarah_auth_status');
    localStorage.removeItem('sarah_user_email');
    localStorage.removeItem('sarah_auth_timestamp');
    setIsAuthenticated(false);
    setShowRegister(false);
  };

  if (loading) {
    return <div className="loading-screen">Procesando tu solicitud en Sarah...</div>;
  }

  // Paso 1: Aceptar términos y condiciones
  if (!hasConsented) {
    return <LegalConsent onAccept={handleAccept} />;
  }

  // Paso 2: Autenticarse (Login o Register)
  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  // Paso 3: Dashboard (Aquí es donde Lorenzo y Martín pondrán su magia)
  const userEmail = localStorage.getItem('sarah_user_email');
  return (
    <div className="main-dashboard">
      <nav> Barra de Navegación - Sarah </nav>
      <h1>¡Bienvenido, Paciente!</h1>
      <p>Email autenticado: {userEmail}</p>
      <p>Aquí se deberia redireccionar al home page.</p>
      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
      <button onClick={() => {
        localStorage.removeItem('sarah_consent_status');
        localStorage.removeItem('sarah_auth_status');
        localStorage.removeItem('sarah_user_email');
        window.location.reload();
      }}>
        Resetear (Solo para pruebas de desarrollo)
      </button>
    </div>
  );
}

export default App;