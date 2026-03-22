import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddPatient() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    age: '',
    symptoms: '',
    vitals: ''
  })

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.symptoms) {
      alert('Please fill in all required fields!')
      return
    }
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/patients', form)
      alert('Patient added successfully!')
      navigate('/')
    } catch (error) {
      alert('Error adding patient. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#1a1a2e' }}>Add New Patient</h1>
      <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Patient Name *</label>
          <input type="text" placeholder="Enter patient name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Age *</label>
          <input type="number" placeholder="Enter age" value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Symptoms *</label>
          <textarea placeholder="Describe symptoms e.g. chest pain, difficulty breathing, high fever"
            value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })}
            rows={4}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Vitals (optional)</label>
          <input type="text" placeholder="e.g. low blood pressure, high fever, low oxygen"
            value={form.vitals} onChange={e => setForm({ ...form, vitals: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/')}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontSize: '16px', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: loading ? '#999' : '#0066cc', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Analyzing with AI...' : 'Add Patient'}
          </button>
        </div>
      </div>
    </div>
  )
}