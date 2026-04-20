import { useState, useMemo } from 'react'
import { formatEur } from '../utils/format'

const NAMES = ['María G.', 'Carlos R.', 'Lucía M.', 'Pedro S.', 'Ana T.', 'Jorge L.', 'Sara V.', 'Tomás B.', 'Elena F.', 'David K.', 'Carmen N.', 'Iván M.', 'Nuria S.', 'Pablo F.', 'Marta L.', 'Raúl C.', 'Sofía R.', 'Álvaro T.', 'Claudia V.']

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function BizumTrackingScreen({ payment, onBack, onBurger }) {
  const others = (payment.pax || 2) - 1

  const diners = useMemo(() =>
    NAMES.slice(0, others).map(name => ({ name, paid: false })),
  [others])

  const [statuses, setStatuses] = useState(() => diners.map(() => false))

  function toggle(i) {
    setStatuses(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const paidCount    = statuses.filter(Boolean).length
  const pendingCount = others - paidCount
  const totalPending = pendingCount * payment.perPerson
  const totalPaid    = paidCount * payment.perPerson
  const allPaid      = paidCount === others

  return (
    <div className="screen">
      {/* Header */}
      <div className="header row-between" style={{ padding: '16px 20px', flexDirection: 'row', alignItems: 'center' }}>
        <div className="row gap-12" style={{ alignItems: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', color: 'rgba(245,242,236,0.6)', cursor: 'pointer', padding: 4, display: 'flex' }}
            onClick={onBack}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--beige-light)' }}>Seguimiento de pagos</p>
            <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.55)' }}>
              {paidCount} de {others} pagados
            </p>
          </div>
        </div>
        {onBurger && (
          <button onClick={onBurger} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2, borderRadius: 2, background: 'rgba(245,242,236,0.8)' }}/>)}
          </button>
        )}
      </div>

      <div className="stack gap-12 p-16" style={{ flex: 1, overflowY: 'auto', paddingBottom: 32 }}>

        {/* ¡Deuda saldada! */}
        {allPaid && (
          <div style={{
            background: 'var(--orange-bg)', border: '1.5px solid var(--orange)',
            borderRadius: 16, padding: '18px 16px', textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <p style={{ fontWeight: 800, fontSize: 18, color: 'var(--orange)' }}>¡Deuda saldada!</p>
            <p className="text-sm text-sec" style={{ marginTop: 4 }}>Todos han pagado su parte</p>
          </div>
        )}

        {/* Resumen */}
        <div className="card stack gap-0" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sec)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Resumen
            </p>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <div className="row gap-8">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)' }}/>
                <span className="text-sm text-sec">Pendiente ({pendingCount})</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-main)' }}>
                {formatEur(totalPending)}
              </span>
            </div>
            <div className="row-between">
              <div className="row gap-8">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal-conf)' }}/>
                <span className="text-sm text-sec">Cobrado ({paidCount})</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--teal-conf)' }}>
                {formatEur(totalPaid)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--border)' }}>
            <div style={{
              height: '100%',
              width: `${others > 0 ? (paidCount / others) * 100 : 0}%`,
              background: 'var(--teal-conf)',
              transition: 'width 0.4s ease'
            }}/>
          </div>
        </div>

        {/* Lista de comensales */}
        <div className="card stack gap-0" style={{ padding: 0, overflow: 'hidden' }}>
          {diners.map((diner, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                borderBottom: i < diners.length - 1 ? '1px solid var(--border)' : 'none',
                background: statuses[i] ? 'rgba(138,172,176,0.08)' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <div className="row gap-12">
                {/* Avatar */}
                <div className="avatar" style={{ background: statuses[i] ? 'var(--teal-conf)' : 'var(--teal-mid)' }}>
                  {initials(diner.name)}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{diner.name}</p>
                  <p className="text-xs text-sec">{formatEur(payment.perPerson)}</p>
                </div>

                {/* Action */}
                {statuses[i] ? (
                  <div className="row gap-6">
                    <span className="status-badge status-sent">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Pagado
                    </span>
                    <button
                      onClick={() => toggle(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-sec)', padding: '4px', display: 'flex', borderRadius: 6 }}
                      title="Deshacer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggle(i)}
                    style={{
                      background: 'var(--orange)', color: '#fff', border: 'none',
                      borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                      transition: 'opacity 0.15s, transform 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Marcar pagado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tu parte (pagada) */}
        <div className="card-darkest row gap-12">
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-conf)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--beige-light)' }}>Tu parte ya está pagada</p>
            <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.55)' }}>{formatEur(payment.perPerson)}</p>
          </div>
        </div>

      </div>
    </div>
  )
}
