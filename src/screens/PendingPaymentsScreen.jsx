import { formatEur } from '../utils/format'

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function PendingPaymentsScreen({ data, onTogglePaid, onBack, onBurger }) {
  const allComensales = data.flatMap(d => d.comensales)
  const totalPending  = allComensales.filter(c => !c.pagado).reduce((s, c) => s + c.importe, 0)
  const totalPaid     = allComensales.filter(c =>  c.pagado).reduce((s, c) => s + c.importe, 0)
  const allDone       = allComensales.every(c => c.pagado)

  return (
    <div className="screen">
      {/* Header */}
      <div className="header" style={{ padding: '16px 20px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row gap-10">
          <button
            style={{ background: 'none', border: 'none', color: 'rgba(245,242,236,0.6)', cursor: 'pointer', padding: 4, display: 'flex' }}
            onClick={onBack}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--beige-light)' }}>Cobros pendientes</p>
            <p style={{ fontSize: 12, color: 'rgba(245,242,236,0.5)' }}>
              {allComensales.filter(c => !c.pagado).length} pendientes
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
        {allDone && (
          <div style={{
            background: 'var(--orange-bg)', border: '1.5px solid var(--orange)',
            borderRadius: 16, padding: '18px 16px', textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginBottom: 6 }}>
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            <p style={{ fontWeight: 800, fontSize: 18, color: 'var(--orange)' }}>¡Deuda saldada!</p>
            <p className="text-sm text-sec" style={{ marginTop: 4 }}>Todos han pagado</p>
          </div>
        )}

        {/* Resumen */}
        <div className="card stack gap-0" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '16px', borderRight: '1px solid var(--border)' }}>
              <p className="text-xs text-sec" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>
                Pendiente
              </p>
              <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--orange)' }}>
                {formatEur(totalPending)}
              </p>
            </div>
            <div style={{ padding: '16px' }}>
              <p className="text-xs text-sec" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>
                Cobrado
              </p>
              <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--teal-conf)' }}>
                {formatEur(totalPaid)}
              </p>
            </div>
          </div>
          {/* Barra de progreso */}
          <div style={{ height: 4, background: 'var(--border)' }}>
            <div style={{
              height: '100%',
              width: `${allComensales.length > 0 ? (allComensales.filter(c=>c.pagado).length / allComensales.length) * 100 : 0}%`,
              background: 'var(--teal-conf)',
              transition: 'width 0.4s ease'
            }}/>
          </div>
        </div>

        {/* Cenas */}
        {data.map(cena => {
          const cenaPaid    = cena.comensales.every(c => c.pagado)
          return (
            <div key={cena.id} className="stack gap-0">
              {/* Cabecera de cena */}
              <div className="row-between" style={{ marginBottom: 8, paddingLeft: 4 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{cena.restaurante}</p>
                  <p className="text-xs text-sec">{cena.fecha} · {formatEur(cena.totalCuenta)}</p>
                </div>
                {cenaPaid && (
                  <span className="badge badge-teal" style={{ fontSize: 11 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Saldado
                  </span>
                )}
              </div>

              {/* Comensales */}
              <div className="card stack gap-0" style={{ padding: 0, overflow: 'hidden' }}>
                {cena.comensales.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '13px 16px',
                      borderBottom: i < cena.comensales.length - 1 ? '1px solid var(--border)' : 'none',
                      background: c.pagado ? 'rgba(138,172,176,0.07)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div className="row gap-12">
                      <div className="avatar" style={{ background: c.pagado ? 'var(--teal-conf)' : 'var(--teal-mid)' }}>
                        {initials(c.nombre)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{c.nombre}</p>
                        <p className="text-xs text-sec">{c.telefono}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, fontSize: 14 }}>{formatEur(c.importe)}</p>
                        <span className={`status-badge ${c.pagado ? 'status-sent' : 'status-pending'}`} style={{ marginTop: 2, display: 'inline-flex' }}>
                          {c.pagado ? (
                            <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Pagado</>
                          ) : 'Pendiente'}
                        </span>
                      </div>
                      {!c.pagado ? (
                        <button
                          onClick={() => onTogglePaid(cena.id, c.id)}
                          style={{
                            background: 'var(--orange)', color: '#fff', border: 'none',
                            borderRadius: 10, padding: '7px 11px', fontSize: 11, fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0
                          }}
                        >
                          Cobrar
                        </button>
                      ) : (
                        <button
                          onClick={() => onTogglePaid(cena.id, c.id)}
                          title="Deshacer"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-sec)', padding: 4, flexShrink: 0, display: 'flex'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                            <path d="M3 3v5h5"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
