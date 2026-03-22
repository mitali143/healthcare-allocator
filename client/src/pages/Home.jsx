import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1729 0%, #0d9488 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
        <h1 style={{ color: 'white', fontSize: '42px', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '12px' }}>MediAlloc</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '400px', lineHeight: 1.6 }}>Smart AI-powered hospital resource allocation platform for patients and healthcare providers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '700px', width: '100%' }}>
        
        <div onClick={() => navigate('/patient-login')}
          style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧑‍💼</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>I am a Patient</h2>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>Check availability, book emergency slots, get AI symptom analysis and live wait times</p>
          <div style={{ background: '#0d9488', color: 'white', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
            Enter Patient Portal →
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
            {['🛏️ Beds', '🤖 AI Doc', '⏱️ Wait Time'].map((f, i) => (
              <span key={i} style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>{f}</span>
            ))}
          </div>
        </div>

        <div onClick={() => navigate('/hospital')}
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '36px 28px', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>I am a Hospital</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>Access admin dashboard, manage resources, view AI suggestions and patient priority queue</p>
          <div style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.3)' }}>
            Enter Admin Panel →
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
            {['📊 Dashboard', '🤖 AI', '⚡ Live'].map((f, i) => (
              <span key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '48px' }}>Powered by AI • Built for India's Healthcare System</p>
    </div>
  )
}