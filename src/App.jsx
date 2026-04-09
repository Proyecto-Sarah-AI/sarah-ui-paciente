import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Consent from './pages/consent/Consent'
import Login from './pages/login/Login'
import Home from './pages/home/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/consent" replace />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/consent" replace />} />
    </Routes>
  )
}

export default App