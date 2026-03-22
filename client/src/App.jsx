import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AddPatient from './pages/AddPatient'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-patient" element={<AddPatient />} />
      </Routes>
    </Router>
  )
}

export default App