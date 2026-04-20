import { useState } from 'react'
import HomeScreen            from './screens/HomeScreen'
import ScannerScreen         from './screens/ScannerScreen'
import ProcessingScreen      from './screens/ProcessingScreen'
import ResultScreen          from './screens/ResultScreen'
import ManualScreen          from './screens/ManualScreen'
import ConfirmationScreen    from './screens/ConfirmationScreen'
import BizumGroupScreen      from './screens/BizumGroupScreen'
import BizumTrackingScreen   from './screens/BizumTrackingScreen'
import PendingPaymentsScreen from './screens/PendingPaymentsScreen'
import BurgerMenu            from './components/BurgerMenu'

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

  const pendingCount = pending.flatMap(d => d.comensales).filter(c => !c.pagado).length

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
            onPay={p => { setPayment(p); setScreen('confirmation') }}
            onGroup={d => { setGroupData(d); setPayment(d); setScreen('group') }}
            onBurger={burger}
          />
        )

      case 'group':
        return (
          <BizumGroupScreen
            data={groupData}
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
        return <HomeScreen onScan={() => setScreen('scanner')} onManual={() => setScreen('manual')} onBurger={burger} />
    }
  }

  return (
    <div className="app-shell">
      {renderScreen()}

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
