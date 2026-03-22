import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddPatient() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', age: '', symptoms: '', vitals: '' })

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.symptoms) { alert('Fill required fields!'); return }
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/patients', form)
      alert('Patient added!')
      navigate('/')
    } catch(e) { alert('Error!') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Add Patient</h1>
      <input placeholder='Name' value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <input type='number' placeholder='Age' value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <textarea placeholder='Symptoms' value={form.symptoms} onChange={e => setForm({...form, symptoms: e.target.value})} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <input placeholder='Vitals optional' value={form.vitals} onChange={e => setForm({...form, vitals: e.target.value})} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px' }} />
      <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 20px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '8px' }}>{loading ? 'Adding...' : 'Add Patient'}</button>
    </div>
  )
}
