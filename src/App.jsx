import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LegalConsent from './components/LegalConsent'; 

function App() {
  const [hasConsented, setHasConsented] = useState(false);

  if (!hasConsented) {
    return <LegalConsent onAccept={() => setHasConsented(true)} />;
  }

  return (
    <div>
      <h1>Bienvenido a Sarah</h1>
      <p>Has aceptado los términos con éxito.</p>
    </div>
  );
}

export default App;