import { useState } from 'react'
import { formatEur, nextRound5, nextRound10 } from '../utils/format'
import Logo from '../components/Logo'
import PeopleSelector from '../components/PeopleSelector'

const PCT_OPTIONS = [
  { pct: 5,  label: '5%' },
  { pct: 8,  label: '8%' },
  { pct: 10, label: '10%' },
]

export default function ManualScreen({ onContinue, onBack }) {
  const [rawValue, setRawValue] = useState('')
  const [pax,      setPax]      = useState(2)
  // tipPct: number (5/8/10) or null (= redondear)
  const [tipPct,   setTipPct]   = useState(8)

  // total: importe bruto sin propina
  const total = parseFloat(rawValue.replace(',', '.')) || 0

  const round5  = total > 0 ? nextRound5(total)  : 0
  const round10 = total > 0 ? nextRound10(total) : 0

  const tipAmount    = total === 0 ? 0
    : tipPct === null ? Math.max(0, round5 - total)
    : total * tipPct / 100
  const perPerson    = total > 0 ? (total + tipAmount) / pax : 0
  const tipPerPerson = total > 0 ? tipAmount / pax : 0

  function handleInput(e) {
    const v = e.target.value
    if (/^[0-9]*[.,]?[0-9]{0,2}$/.test(v)) setRawValue(v)
  }

  function handleContinue() {
    if (total <= 0) return
    // Pasamos el total BRUTO — ResultScreen aplica su propia propina
    onContinue({ nombre: 'Importe manual', total, pax })
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

      <div className="stack gap-16 p-16" style={{ flex: 1, paddingTop: 24, overflowY: 'auto', paddingBottom: 32 }}>

        {/* Amount input */}
        <div className="card stack gap-12" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-sec)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total de la cuenta
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
          <PeopleSelector value={pax} onChange={setPax} />
        </div>

        {/* Propina */}
        <div className="card stack gap-12">
          <div className="row-between">
            <p style={{ fontWeight: 700, fontSize: 15 }}>Propina</p>
            <p className="text-xs text-sec">por persona</p>
          </div>

          <div className="tip-options">
            {/* Redondear */}
            <button
              className={`tip-option tip-option-round${tipPct === null ? ' selected' : ''}`}
              onClick={() => setTipPct(null)}
            >
              <div className="row gap-8" style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div className="row gap-6" style={{ alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <span className="pct">Redondear</span>
                </div>
                <span className="eur" style={{ fontSize: 11 }}>
                  {total > 0
                    ? `→ ${formatEur(round5).replace(' €', '')} o ${formatEur(round10).replace(' €', '')} €`
                    : '→ —'}
                </span>
              </div>
              <div className="eur" style={{ marginTop: 4, textAlign: 'left' }}>
                {total > 0 ? `${formatEur(Math.max(0, round5 - total) / pax)} por persona` : '—'}
              </div>
            </button>

            {/* Opciones porcentaje */}
            {PCT_OPTIONS.map(opt => (
              <button
                key={opt.pct}
                className={`tip-option${tipPct === opt.pct ? ' selected' : ''}`}
                onClick={() => setTipPct(opt.pct)}
              >
                <div className="pct">{opt.label}</div>
                <div className="eur">
                  {total > 0 ? formatEur(total * opt.pct / 100 / pax) : '—'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live result */}
        {total > 0 && (
          <div className="card-darkest stack gap-4">
            <p className="amount-label">cada persona paga</p>
            <p className="amount-big">{formatEur(perPerson)}</p>
            <p style={{ fontSize: 12, color: 'rgba(245,242,236,0.45)', marginTop: 4 }}>
              {formatEur(total / pax)} base + {formatEur(tipPerPerson)} propina
            </p>
          </div>
        )}

        {/* Total a pagar */}
        {total > 0 && (
          <div className="card row-between" style={{ padding: '14px 16px' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Total a pagar</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange)' }}>{formatEur(perPerson)}</span>
          </div>
        )}

        {/* CTA */}
        <button
          className="btn btn-orange"
          onClick={handleContinue}
          disabled={total <= 0}
          style={{ opacity: total > 0 ? 1 : 0.4, marginTop: 8 }}
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
