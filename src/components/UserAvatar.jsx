import { useState } from 'react'

function initials(name) {
  return (name || 'TÚ').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function UserAvatar({ user, onLogin, onLogout }) {
  const [open, setOpen] = useState(false)

  if (!user) return null

  const hasPhoto = !user.is_anonymous && user.avatar_url

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Cuenta"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
      >
        {hasPhoto ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(245,242,236,0.3)' }}
          />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#254D52', border: '1.5px solid rgba(245,242,236,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: '#C8C2B0', letterSpacing: 0.5,
          }}>
            {initials(user.name)}
          </div>
        )}
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute', top: 36, right: 0, zIndex: 50,
            background: 'var(--beige-light)', borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid var(--border)',
            padding: '14px 16px', minWidth: 220,
          }}>
            <div className="stack gap-10">
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--teal-dark)' }}>{user.name}</p>
                {user.email && (
                  <p style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 2 }}>{user.email}</p>
                )}
                {user.is_anonymous && (
                  <p style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 2 }}>Modo anónimo</p>
                )}
              </div>

              <div style={{ height: 1, background: 'var(--border)' }}/>

              {user.is_anonymous ? (
                <button
                  onClick={() => { setOpen(false); onLogin?.() }}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    background: 'var(--teal-dark)', color: '#F5F2EC', border: 'none',
                    display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.5 8.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    <path d="M3 20a9 9 0 0 1 18 0"/>
                  </svg>
                  Identificarte con Google
                </button>
              ) : (
                <button
                  onClick={() => { setOpen(false); onLogout?.() }}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    background: 'transparent', color: 'var(--text-sec)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
