import { useState, useRef } from 'react'
import { getMealType, generateSessionId, buildMessage, logSend } from '../utils/sharing'

export default function ShareSection({ pax, perPerson, restaurantName, user }) {
  const [manualName, setManualName] = useState('')
  const [sent,       setSent]       = useState({})
  const sessionId = useRef(generateSessionId())

  if (!pax || pax < 2) return null

  const isIdentified  = user && !user.is_anonymous
  const organizerName = isIdentified ? user.name : manualName.trim()
  const canSend       = organizerName.length > 0
  const others        = pax - 1
  const mealType      = getMealType()

  function handleSend(i) {
    const msg = buildMessage({
      organizerName,
      amount: perPerson,
      restaurantName,
      sessionId: sessionId.current,
      comensalIndex: i + 1,
      mealType,
    })
    logSend({
      sessionId: sessionId.current,
      comensalIndex: i + 1,
      organizerName,
      amount: perPerson,
      restaurantName,
    })
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    setSent(prev => ({ ...prev, [i]: true }))
  }

  return (
    <div className="card stack gap-12" style={{ marginTop: 4 }}>
      {/* Section header */}
      <div className="row gap-8" style={{ alignItems: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.561 4.14 1.542 5.876L0 24l6.295-1.652A11.937 11.937 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.374l-.359-.213-3.732.979.997-3.646-.234-.374A9.78 9.78 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Compartir con la mesa</p>
          <p className="text-xs text-sec">Envía a cada comensal por WhatsApp</p>
        </div>
      </div>

      {/* Organizer — auto-filled if identified, manual input if anonymous */}
      {isIdentified ? (
        <div className="row gap-8" style={{ alignItems: 'center', background: 'rgba(138,172,176,0.08)', borderRadius: 10, padding: '8px 12px' }}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}/>
          ) : (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#254D52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#C8C2B0' }}>
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-dark)' }}>{user.name}</p>
            <p className="text-xs text-sec">Tu nombre en el mensaje</p>
          </div>
        </div>
      ) : (
        <div className="stack gap-6">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Tu nombre
          </label>
          <input
            type="text"
            placeholder="¿Cómo te llamas?"
            maxLength={20}
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 12px', borderRadius: 10, fontSize: 14,
              border: '1.5px solid var(--border)', background: 'var(--beige-light)',
              color: 'var(--teal-dark)', fontFamily: 'inherit', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--teal-mid)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      )}

      {/* Per-comensal buttons */}
      <div className="stack gap-8">
        {Array.from({ length: others }, (_, i) => (
          <div key={i} className="row-between" style={{ alignItems: 'center' }}>
            <div className="row gap-10" style={{ alignItems: 'center' }}>
              <div className="avatar" style={{
                background: sent[i] ? '#25D366' : 'var(--teal-mid)',
                fontSize: 11, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {sent[i] ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : `C${i + 1}`}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13 }}>Comensal {i + 1}</p>
                {sent[i] && <p className="text-xs" style={{ color: '#25D366' }}>Enviado</p>}
              </div>
            </div>
            <button
              onClick={() => handleSend(i)}
              disabled={!canSend}
              style={{
                background: sent[i] ? 'rgba(37,211,102,0.12)' : '#25D366',
                color: sent[i] ? '#25D366' : '#fff',
                border: sent[i] ? '1.5px solid #25D366' : 'none',
                borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600,
                cursor: canSend ? 'pointer' : 'not-allowed',
                opacity: canSend ? 1 : 0.4,
                fontFamily: 'inherit', whiteSpace: 'nowrap',
                transition: 'opacity 0.15s',
              }}
            >
              {sent[i] ? 'Reenviar' : 'Enviar'}
            </button>
          </div>
        ))}
      </div>

      {!canSend && !isIdentified && (
        <p className="text-xs text-sec" style={{ textAlign: 'center', opacity: 0.7 }}>
          Introduce tu nombre para activar los botones
        </p>
      )}
    </div>
  )
}
