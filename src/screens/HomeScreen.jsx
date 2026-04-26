import { useState } from 'react'
import Logo from '../components/Logo'
import { BurgerButton } from '../components/BurgerMenu'
import { detectNearbyRestaurants, getPlacesApiKey } from '../utils/places'

const STEPS = [
  { n: 1, text: 'Escanea el ticket' },
  { n: 2, text: 'Elige cuántos sois' },
  { n: 3, text: 'Paga tu parte' },
]

export default function HomeScreen({ onScan, onManual, onBurger, onDetectRestaurant }) {
  const [geoStatus, setGeoStatus]   = useState('idle') // idle | loading | done | error
  const [detectedName, setDetected] = useState('')

  async function handleGeoDetect() {
    if (!getPlacesApiKey()) {
      setGeoStatus('error')
      setDetected('API key no configurada')
      return
    }
    setGeoStatus('loading')
    try {
      const places = await detectNearbyRestaurants()
      const name = places[0] || ''
      setDetected(name)
      setGeoStatus(name ? 'done' : 'error')
      if (name) onDetectRestaurant?.(name)
    } catch {
      setGeoStatus('error')
      setDetected('No se pudo detectar la ubicación')
    }
  }

  return (
    <div className="screen">
      {/* Header */}
      <div className="header" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 20px' }}>
        <div className="stack gap-4">
          <div className="header-row">
            <Logo size={28} />
          </div>
          <span className="slogan">cada uno lo suyo, sin líos</span>
        </div>
        <BurgerButton onClick={onBurger} />
      </div>

      {/* Content */}
      <div className="stack gap-16 p-16" style={{ flex: 1, paddingTop: 24 }}>

        {/* Steps card */}
        <div className="card-dark stack gap-16">
          <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.65)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Cómo funciona
          </p>
          {STEPS.map(({ n, text }) => (
            <div key={n} className="row gap-12">
              <div style={{
                width: 32, height: 32, minWidth: 32, borderRadius: '50%',
                background: '#E8531A', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff'
              }}>
                {n}
              </div>
              <span style={{ fontSize: 15, color: '#F5F2EC', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Geo detect — pre-fill restaurant before scanning */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleGeoDetect}
            disabled={geoStatus === 'loading'}
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 10,
              padding: '8px 14px', fontSize: 13, color: 'var(--text-sec)',
              cursor: geoStatus === 'loading' ? 'default' : 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
              opacity: geoStatus === 'loading' ? 0.6 : 1,
            }}
          >
            {geoStatus === 'loading' ? (
              <>
                <div style={{ width: 12, height: 12, border: '1.5px solid var(--border)', borderTopColor: 'var(--text-sec)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
                Detectando...
              </>
            ) : '📍 Detectar restaurante'}
          </button>
          {geoStatus === 'done' && (
            <span style={{ fontSize: 13, color: 'var(--teal-dark)', fontWeight: 600 }}>
              ✓ {detectedName}
            </span>
          )}
          {geoStatus === 'error' && (
            <span style={{ fontSize: 12, color: 'var(--orange)' }}>{detectedName}</span>
          )}
        </div>

        {/* Primary CTA */}
        <button className="btn btn-primary" onClick={onScan} style={{ marginTop: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 14h2v2h-2zM18 14h2v2h-2zM16 16v2h2M14 18h2v2h-2zM18 18h2v2h-2z"/>
          </svg>
          Escanear ticket
        </button>

        <div className="separator">o si prefieres</div>

        <button className="btn btn-secondary" onClick={onManual}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2H2v20h20V10L12 2z"/><polyline points="12 2 12 10 20 10"/>
          </svg>
          Introducir importe manualmente
        </button>

        <p className="text-sm text-sec" style={{ textAlign: 'center', marginTop: 'auto', paddingBottom: 24, paddingTop: 8 }}>
          Sin registro · Sin comisiones ocultas
        </p>
      </div>
    </div>
  )
}
