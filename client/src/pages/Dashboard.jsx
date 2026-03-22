import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [patients, setPatients] = useState([])
  const [resources, setResources] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [p, r] = await Promise.all([
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/resources')
      ])
      setPatients(p.data)
      setResources(r.data)
      generateSuggestions(p.data, r.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const generateSuggestions = (pts, res) => {
    const waiting = pts.filter(p => p.status === 'waiting').sort((a,b) => b.priority_score - a.priority_score)
    const available = res.filter(r => r.available)
    const sugs = []
    waiting.slice(0,3).forEach((p, i) => {
      const waitMins = Math.floor((Date.now() - new Date(p.created_at)) / 60000)
      const urgency = p.priority_score >= 80 ? 'Critical' : p.priority_score >= 60 ? 'High' : 'Medium'
      const resource = available[i]
      if (resource) {
        sugs.push({ text: `Allocate ${resource.name} to ${p.name} (${urgency}, waiting ${waitMins} min)`, type: urgency, patient: p, resource })
      } else {
        sugs.push({ text: `${p.name} is ${urgency} — no resources available`, type: 'warning', patient: p, resource: null })
      }
    })
    if (sugs.length === 0) sugs.push({ text: 'All patients have been allocated. System running smoothly!', type: 'Low' })
    setSuggestions(sugs)
  }

  const allocate = async (patientId, resourceId, resourceType) => {
    try {
      await axios.post('http://localhost:5000/api/allocate', {
        patient_id: patientId, resource_id: resourceId, resource_type: resourceType
      })
      fetchData()
    } catch (e) { console.error(e) }
  }

  const getUrgency = (score) => {
    if (score >= 80) return { label: 'Critical', color: '#ef4444', bg: '#fef2f2' }
    if (score >= 60) return { label: 'High', color: '#f59e0b', bg: '#fffbeb' }
    if (score >= 40) return { label: 'Medium', color: '#0d9488', bg: '#f0fdfa' }
    return { label: 'Low', color: '#10b981', bg: '#ecfdf5' }
  }

  const getSuggestionColor = (type) => {
    if (type === 'Critical') return { border: '#ef4444', bg: '#fef2f2', badge: '#ef4444', icon: '🚨' }
    if (type === 'High') return { border: '#f59e0b', bg: '#fffbeb', badge: '#f59e0b', icon: '⚠️' }
    if (type === 'warning') return { border: '#f59e0b', bg: '#fffbeb', badge: '#f59e0b', icon: '⚠️' }
    return { border: '#10b981', bg: '#ecfdf5', badge: '#10b981', icon: '✅' }
  }

  const getWaitTime = (createdAt) => {
    const mins = Math.floor((Date.now() - new Date(createdAt)) / 60000)
    if (mins < 1) return 'Just now'
    if (mins === 1) return '1 min ago'
    return `${mins} mins ago`
  }

  const waiting = patients.filter(p => p.status === 'waiting').sort((a,b) => b.priority_score - a.priority_score)
  const allocated = patients.filter(p => p.status === 'allocated')
  const available = resources.filter(r => r.available)

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px', background: '#f0fdfa' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #ccfbf1', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: '#0d9488', fontSize: '15px', fontWeight: '500' }}>Loading MediAlloc...</span>
    </div>
  )
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      <nav style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 24px rgba(13,148,136,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏥</div>
          <div>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '16px', letterSpacing: '-0.02em' }}>MediAlloc</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginLeft: '8px' }}>Smart Resource Allocation</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', background: '#86efac', borderRadius: '50%', animation: 'pulse 2s ease infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>System Live</span>
          </div>
          <Link to="/add-patient" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.3)' }}>
            + New Patient
          </Link>
        </div>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', padding: '32px 32px 64px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Healthcare Dashboard</p>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '4px' }}>Resource Allocation Center</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>AI-powered triage and smart resource distribution</p>
          {(waiting.filter(p => p.priority_score >= 80).length > 0 || available.filter(r => r.type === 'bed').length === 0) && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {waiting.filter(p => p.priority_score >= 80).length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '10px 16px' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{waiting.filter(p => p.priority_score >= 80).length} critical patient waiting — immediate attention required!</span>
              </div>
            )}
            {available.filter(r => r.type === 'bed').length === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '10px', padding: '10px 16px' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>No beds available — all occupied!</span>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '-32px auto 0', padding: '0 32px 32px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Patients', value: patients.length, color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: '👥' },
            { label: 'Waiting', value: waiting.length, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '⏳' },
            { label: 'Allocated', value: allocated.length, color: '#10b981', bg: '#ecfdf5', border: '#6ee7b7', icon: '✅' },
            { label: 'Available Resources', value: available.length, color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc', icon: '🏥' }
          ].map((s, i) => (
            <div key={i} className={'fade-up-' + (i+1)} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid ' + s.border, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>{s.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: s.color, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</p>
                </div>
                <div style={{ background: s.bg, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div><div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', background: '#f0fdfa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>AI Suggestions</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Smart recommendations based on current patient data</p>
            </div>
            <span style={{ marginLeft: 'auto', background: '#f0fdfa', color: '#0d9488', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', border: '1px solid #99f6e4' }}>LIVE AI</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {suggestions.map((s, i) => {
              const c = getSuggestionColor(s.type)
              return (
                <div key={i} className="slide-in" style={{ borderRadius: '12px', border: '1px solid ' + c.border, background: c.bg, padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', lineHeight: 1.5 }}>{s.text}</p>
                    {s.resource && s.patient && (
                      <button onClick={() => allocate(s.patient.id, s.resource.id, s.resource.type)}
                        style={{ marginTop: '10px', fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: 'none', background: c.badge, color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Patient Timeline</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{patients.length} total patients</p>
              </div>
              {waiting.length > 0 && <span className="pulse" style={{ background: '#fef2f2', color: '#ef4444', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>🔴 {waiting.length} WAITING</span>}
            </div>
            <div style={{ padding: '16px 24px', maxHeight: '420px', overflowY: 'auto' }}>
              {patients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏥</div>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>No patients yet</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>Add your first patient to get started</p>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '15px', top: 0, bottom: 0, width: '2px', background: '#f1f5f9' }} />
                  {patients.sort((a,b) => b.priority_score - a.priority_score).map((patient, idx) => {
                    const urgency = getUrgency(patient.priority_score)
                    const isAllocated = patient.status === 'allocated'
                    return (
                      <div key={patient.id} className="fade-up" style={{ display: 'flex', gap: '16px', marginBottom: '16px', position: 'relative' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isAllocated ? '#ecfdf5' : urgency.bg, border: '2px solid ' + (isAllocated ? '#10b981' : urgency.color), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0, zIndex: 1 }}>
                          {isAllocated ? '✅' : '⏳'}
                        </div>
                        <div style={{ flex: 1, background: '#fafafa', borderRadius: '12px', padding: '12px 16px', border: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{patient.name}</span>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Age {patient.age}</span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>{patient.symptoms}</p>
                              {patient.vitals && <p style={{ fontSize: '11px', color: '#94a3b8' }}>{patient.vitals}</p>}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <span style={{ background: isAllocated ? '#ecfdf5' : urgency.bg, color: isAllocated ? '#10b981' : urgency.color, fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', display: 'block', marginBottom: '4px' }}>
                                {isAllocated ? 'Allocated' : urgency.label}
                              </span>
                              <span style={{ fontSize: '18px', fontWeight: '700', color: isAllocated ? '#10b981' : urgency.color }}>{patient.priority_score}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>🕐 {getWaitTime(patient.created_at)}</span>
                            {!isAllocated && (
                              <button onClick={async () => {
                                if(window.confirm('Remove ' + patient.name + ' from queue?')) {
                                  await axios.delete('http://localhost:5000/api/patients/' + patient.id)
                                  fetchData()
                                }
                              }}
                                style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}>
                                Remove
                              </button>
                            )}
                            {isAllocated && patient.allocated_resource && (
                              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>📍 {patient.allocated_resource}</span>
                            )}
                            {isAllocated && (
                            <button onClick={async () => {
                              if(window.confirm('Discharge ' + patient.name + '?')) {
                                await axios.delete('http://localhost:5000/api/patients/' + patient.id)
                                fetchData()
                              }
                            }}
                              style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#ecfdf5', color: '#10b981', cursor: 'pointer', fontWeight: '600' }}>
                              Discharge ✓
                            </button>
                          )}
                          </div>
                          {!isAllocated && available.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                              {available.map(r => (
                                <button key={r.id} onClick={() => allocate(patient.id, r.id, r.type)}
                                  style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', cursor: 'pointer', fontWeight: '500' }}>
                                  Assign {r.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Resources</h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{available.length} of {resources.length} available</p>
            </div>
            <div style={{ padding: '16px 24px' }}>
              {resources.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: r.available ? '#f0fdfa' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      {r.type === 'bed' ? '🛏️' : r.type === 'doctor' ? '👨‍⚕️' : '💊'}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{r.name}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{r.type}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: r.available ? '#ecfdf5' : '#fef2f2', color: r.available ? '#10b981' : '#ef4444' }}>
                    {r.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}