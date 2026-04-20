export function formatEur(amount) {
  return amount.toFixed(2).replace('.', ',') + ' €'
}

export function nextRound5(total) {
  const r = Math.ceil(total / 5) * 5
  return r <= total ? r + 5 : r
}

export function nextRound10(total) {
  const r = Math.ceil(total / 10) * 10
  return r <= total ? r + 10 : r
}
