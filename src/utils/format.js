export function formatEur(amount) {
  return amount.toFixed(2).replace('.', ',') + ' €'
}
