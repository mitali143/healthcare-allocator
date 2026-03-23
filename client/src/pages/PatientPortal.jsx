import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function PatientPortal() {
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [resources, setResources] = useState([])
  const [symptoms, setSymptoms] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const stored = localStorage.getItem('patient')
    if (!stored) { navigate('/patient-login'); return }
    setPatient(JSON.parse(stored))
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const r = await axios.get('https://healthcare-allocator.onrender.com/api/resources')
      setResources(r.data)
    } catch(e) { console.error(e) }
  }

  const getAiAdvice = async () => {
    if (!symptoms) { alert('Enter symptoms!'); return }
    setAiLoading(true)
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: 'Patient symptoms: ' + symptoms + '. Give: 1) Doctor type 2) Urgency 3) First aid 4) Warning signs.' }]
      }, { headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' } })
      setAiResponse(response.data.choices[0].message.content)
    } catch(e) { setAiResponse('Unable to get AI advice. Please consult a doctor.') }
    finally { setAiLoading(false) }
  }

  const bookSlot = async () => {
    try {
      await axios.post('https://healthcare-allocator.onrender.com/api/patients', {
        name: patient.name, age: 0,
        symptoms: symptoms || 'Emergency booking',
        vitals: 'Booked via patient portal'
      })
      alert('Slot booked! Please proceed to hospital.')
      fetchResources()
    } catch(e) { alert('Error booking slot.') }
  }

  const beds = resources.filter(r => r.type === 'bed')
  const availableBeds = beds.filter(r => r.available)
  const doctors = resources.filter(r => r.type === 'doctor')
  const availableDoctors = doctors.filter(r => r.available)
  const waitTime = Math.max(0, (beds.length - availableBeds.length) * 15)
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>MediAlloc Patient Portal</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Hi {patient?.name}</span>
          <button onClick={() => { localStorage.removeItem('patient'); navigate('/') }}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: 'white', padding: '0 24px' }}>
        {[['home','Home'],['ai-doctor','AI Doctor'],['book','Book Slot'],['availability','Availability']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ padding: '14px 20px', border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', color: activeTab === id ? '#0d9488' : '#64748b', borderBottom: activeTab === id ? '2px solid #0d9488' : '2px solid transparent', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'home' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', borderRadius: '16px', padding: '28px', marginBottom: '20px', color: 'white' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Welcome, {patient?.name}!</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>How can we help you today?</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                ['AI Doctor', 'Get instant AI medical advice', 'ai-doctor', '#eff6ff', '#bfdbfe'],
                ['Book Emergency Slot', 'Reserve your hospital spot', 'book', '#f0fdfa', '#99f6e4'],
                ['Check Availability', 'See real-time beds and doctors', 'availability', '#fdf4ff', '#e9d5ff'],
                ['Wait Time', 'Est wait: ' + waitTime + ' mins', 'availability', '#fff7ed', '#fed7aa']
              ].map(([title, desc, tab, bg, border], i) => (
                <div key={i} onClick={() => setActiveTab(tab)}
                  style={{ background: bg, border: '1px solid ' + border, borderRadius: '14px', padding: '20px', cursor: 'pointer' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{title}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai-doctor' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>AI Medical Assistant</h2>
            <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '12px', color: '#854d0e' }}>
              AI guidance only — not a medical diagnosis. Always consult a real doctor.
            </div>
            <textarea placeholder="Describe your symptoms or medical doubts..." value={symptoms}
              onChange={e => setSymptoms(e.target.value)} rows={4}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <button onClick={getAiAdvice} disabled={aiLoading}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: aiLoading ? '#94a3b8' : '#0d9488', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>
              {aiLoading ? 'Analyzing symptoms...' : 'Get AI Medical Advice'}
            </button>
            {aiResponse && (
              <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
                <button onClick={bookSlot}
                  style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0d9488', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                  Book Hospital Slot
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'book' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Book Emergency Slot</h2>
            <div style={{ background: availableBeds.length > 0 ? '#f0fdfa' : '#fef2f2', border: '1px solid ' + (availableBeds.length > 0 ? '#99f6e4' : '#fecaca'), borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ fontWeight: '600', color: '#0f172a' }}>{availableBeds.length > 0 ? 'Beds Available' : 'No Beds Available'}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{availableBeds.length} of {beds.length} beds free. Est wait: {waitTime} mins</p>
            </div>
            <textarea placeholder="Describe your emergency or symptoms..." value={symptoms}
              onChange={e => setSymptoms(e.target.value)} rows={3}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <button onClick={bookSlot}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#0d9488', color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Book Emergency Slot Now
            </button>
          </div>
        )}

        {activeTab === 'availability' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {[
                ['Available Beds', availableBeds.length + '/' + beds.length, '#0d9488'],
                ['Available Doctors', availableDoctors.length + '/' + doctors.length, '#2563eb'],
                ['Est Wait Time', waitTime + ' min', '#f59e0b']
              ].map(([label, value, color], i) => (
                <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <p style={{ fontSize: '22px', fontWeight: '700', color: color }}>{value}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{label}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {resources.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #f8fafc' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{r.name}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>{r.type}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: r.available ? '#ecfdf5' : '#fef2f2', color: r.available ? '#10b981' : '#ef4444' }}>
                    {r.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}