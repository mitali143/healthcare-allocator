import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PatientLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '' })

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert('Please fill in all fields!')
      return
    }
    localStorage.setItem('patient', JSON.stringify(form))
    navigate('/patient-portal')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1729 0%, #0d9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧑‍💼</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Patient Portal</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Enter your details to continue</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Full Name</label>
          <input type="text" placeholder="Enter your full name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Phone Number</label>
          <input type="tel" placeholder="Enter your phone number" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#0d9488', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
          Continue →
        </button>

        <button onClick={() => navigate('/')}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '14px', cursor: 'pointer', marginTop: '12px' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}