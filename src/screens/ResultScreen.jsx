import { useState } from 'react'
import { formatEur, smartRound } from '../utils/format'
import PeopleSelector from '../components/PeopleSelector'
import TipSelector    from '../components/TipSelector'
import { BurgerButton } from '../components/BurgerMenu'

export default function ResultScreen({ ocr, onPay, onGroup, onBurger }) {
  const [total,   setTotal]   = useState(ocr.total)
  const [pax,     setPax]     = useState(ocr.pax)
  const [tipMode, setTipMode] = useState('round')
  const [tipPct,  setTipPct]  = useState(8)
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(String(ocr.total))

  // ── Cálculo principal ─────────────────────────────────────
  const roundedTotal = smartRound(total)
  const tipAmount    = tipMode === 'round'
    ? Math.max(0, roundedTotal - total)
    : total * tipPct / 100

  const basePerPerson = total / pax                  // 100 / 4 = 25,00 €
  const tipPerPerson  = tipAmount / pax
  const perPerson     = basePerPerson + tipPerPerson  // total a pagar por persona
  // ──────────────────────────────────────────────────────────

  function saveEdit() {
    const v = parseFloat(editVal.replace(',', '.'))
    if (!isNaN(v) && v > 0) {
      setTotal(v)
      setEditVal(v.toFixed(2).replace('.', ','))
    }
    setEditing(false)
  }

  return (
    <div className="screen">
      {/* Header */}
      <div className="header row-between" style={{ flexDirection: 'row', alignItems: 'center', padding: '16px 20px' }}>
        <span className="badge badge-orange">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          OCR listo
        </span>
        <div className="row gap-8">
          <span style={{ fontSize: 13, color: 'rgba(245,242,236,0.6)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ocr.nombre}
          </span>
          <BurgerButton onClick={onBurger} />
        </div>
      </div>

      <div className="stack gap-12 p-16" style={{ flex: 1, overflowY: 'auto', paddingBottom: 32 }}>

        {/* Total detectado */}
        <div className="card stack gap-8">
          <div className="row-between">
            <div className="stack gap-4">
              <span className="text-xs text-sec" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Importe total
              </span>
              {editing ? (
                <div className="row gap-8">
                  <input
                    type="text"
                    inputMode="decimal"
                    className="input-amount"
                    style={{ fontSize: 28, textAlign: 'left', flex: 1 }}
                    value={editVal}
                    onChange={e => {
                      const v = e.target.value
                      if (/^[0-9]*[.,]?[0-9]{0,2}$/.test(v)) setEditVal(v)
                    }}
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    onBlur={saveEdit}
                  />
                  <button
                    className="btn btn-orange"
                    style={{ width: 'auto', padding: '8px 14px', fontSize: 14 }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={saveEdit}
                  >
                    OK
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--teal-dark)' }}>
                  {formatEur(total)}
                </span>
              )}
            </div>
            {!editing && (
              <button
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: 'var(--text-sec)', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                onClick={() => { setEditVal(String(total).replace('.', ',')); setEditing(true) }}
              >
                Modificar importe
              </button>
            )}
          </div>
          <p className="text-xs text-sec">{ocr.nombre}</p>
        </div>

        {/* Personas */}
        <div className="card">
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>¿Cuántos sois?</p>
            <p className="text-xs text-sec">Incluida tu parte</p>
          </div>
          <PeopleSelector value={pax} onChange={setPax} />
        </div>

        {/* Resultado por persona */}
        <div className="card-darkest stack gap-4">
          <p className="amount-label">cada persona paga</p>
          <p className="amount-big">{formatEur(perPerson)}</p>
          <p style={{ fontSize: 12, color: 'rgba(245,242,236,0.45)', marginTop: 4 }}>
            {formatEur(basePerPerson)} base + {formatEur(tipPerPerson)} propina
          </p>
        </div>

        {/* Propina */}
        <div className="card stack gap-12">
          <div className="row-between">
            <p style={{ fontWeight: 700, fontSize: 15 }}>Propina</p>
          </div>
          <TipSelector
            total={total}
            pax={pax}
            mode={tipMode}
            onModeChange={setTipMode}
            selectedPct={tipPct}
            onPctChange={setTipPct}
          />
        </div>

        {/* Total a pagar */}
        <div className="card row-between" style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Total a pagar</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange)' }}>{formatEur(perPerson)}</span>
        </div>

        {/* Botones de pago */}
        <div className="stack gap-8">

          {/* Bizum */}
          <button className="pay-btn pay-btn-bizum" onClick={() => onPay({ perPerson, tipPerPerson, method: 'bizum' })}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: '#5CB85C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 15, color: '#fff', fontStyle: 'italic', flexShrink: 0
            }}>Bz</div>
            <div className="pay-btn-info">
              <div className="row gap-8" style={{ alignItems: 'center' }}>
                <span className="pay-btn-name" style={{ color: '#F5F2EC' }}>Pagar con Bizum</span>
                <span className="badge badge-teal" style={{ fontSize: 10 }}>Recomendado</span>
              </div>
              <p className="pay-btn-sub" style={{ color: 'rgba(245,242,236,0.5)' }}>Rápido y sin comisiones</p>
            </div>
            <span className="pay-btn-amount" style={{ color: '#F5F2EC', whiteSpace: 'nowrap' }}>{formatEur(perPerson)}</span>
          </button>

          {/* Tarjeta */}
          <button className="pay-btn pay-btn-card" onClick={() => onPay({ perPerson, tipPerPerson, method: 'card' })}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: 'var(--beige)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              border: '1px solid var(--border)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div className="pay-btn-info">
              <p className="pay-btn-name" style={{ color: 'var(--teal-dark)' }}>Pagar con tarjeta</p>
              <p className="pay-btn-sub text-sec">Visa · Mastercard · Apple Pay</p>
            </div>
            <span className="pay-btn-amount" style={{ color: 'var(--teal-dark)', whiteSpace: 'nowrap' }}>{formatEur(perPerson)}</span>
          </button>

          {/* Grupo Bizum */}
          <button className="pay-btn pay-btn-group" onClick={() => onGroup({ perPerson, tipPerPerson, pax })}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: 'var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-sec)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="pay-btn-info">
              <div className="row gap-8" style={{ alignItems: 'center' }}>
                <span className="pay-btn-name" style={{ color: 'var(--text-sec)' }}>Pedir Bizum al resto</span>
                <span className="badge badge-soon" style={{ fontSize: 10 }}>Beta</span>
              </div>
              <p className="pay-btn-sub text-sec">Solicita a cada comensal</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
