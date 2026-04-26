const DEFAULT_MEAL_TYPES = [
  { id: 1, start: '07:00', end: '11:30', label: 'el desayuno' },
  { id: 2, start: '11:30', end: '12:30', label: 'el brunch'   },
  { id: 3, start: '12:30', end: '18:00', label: 'la comida'   },
  { id: 4, start: '18:00', end: '20:30', label: 'la merienda' },
  { id: 5, start: '20:30', end: '01:00', label: 'la cena'     },
  { id: 6, start: '01:00', end: '07:00', label: 'la noche'    },
]

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function getMealTypes() {
  try {
    const stored = localStorage.getItem('tipfund_meal_types')
    return stored ? JSON.parse(stored) : DEFAULT_MEAL_TYPES
  } catch {
    return DEFAULT_MEAL_TYPES
  }
}

export function saveMealTypes(types) {
  try {
    localStorage.setItem('tipfund_meal_types', JSON.stringify(types))
  } catch {}
}

export function getMealType() {
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  const types = getMealTypes()

  const match = types.find(t => {
    const from = toMinutes(t.start)
    const to   = toMinutes(t.end)
    if (from < to) return current >= from && current < to
    // wraps midnight (e.g. 20:30 → 01:00)
    return current >= from || current < to
  })
  return match ? match.label : 'la comida'
}

export function generateSessionId() {
  return Math.random().toString(36).slice(2, 9).toUpperCase()
}

export function buildMessage({ organizerName, amount, restaurantName, sessionId, comensalIndex, mealType }) {
  const amountStr  = amount.toFixed(2).replace('.', ',')
  const restaurant = restaurantName && restaurantName !== 'Importe manual' ? restaurantName : 'el restaurante'
  const link       = `https://tipfund.netlify.app/pagar/${sessionId}-${comensalIndex}`

  return `Ey, que ${mealType} no se paga sola \uD83D\uDE04\n\n${organizerName} dice que le debes ${amountStr} \u20AC de ${restaurant} \uD83C\uDF7D\uFE0F\n\n(Y tiene pruebas \uD83E\uDDFE)\n\nSin efectivo, sin l\u00EDos, en 10 segundos:\n\uD83D\uDC47\n${link}\n\n_Cuentas claras, amistades largas_ \uD83E\uDD1D\n_tipFund \u00B7 cada uno lo suyo, sin l\u00EDos_`
}

export function logSend({ sessionId, comensalIndex, organizerName, amount, restaurantName }) {
  try {
    const key = 'tipfund_send_log'
    const log = JSON.parse(localStorage.getItem(key) || '[]')
    log.unshift({
      ts: Date.now(),
      sessionId,
      comensalIndex,
      organizerName,
      amount,
      restaurantName,
    })
    localStorage.setItem(key, JSON.stringify(log.slice(0, 200)))
  } catch {}
}
