import { useState, useEffect } from 'react'
import HomeScreen            from './screens/HomeScreen'
import ScannerScreen         from './screens/ScannerScreen'
import ProcessingScreen      from './screens/ProcessingScreen'
import ResultScreen          from './screens/ResultScreen'
import ManualScreen          from './screens/ManualScreen'
import ConfirmationScreen    from './screens/ConfirmationScreen'
import BizumGroupScreen      from './screens/BizumGroupScreen'
import BizumTrackingScreen   from './screens/BizumTrackingScreen'
import PendingPaymentsScreen from './screens/PendingPaymentsScreen'
import ShareScreen           from './screens/ShareScreen'
import BurgerMenu            from './components/BurgerMenu'
import UserAvatar            from './components/UserAvatar'
import { getUser, handleGoogleCredential, createAnonymousUser, logout } from './utils/auth'

// ── Datos de ejemplo precargados ─────────────────────────────
const INITIAL_PENDING = [
  {
    id: 1,
    fecha: '18 abr 2026',
    restaurante: 'Bar Restaurante El Rincón',
    totalCuenta: 74.80,
    comensales: [
      { id: 1, nombre: 'Carlos R.',  telefono: '+34 6** *** *55', importe: 18.70, pagado: false },
      { id: 2, nombre: 'Lucía M.',   telefono: '+34 6** *** *83', importe: 18.70, pagado: true  },
    ],
  },
  {
    id: 2,
    fecha: '15 abr 2026',
    restaurante: 'Taberna La Española',
    totalCuenta: 112.40,
    comensales: [
      { id: 3, nombre: 'Ana T.',   telefono: '+34 6** *** *44', importe: 22.48, pagado: false },
      { id: 4, nombre: 'Jorge L.', telefono: '+34 6** *** *62', importe: 22.48, pagado: false },
      { id: 5, nombre: 'Pedro S.', telefono: '+34 6** *** *07', importe: 22.48, pagado: false },
    ],
  },
]

export default function App() {
  const [screen,    setScreen]    = useState('home')
  const [ocr,       setOcr]       = useState(null)
  const [payment,   setPayment]   = useState(null)
  const [groupData, setGroupData] = useState(null)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [pending,   setPending]   = useState(INITIAL_PENDING)
  const [user,      setUser]      = useState(() => getUser() || createAnonymousUser())
  // Pre-detected restaurant from HomeScreen geo detection
  const [detectedRestaurant, setDetectedRestaurant] = useState(null)

  const pendingCount = pending.flatMap(d => d.comensales).filter(c => !c.pagado).length

  // Register global Google One Tap callback
  useEffect(() => {
    window.handleGoogleSignIn = (credentialResponse) => {
      const u = handleGoogleCredential(credentialResponse)
      if (u) setUser(u)
    }
    return () => { delete window.handleGoogleSignIn }
  }, [])

  function triggerGoogleLogin() {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
    }
  }

  function handleLogout() {
    logout()
    setUser(createAnonymousUser())
  }

  function goHome() {
    setScreen('home')
    setOcr(null)
    setPayment(null)
    setGroupData(null)
  }

  function handleMenuNavigate(id) {
    if (id === 'home')    { goHome(); return }
    if (id === 'pending') { setScreen('pending'); return }
  }

  function addPendingFromGroup(comensales) {
    const now    = new Date()
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
    const fecha  = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const restaurante = (ocr?.nombre === 'Importe manual' || !ocr?.nombre) ? 'Cuenta manual' : ocr.nombre
    const base = Date.now()
    setPending(prev => [{
      id: base,
      fecha,
      restaurante,
      totalCuenta: (groupData?.perPerson || 0) * (groupData?.pax || 1),
      comensales: comensales.map((c, i) => ({ ...c, id: base + i + 1 })),
    }, ...prev])
  }

  function togglePaid(cenaId, comenId) {
    setPending(prev => prev.map(cena =>
      cena.id !== cenaId ? cena : {
        ...cena,
        comensales: cena.comensales.map(c =>
          c.id !== comenId ? c : { ...c, pagado: !c.pagado }
        )
      }
    ))
  }

  const burger = () => setMenuOpen(true)

  function renderScreen() {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            onScan={()   => setScreen('scanner')}
            onManual={() => setScreen('manual')}
            onBurger={burger}
            onDetectRestaurant={setDetectedRestaurant}
          />
        )

      case 'scanner':
        return (
          <ScannerScreen
            onCapture={() => setScreen('processing')}
            onCancel={() => setScreen('home')}
            onBurger={burger}
          />
        )

      case 'processing':
        return (
          <ProcessingScreen
            onDone={result => { setOcr(result); setScreen('result') }}
          />
        )

      case 'manual':
        return (
          <ManualScreen
            onContinue={result => { setOcr(result); setScreen('result') }}
            onBack={() => setScreen('home')}
            onBurger={burger}
          />
        )

      case 'result':
        return (
          <ResultScreen
            key={`${ocr?.nombre}_${ocr?.total}_${ocr?.pax}`}
            ocr={ocr}
            user={user}
            detectedRestaurant={detectedRestaurant}
            onPay={p => { setPayment(p); setScreen('share') }}
            onGroup={d => { setGroupData(d); setPayment(d); setScreen('group') }}
            onBurger={burger}
          />
        )

      case 'group':
        return (
          <BizumGroupScreen
            data={groupData}
            onDone={comensales => { addPendingFromGroup(comensales); setScreen('confirmation') }}
            onSkip={() => setScreen('confirmation')}
            onBurger={burger}
          />
        )

      case 'share':
        return (
          <ShareScreen
            payment={payment}
            user={user}
            onDone={() => setScreen('confirmation')}
            onSkip={() => setScreen('confirmation')}
            onBurger={burger}
          />
        )

      case 'confirmation':
        return (
          <ConfirmationScreen
            payment={payment}
            onHome={goHome}
            onTracking={payment?.pax ? () => setScreen('tracking') : null}
            onBurger={burger}
          />
        )

      case 'tracking':
        return (
          <BizumTrackingScreen
            payment={payment}
            onBack={() => setScreen('confirmation')}
            onBurger={burger}
          />
        )

      case 'pending':
        return (
          <PendingPaymentsScreen
            data={pending}
            onTogglePaid={togglePaid}
            onBack={() => setScreen('home')}
            onBurger={burger}
          />
        )

      default:
        return <HomeScreen onScan={() => setScreen('scanner')} onManual={() => setScreen('manual')} onBurger={burger} onDetectRestaurant={setDetectedRestaurant} />
    }
  }

  return (
    <div className="app-shell">
      {renderScreen()}

      {/* User avatar — fixed overlay, left of burger button */}
      <div style={{ position: 'fixed', top: 14, right: 56, zIndex: 40 }}>
        <UserAvatar
          user={user}
          onLogin={triggerGoogleLogin}
          onLogout={handleLogout}
        />
      </div>

      {menuOpen && (
        <BurgerMenu
          onClose={() => setMenuOpen(false)}
          onNavigate={handleMenuNavigate}
          pendingCount={pendingCount}
        />
      )}
    </div>
  )
}
