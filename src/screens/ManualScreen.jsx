import { useState } from 'react'
import { formatEur, smartRound } from '../utils/format'
import Logo            from '../components/Logo'
import PeopleSelector  from '../components/PeopleSelector'
import TipSelector     from '../components/TipSelector'
import { BurgerButton } from '../components/BurgerMenu'

export default function ManualScreen({ onContinue, onBack, onBurger }) {
  const [rawValue, setRawValue] = useState('')
  const [pax,      setPax]      = useState(2)
  const [tipMode,  setTipMode]  = useState('round')
  const [tipPct,   setTipPct]   = useState(8)

  // total bruto sin propina
  const total = parseFloat(rawValue.replace(',', '.')) || 0

  // ── Cálculo principal ─────────────────────────────────────
  const roundedTotal  = total > 0 ? smartRound(total) : 0
  const tipAmount     = total === 0 ? 0
    : tipMode === 'round' ? Math.max(0, roundedTotal - total)
    : total * tipPct / 100

  const basePerPerson = total > 0 ? total / pax : 0          // 100 / 4 = 25,00 €
  const tipPerPerson  = total > 0 ? tipAmount / pax : 0
  const perPerson     = basePerPerson + tipPerPerson
  // ──────────────────────────────────────────────────────────

  function handleInput(e) {
    const v = e.target.value
    if (/^[0-9]*[.,]?[0-9]{0,2}$/.test(v)) setRawValue(v)
  }

  function handleContinue() {
    if (total <= 0) return
    // Pasa el total BRUTO — ResultScreen aplica su propia propina
    onContinue({ nombre: 'Importe manual', total, pax })
  }

  return (
    <div className="screen">
      {/* Header */}
      <div className="header row-between" style={{ flexDirection: 'row', alignItems: 'center', padding: '16px 20px' }}>
        <div className="row gap-10">
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
        <BurgerButton onClick={onBurger} />
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
        {total > 0 && (
          <div className="card stack gap-12">
            <p style={{ fontWeight: 700, fontSize: 15 }}>Propina</p>
            <TipSelector
              total={total}
              pax={pax}
              mode={tipMode}
              onModeChange={setTipMode}
              selectedPct={tipPct}
              onPctChange={setTipPct}
            />
          </div>
        )}

        {/* Live result */}
        {total > 0 && (
          <div className="card-darkest stack gap-4">
            <p className="amount-label">cada persona paga</p>
            <p className="amount-big">{formatEur(perPerson)}</p>
            <p style={{ fontSize: 12, color: 'rgba(245,242,236,0.45)', marginTop: 4 }}>
              {formatEur(basePerPerson)} base + {formatEur(tipPerPerson)} propina
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
