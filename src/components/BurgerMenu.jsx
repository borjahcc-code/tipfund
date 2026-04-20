export function BurgerButton({ onClick, light = false }) {
  const color = light ? 'rgba(255,255,255,0.8)' : 'var(--beige-light)'
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 6, display: 'flex', flexDirection: 'column',
        gap: 4.5, alignItems: 'center', justifyContent: 'center'
      }}
      aria-label="Menú"
    >
      {[0,1,2].map(i => (
        <span key={i} style={{
          display: 'block', width: 20, height: 2,
          borderRadius: 2, background: color
        }}/>
      ))}
    </button>
  )
}

export default function BurgerMenu({ onClose, onNavigate, pendingCount = 0 }) {
  const items = [
    {
      id: 'home',
      label: 'Nueva cuenta',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'pending',
      label: 'Cobros pendientes',
      badge: pendingCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/>
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Historial de cenas',
      soon: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Ajustes',
      soon: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="burger-overlay" onClick={onClose}>
      {/* Backdrop */}
      <div className="burger-backdrop"/>

      {/* Panel */}
      <div className="burger-panel" onClick={e => e.stopPropagation()}>
        {/* Header del panel */}
        <div style={{
          background: 'var(--teal-dark)', padding: '24px 20px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 20, color: 'var(--beige-light)' }}>
              <span style={{ fontWeight: 300 }}>tip</span>Fund
            </p>
            <p style={{ fontSize: 12, color: 'var(--teal-conf)', marginTop: 2 }}>
              cada uno lo suyo, sin líos
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(245,242,236,0.5)', cursor: 'pointer', padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {items.map(item => (
            <button
              key={item.id}
              className="burger-item"
              onClick={() => {
                if (item.soon) return
                onClose()
                onNavigate(item.id)
              }}
              style={{ opacity: item.soon ? 0.5 : 1 }}
            >
              <span style={{ color: 'var(--teal-mid)' }}>{item.icon}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  background: 'var(--orange)', color: '#fff',
                  borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 700
                }}>{item.badge}</span>
              )}
              {item.soon && (
                <span style={{
                  background: '#e8e4dc', color: 'var(--text-sec)',
                  borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600
                }}>Próx.</span>
              )}
              {!item.soon && !item.badge && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <p className="text-xs text-sec" style={{ textAlign: 'center' }}>tipFund v1.0 · Sin comisiones</p>
        </div>
      </div>
    </div>
  )
}
