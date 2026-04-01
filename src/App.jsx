import { useState } from 'react';
import './App.css';
import LegalConsent from './components/LegalConsent';

function App() {
  const [hasConsented, setHasConsented] = useState(false);

  if (!hasConsented) {
    return <LegalConsent onAccept={() => setHasConsented(true)} />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '0.5rem',
      color: 'var(--ca-navy)',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Bienvenido/a a Sarah</h1>
      <p style={{ color: 'var(--ca-gray-dark)' }}>Has aceptado los términos con éxito.</p>
    </div>
  );
}

export default App;
