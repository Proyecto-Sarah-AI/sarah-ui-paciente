import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Consent from './pages/consent/Consent'
import Login from './pages/login/Login'
import Home from './pages/home/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/paciente/login" replace />} />
      <Route path="/paciente/consent" element={<Consent />} />
      <Route path="/paciente/login" element={<Login />} />
      <Route path="/paciente/home" element={<Home />} />
    </Routes>
  )
}

export default App