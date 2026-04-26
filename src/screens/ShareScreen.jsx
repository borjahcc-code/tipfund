import { useState, useRef } from 'react'
import { formatEur } from '../utils/format'
import { getMealType, generateSessionId, buildMessage, logSend } from '../utils/sharing'

function BurgerBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2, borderRadius: 2, background: 'rgba(245,242,236,0.8)' }}/>)}
    </button>
  )
}

export default function ShareScreen({ payment, user, onDone, onSkip, onBurger }) {
  const { perPerson, pax = 2, restaurantName = '' } = payment
  const others = pax - 1

  const [manualName, setManualName] = useState('')
  const [sent,       setSent]       = useState({})
  const [sending,    setSending]    = useState(false)
  const sessionId = useRef(generateSessionId())
  const mealType  = useRef(getMealType())

  const isIdentified  = user && !user.is_anonymous
  const organizerName = isIdentified ? user.name : manualName.trim()
  const canSend       = organizerName.length > 0

  function sendTo(i) {
    const msg = buildMessage({
      organizerName,
      amount: perPerson,
      restaurantName,
      sessionId: sessionId.current,
      comensalIndex: i + 1,
      mealType: mealType.current,
    })
    logSend({ sessionId: sessionId.current, comensalIndex: i + 1, organizerName, amount: perPerson, restaurantName })
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    setSent(prev => ({ ...prev, [i]: true }))
  }

  function handleSendAll() {
    if (!canSend || sending) return
    setSending(true)
    Array.from({ length: others }, (_, i) => i).forEach(i => {
      setTimeout(() => {
        sendTo(i)
        if (i === others - 1) setSending(false)
      }, i * 500)
    })
  }

  const displayRestaurant = restaurantName || 'el restaurante'

  return (
    <div className="screen">
      {/* Header */}
      <div className="header row-between" style={{ flexDirection: 'row', alignItems: 'center', padding: '16px 20px' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--beige-light)' }}>Avisa a tu mesa</p>
          <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.55)', marginTop: 2 }}>
            {displayRestaurant} · {formatEur(perPerson)}/persona
          </p>
        </div>
        {onBurger && <BurgerBtn onClick={onBurger} />}
      </div>

      <div className="stack gap-12 p-16" style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>

        {/* Identity block */}
        {isIdentified ? (
          <div className="card row gap-10" style={{ alignItems: 'center' }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}/>
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#254D52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#C8C2B0', flexShrink: 0 }}>
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{user.name}</p>
              <p className="text-xs text-sec">Tu nombre en el mensaje</p>
            </div>
          </div>
        ) : (
          <div className="card stack gap-6">
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

        {/* Comensal list */}
        <div className="card stack gap-0" style={{ padding: 0, overflow: 'hidden' }}>
          {Array.from({ length: others }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                borderBottom: i < others - 1 ? '1px solid var(--border)' : 'none',
                background: sent[i] ? 'rgba(37,211,102,0.05)' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <div className="row gap-12">
                <div className="avatar" style={{ background: sent[i] ? '#25D366' : 'var(--teal-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {sent[i] ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : `C${i + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>Comensal {i + 1}</p>
                  <p className="text-xs text-sec">{formatEur(perPerson)}</p>
                </div>
                <div>
                  {sent[i] ? (
                    <span className="status-badge status-sent">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Enviado
                    </span>
                  ) : (
                    <button
                      onClick={() => sendTo(i)}
                      disabled={!canSend}
                      style={{
                        background: 'var(--orange)', color: '#fff', border: 'none',
                        borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600,
                        cursor: canSend ? 'pointer' : 'not-allowed',
                        opacity: canSend ? 1 : 0.4, fontFamily: 'inherit', whiteSpace: 'nowrap',
                        transition: 'opacity 0.15s',
                      }}
                    >
                      Enviar por WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!canSend && !isIdentified && (
          <p className="text-xs text-sec" style={{ textAlign: 'center', opacity: 0.7 }}>
            Introduce tu nombre para activar los botones
          </p>
        )}

        {/* Action buttons */}
        <div className="stack gap-8" style={{ marginTop: 'auto' }}>
          <button
            className="btn btn-primary"
            onClick={handleSendAll}
            disabled={!canSend || sending}
            style={{ opacity: canSend ? 1 : 0.4 }}
          >
            {sending ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
                Enviando...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Enviar a todos
              </>
            )}
          </button>
          <button className="btn btn-ghost" onClick={onSkip} style={{ marginTop: 4 }}>
            Saltar este paso
          </button>
        </div>

      </div>
    </div>
  )
}
