import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [patients, setPatients] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [patientsRes, resourcesRes] = await Promise.all([
        axios.get('https://healthcare-allocator.onrender.com/api/patients'),
        axios.get('https://healthcare-allocator.onrender.com/api/resources')
      ])
      setPatients(patientsRes.data)
      setResources(resourcesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const allocateResource = async (patientId, resourceId, resourceType) => {
    try {
      await axios.post('https://healthcare-allocator.onrender.com/api/allocate', {
        patient_id: patientId,
        resource_id: resourceId,
        resource_type: resourceType
      })
      fetchData()
    } catch (error) {
      console.error('Error allocating resource:', error)
    }
  }

  const getPriorityColor = (score) => {
    if (score >= 80) return '#ff4444'
    if (score >= 60) return '#ff8800'
    if (score >= 40) return '#ffcc00'
    return '#00cc44'
  }

  const getPriorityLabel = (score) => {
    if (score >= 80) return 'CRITICAL'
    if (score >= 60) return 'HIGH'
    if (score >= 40) return 'MEDIUM'
    return 'LOW'
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>
      Loading...
    </div>
  )

  const availableResources = resources.filter(r => r.available)
  const waitingPatients = patients.filter(p => p.status === 'waiting')
  const allocatedPatients = patients.filter(p => p.status === 'allocated')

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1a1a2e', margin: 0 }}>🏥 Healthcare Resource Allocator</h1>
        <Link to="/add-patient" style={{
          background: '#0066cc', color: 'white', padding: '10px 20px',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
        }}>
          + Add Patient
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {[
          { label: 'Total Patients', value: patients.length, color: '#0066cc' },
          { label: 'Waiting', value: waitingPatients.length, color: '#ff8800' },
          { label: 'Allocated', value: allocatedPatients.length, color: '#00cc44' },
          { label: 'Available Resources', value: availableResources.length, color: '#9900cc' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center',
            borderTop: `4px solid ${stat.color}`
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ color: '#666', fontSize: '14px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>🚨 Priority Queue</h2>
          {waitingPatients.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>No patients waiting</p>
          ) : (
            waitingPatients.map(patient => (
              <div key={patient.id} style={{
                border: `2px solid ${getPriorityColor(patient.priority_score)}`,
                borderRadius: '8px', padding: '15px', marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{patient.name}</strong> — Age: {patient.age}
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{patient.symptoms}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{patient.vitals}</div>
                  </div>
                  <div style={{
                    background: getPriorityColor(patient.priority_score),
                    color: 'white', padding: '5px 10px', borderRadius: '6px',
                    fontWeight: 'bold', fontSize: '12px', textAlign: 'center'
                  }}>
                    <div>{patient.priority_score}</div>
                    <div>{getPriorityLabel(patient.priority_score)}</div>
                  </div>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {availableResources.map(resource => (
                    <button key={resource.id} onClick={() => allocateResource(patient.id, resource.id, resource.type)}
                      style={{
                        background: '#0066cc', color: 'white', border: 'none',
                        padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px'
                      }}>
                      Assign {resource.name}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>🛏️ Resources</h2>
          {resources.map(resource => (
            <div key={resource.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px', borderRadius: '8px', marginBottom: '8px',
              background: resource.available ? '#f0fff4' : '#fff0f0'
            }}>
              <div>
                <strong>{resource.name}</strong>
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>({resource.type})</span>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                background: resource.available ? '#00cc44' : '#ff4444', color: 'white'
              }}>
                {resource.available ? 'Available' : 'Occupied'}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}