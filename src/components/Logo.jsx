export default function Logo({ size = 28 }) {
  const scale = size / 28
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={Math.round(28 * scale)}
        height={Math.round(36 * scale)}
        viewBox="0 0 28 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cuerpo datáfono */}
        <rect x="2" y="1" width="24" height="34" rx="4" stroke="#F5F2EC" strokeWidth="1.8" fill="none"/>
        {/* Pantalla */}
        <rect x="5" y="4" width="18" height="11" rx="2" fill="#8AACB0"/>
        {/* Teclado 2x3 */}
        <circle cx="9"  cy="22" r="1.8" fill="#F5F2EC"/>
        <circle cx="14" cy="22" r="1.8" fill="#F5F2EC"/>
        <circle cx="19" cy="22" r="1.8" fill="#F5F2EC"/>
        <circle cx="9"  cy="28" r="1.8" fill="#F5F2EC"/>
        <circle cx="14" cy="28" r="1.8" fill="#F5F2EC"/>
        {/* Punto inferior derecho naranja */}
        <circle cx="19" cy="28" r="1.8" fill="#E8531A"/>
      </svg>
      <span className="logo-text">
        <span className="tip">tip</span><span className="fund">Fund</span>
      </span>
    </div>
  )
}
