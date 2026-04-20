import { formatEur, smartRound } from '../utils/format'

const PCT_OPTS = [0, 5, 8, 10]

/**
 * Controlled component — el padre mantiene mode y selectedPct.
 * Inicialización recomendada en el padre:
 *   const [tipMode, setTipMode] = useState('round')
 *   const [tipPct,  setTipPct]  = useState(8)
 */
export default function TipSelector({ total, pax, mode, onModeChange, selectedPct, onPctChange }) {
  const roundedTotal      = smartRound(total)
  const roundTipTotal     = Math.max(0, roundedTotal - total)
  const roundTipPerPerson = roundTipTotal / pax

  return (
    <div className="stack gap-10">

      {/* Toggle pill */}
      <div className="tip-toggle">
        <button
          className={`tip-toggle-btn${mode === 'round' ? ' active' : ''}`}
          onClick={() => onModeChange('round')}
        >
          Redondear
        </button>
        <button
          className={`tip-toggle-btn${mode === 'pct' ? ' active' : ''}`}
          onClick={() => onModeChange('pct')}
        >
          %
        </button>
      </div>

      {mode === 'round' ? (
        /* ── Panel redondeo ── */
        <div style={{
          background: 'var(--orange)', borderRadius: 14,
          padding: '16px', display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.2 }}>
              Redondear a {formatEur(roundedTotal)}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              Quedaos con el cambio
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>
              +{formatEur(roundTipPerPerson)}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>por persona</p>
          </div>
        </div>
      ) : (
        /* ── Panel porcentaje ── */
        <div className="tip-options" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {PCT_OPTS.map(pct => (
            <button
              key={pct}
              className={`tip-option${selectedPct === pct ? ' selected' : ''}`}
              onClick={() => onPctChange(pct)}
            >
              <div className="pct">{pct}%</div>
              <div className="eur">
                {pct === 0 ? '0,00 €' : formatEur(total * pct / 100 / pax)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
