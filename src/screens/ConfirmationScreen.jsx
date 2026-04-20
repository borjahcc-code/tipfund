import { useState } from 'react'
import { formatEur } from '../utils/format'
import { BurgerButton } from '../components/BurgerMenu'

export default function ConfirmationScreen({ payment, onHome, onTracking, onBurger }) {
  const [installing, setInstalling] = useState(false)
  const [installed,  setInstalled]  = useState(false)

  function handleInstall() {
    setInstalling(true)
    setTimeout(() => { setInstalling(false); setInstalled(true) }, 1500)
  }

  return (
    <div className="screen" style={{ alignItems: 'center', padding: '32px 20px 24px', gap: 0 }}>

      {/* Burger */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <BurgerButton onClick={onBurger} light={false} />
      </div>

      {/* Animated check */}
      <div style={{ marginBottom: 20, marginTop: 20 }}>
        <svg className="check-circle" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36"/>
          <path d="M24 40 L35 51 L56 28"/>
        </svg>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal-dark)', marginBottom: 6 }}>
        ¡Pagado!
      </h1>
      <p className="text-sm text-sec" style={{ marginBottom: 28 }}>
        Tu pago se ha procesado correctamente
      </p>

      {/* Amounts */}
      <div className="card stack gap-12" style={{ width: '100%', marginBottom: 12 }}>
        <div className="row-between">
          <span className="text-sm text-sec">Tu parte</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--teal-dark)' }}>
            {formatEur(payment.perPerson - payment.tipPerPerson)}
          </span>
        </div>
        <div className="divider"/>
        <div className="row-between">
          <span className="text-sm text-sec">Propina enviada</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--teal-conf)' }}>
            {formatEur(payment.tipPerPerson)}
          </span>
        </div>
        <div className="divider"/>
        <div className="row-between">
          <span style={{ fontWeight: 700, fontSize: 15 }}>Total pagado</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--orange)' }}>
            {formatEur(payment.perPerson)}
          </span>
        </div>
      </div>

      {/* PWA install card */}
      {!installed ? (
        <div className="card-dark stack gap-10" style={{ width: '100%', marginBottom: 12 }}>
          <div className="row gap-8">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal-conf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9l-7-7z"/><path d="M13 2v7h7"/>
            </svg>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--beige-light)' }}>
              ¿La próxima vez en 5 segundos?
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(245,242,236,0.55)' }}>
            Añade tipFund a tu pantalla de inicio para abrirla al instante
          </p>
          <button
            className="btn"
            style={{ background: 'var(--orange)', color: '#fff', padding: '12px', fontSize: 14 }}
            onClick={handleInstall}
            disabled={installing}
          >
            {installing ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
                Añadiendo...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
                Añadir a inicio
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="card stack gap-8" style={{ width: '100%', marginBottom: 12, textAlign: 'center' }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <p style={{ fontWeight: 700, color: 'var(--teal-dark)' }}>¡Añadida a tu inicio!</p>
          <p className="text-xs text-sec">Ya puedes abrir tipFund directamente</p>
        </div>
      )}

      {payment?.pax && onTracking && (
        <button
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: 10 }}
          onClick={onTracking}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Ver seguimiento de pagos
        </button>
      )}

      <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onHome}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Nueva cuenta
      </button>
    </div>
  )
}
