import { Navigate, Route, Routes } from 'react-router-dom'
import Consent from './pages/consent/Consent'
import Activate from './pages/activate/Activate'
import Login from './pages/login/Login'
import Home from './pages/home/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/activate" element={<Activate />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App