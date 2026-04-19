export default function ScannerScreen({ onCapture, onCancel }) {
  return (
    <div className="scanner-screen">
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Cámara
        </p>
        <p style={{ fontSize: 18, fontWeight: 600 }}>Encuadra el ticket completo</p>
      </div>

      {/* Scan frame */}
      <div className="scan-frame">
        <div className="scan-inner"/>
        <div className="scan-line"/>
        <div className="corner tl"/>
        <div className="corner tr"/>
        <div className="corner bl"/>
        <div className="corner br"/>

        {/* Ticket icon hint */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 8
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>ticket aquí</span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textAlign: 'center', maxWidth: 220 }}>
        Asegúrate de que el total sea visible
      </p>

      {/* Actions */}
      <div className="stack gap-12" style={{ width: '100%' }}>
        <button className="btn btn-orange" onClick={onCapture}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M20 12V8a2 2 0 0 0-2-2h-2l-1.5-2h-5L8 6H6a2 2 0 0 0-2 2v4"/>
            <path d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
          </svg>
          Capturar ticket
        </button>
        <button
          className="btn"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)' }}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
