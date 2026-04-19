import { useState } from 'react'
import { formatEur } from '../utils/format'
import Logo from '../components/Logo'

export default function ManualScreen({ onContinue, onBack }) {
  const [rawValue, setRawValue] = useState('')
  const [pax, setPax] = useState(2)

  const total = parseFloat(rawValue.replace(',', '.')) || 0
  const perPerson = total > 0 ? total / pax : 0

  function handleInput(e) {
    const v = e.target.value
    if (/^[0-9]*[.,]?[0-9]{0,2}$/.test(v)) setRawValue(v)
  }

  function handleContinue() {
    if (total <= 0) return
    onContinue({
      nombre: 'Importe manual',
      total,
      pax,
    })
  }

  return (
    <div className="screen">
      {/* Header */}
      <div className="header row" style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
        <button
          style={{ background: 'none', border: 'none', color: 'rgba(245,242,236,0.6)', cursor: 'pointer', padding: 4, display: 'flex' }}
          onClick={onBack}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <Logo size={22} />
      </div>

      <div className="stack gap-20 p-16" style={{ flex: 1, paddingTop: 28 }}>
        {/* Amount input */}
        <div className="card stack gap-12" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-sec)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total de la cuenta
          </p>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <input
              type="text"
              inputMode="decimal"
              className="input-amount"
              value={rawValue}
              onChange={handleInput}
              placeholder="0,00"
              style={{ maxWidth: 200 }}
            />
            <span style={{ fontSize: 32, fontWeight: 700, color: total > 0 ? 'var(--teal-dark)' : 'var(--border)' }}>€</span>
          </div>
          <p className="text-xs text-sec">Introduce el total del ticket</p>
        </div>

        {/* Personas */}
        <div className="card">
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>¿Cuántos sois?</p>
          </div>
          <div className="people-selector">
            <button className="btn-circle" onClick={() => setPax(p => Math.max(2, p - 1))} disabled={pax <= 2}>−</button>
            <div style={{ textAlign: 'center' }}>
              <div className="people-count">{pax}</div>
              <div className="people-label">personas</div>
            </div>
            <button className="btn-circle" onClick={() => setPax(p => Math.min(12, p + 1))} disabled={pax >= 12}>+</button>
          </div>
        </div>

        {/* Live result */}
        {total > 0 && (
          <div className="card-darkest stack gap-4">
            <p className="amount-label">cada persona paga</p>
            <p className="amount-big">{formatEur(perPerson)}</p>
            <p style={{ fontSize: 12, color: 'rgba(245,242,236,0.45)', marginTop: 4 }}>
              sin propina · puedes añadirla en el siguiente paso
            </p>
          </div>
        )}

        {/* CTA */}
        <button
          className="btn btn-orange"
          onClick={handleContinue}
          disabled={total <= 0}
          style={{ opacity: total > 0 ? 1 : 0.4, marginTop: 'auto' }}
        >
          Continuar
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
