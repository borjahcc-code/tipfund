import { useState } from 'react'
import { detectNearbyRestaurants, getPlacesApiKey } from '../utils/places'

export default function RestaurantDetector({ currentName, onSelect }) {
  const [status,  setStatus]  = useState('idle') // idle | loading | list | error
  const [options, setOptions] = useState([])
  const [errMsg,  setErrMsg]  = useState('')

  async function handleDetect() {
    if (!getPlacesApiKey()) {
      setErrMsg('API key de Places no configurada. Añádela en Ajustes.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrMsg('')
    try {
      const places = await detectNearbyRestaurants()
      if (places.length === 0) {
        setErrMsg('No se encontraron restaurantes en 100 m')
        setStatus('error')
      } else if (places.length === 1) {
        onSelect(places[0])
        setStatus('idle')
      } else {
        setOptions(places)
        setStatus('list')
      }
    } catch (err) {
      if (err.code === 1) setErrMsg('Permiso de ubicación denegado')
      else if (err.message === 'NO_API_KEY') setErrMsg('API key de Places no configurada')
      else setErrMsg('No se pudo detectar la ubicación')
      setStatus('error')
    }
  }

  return (
    <div className="stack gap-6">
      <div className="row gap-8" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 13, color: 'var(--text-sec)', flex: 1, minWidth: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {currentName || 'Restaurante desconocido'}
        </span>
        <button
          onClick={handleDetect}
          disabled={status === 'loading'}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 8,
            padding: '5px 10px', fontSize: 12, color: 'var(--text-sec)',
            cursor: status === 'loading' ? 'default' : 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 4,
            opacity: status === 'loading' ? 0.6 : 1, flexShrink: 0,
            transition: 'opacity 0.15s',
          }}
        >
          {status === 'loading' ? (
            <>
              <div style={{ width: 10, height: 10, border: '1.5px solid var(--border)', borderTopColor: 'var(--text-sec)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
              Detectando...
            </>
          ) : '📍 Detectar restaurante'}
        </button>
      </div>

      {status === 'error' && (
        <p style={{ fontSize: 11, color: 'var(--orange)' }}>{errMsg}</p>
      )}

      {status === 'list' && (
        <div className="stack gap-6">
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Cerca de ti
          </p>
          {options.map((name, i) => (
            <button
              key={i}
              onClick={() => { onSelect(name); setStatus('idle') }}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                border: '1.5px solid var(--border)', background: 'var(--beige-light)',
                fontSize: 13, fontWeight: 600, color: 'var(--teal-dark)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {name}
            </button>
          ))}
          <button
            onClick={() => setStatus('idle')}
            style={{ fontSize: 12, color: 'var(--text-sec)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: 'inherit' }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
