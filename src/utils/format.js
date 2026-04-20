export function formatEur(amount) {
  return amount.toFixed(2).replace('.', ',') + ' €'
}

// total < 50 → siguiente múltiplo de 5; total >= 50 → siguiente múltiplo de 10
export function smartRound(total) {
  const step = total < 50 ? 5 : 10
  const r = Math.ceil(total / step) * step
  return r <= total ? r + step : r
}
