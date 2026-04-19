import { useEffect } from 'react'

const OCR_EXAMPLES = [
  { nombre: 'Bar Restaurante El Rincón', total: 74.80,  pax: 4 },
  { nombre: 'Taberna La Española',       total: 112.40, pax: 5 },
  { nombre: 'Cafetería Central',         total: 38.60,  pax: 2 },
  { nombre: 'Restaurante Mar y Tierra',  total: 186.20, pax: 6 },
]

export default function ProcessingScreen({ onDone }) {
  useEffect(() => {
    const result = OCR_EXAMPLES[Math.floor(Math.random() * OCR_EXAMPLES.length)]
    const t = setTimeout(() => onDone(result), 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="processing-screen">
      <div className="spinner"/>
      <div className="stack gap-8" style={{ alignItems: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--teal-dark)' }}>
          Leyendo el ticket
        </p>
        <p className="text-sm text-sec">Extrayendo importe y comensales...</p>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--orange)',
            animation: `dotPulse 1.2s ${i * 0.2}s ease-in-out infinite`,
            opacity: 0.3
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
