import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AddPatient from './pages/AddPatient'
import PatientLogin from './pages/PatientLogin'
import PatientPortal from './pages/PatientPortal'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospital" element={<Dashboard />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-portal" element={<PatientPortal />} />
      </Routes>
    </Router>
  )
}

export default App