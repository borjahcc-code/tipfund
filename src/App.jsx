import { useState } from 'react'
import HomeScreen        from './screens/HomeScreen'
import ScannerScreen     from './screens/ScannerScreen'
import ProcessingScreen  from './screens/ProcessingScreen'
import ResultScreen      from './screens/ResultScreen'
import ManualScreen      from './screens/ManualScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import BizumGroupScreen  from './screens/BizumGroupScreen'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [ocr,     setOcr]   = useState(null)
  const [payment, setPayment] = useState(null)
  const [groupData, setGroupData] = useState(null)

  function goHome() {
    setScreen('home')
    setOcr(null)
    setPayment(null)
    setGroupData(null)
  }

  function renderScreen() {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            onScan={()   => setScreen('scanner')}
            onManual={() => setScreen('manual')}
          />
        )

      case 'scanner':
        return (
          <ScannerScreen
            onCapture={() => setScreen('processing')}
            onCancel={() => setScreen('home')}
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
          />
        )

      case 'result':
        return (
          <ResultScreen
            ocr={ocr}
            onPay={p => { setPayment(p); setScreen('confirmation') }}
            onGroup={d => { setGroupData(d); setPayment(d); setScreen('group') }}
          />
        )

      case 'group':
        return (
          <BizumGroupScreen
            data={groupData}
            onDone={() => setScreen('confirmation')}
            onSkip={() => setScreen('confirmation')}
          />
        )

      case 'confirmation':
        return (
          <ConfirmationScreen
            payment={payment}
            onHome={goHome}
          />
        )

      default:
        return <HomeScreen onScan={() => setScreen('scanner')} onManual={() => setScreen('manual')} />
    }
  }

  return (
    <div className="app-shell">
      {renderScreen()}
    </div>
  )
}
