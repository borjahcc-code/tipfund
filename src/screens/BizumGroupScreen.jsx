import { useState } from 'react'
import { formatEur } from '../utils/format'

const NAMES = ['María G.', 'Carlos R.', 'Lucía M.', 'Pedro S.', 'Ana T.', 'Jorge L.', 'Sara V.', 'Tomás B.', 'Elena F.', 'David K.', 'Carmen N.']
const PHONES = ['+34 6** *** *21', '+34 6** *** *55', '+34 6** *** *83', '+34 6** *** *07', '+34 6** *** *44', '+34 6** *** *62', '+34 6** *** *19', '+34 6** *** *38', '+34 6** *** *76', '+34 6** *** *90']

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function BizumGroupScreen({ data, onDone, onSkip, onBurger }) {
  const others = data.pax - 1
  const names = NAMES.slice(0, others)
  const [statuses, setStatuses] = useState(names.map(() => 'pending'))
  const [sending, setSending] = useState(false)

  function handleSend() {
    setSending(true)
    names.forEach((_, i) => {
      setTimeout(() => {
        setStatuses(prev => {
          const next = [...prev]
          next[i] = 'sent'
          return next
        })
      }, 400 + i * 300)
    })
    setTimeout(() => {
      const comensales = names.map((nombre, i) => ({
        nombre,
        telefono: PHONES[i],
        importe: data.perPerson,
        pagado: false,
      }))
      onDone(comensales)
    }, 400 + (others - 1) * 300 + 800)
  }

  return (
    <div className="screen">
      {/* Banner */}
      <div className="banner-orange">
        🚧 FUNCIÓN EN DESARROLLO
      </div>

      {/* Header */}
      <div className="header row-between" style={{ padding: '14px 20px', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--beige-light)' }}>Solicitar Bizum al resto</p>
          <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.55)' }}>{others} personas · {formatEur(data.perPerson)} cada una</p>
        </div>
        {onBurger && (
          <button onClick={onBurger} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2, borderRadius: 2, background: 'rgba(245,242,236,0.8)' }}/>)}
          </button>
        )}
      </div>

      <div className="stack gap-12 p-16" style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>

        {/* Tu parte pagada */}
        <div className="card-darkest row gap-12">
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-conf)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--beige-light)' }}>Tu parte ya pagada</p>
            <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.55)' }}>{formatEur(data.perPerson)}</p>
          </div>
        </div>

        {/* Lista comensales */}
        <div className="card stack gap-0" style={{ padding: 0, overflow: 'hidden' }}>
          {names.map((name, i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: i < names.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="row gap-12">
                <div className="avatar">{initials(name)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{name}</p>
                  <p className="text-xs text-sec">{PHONES[i]}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{formatEur(data.perPerson)}</p>
                  <span className={`status-badge ${statuses[i] === 'sent' ? 'status-sent' : 'status-pending'}`}>
                    {statuses[i] === 'sent' ? (
                      <>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Enviado
                      </>
                    ) : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="stack gap-8" style={{ marginTop: 'auto' }}>
          <button
            className="btn btn-orange"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
                Enviando solicitudes...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Enviar solicitudes Bizum
              </>
            )}
          </button>
          <button className="btn btn-ghost" onClick={onSkip}>
            Saltar por ahora
          </button>
        </div>
      </div>
    </div>
  )
}
