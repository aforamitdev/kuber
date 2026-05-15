export type AmortRow = {
  index: number
  opening: number
  interest: number
  principal: number
  payment: number
  closing: number
}

export function buildSchedule(opts: {
  balance: number
  annualRate: number
  emi: number
  maxMonths?: number
}): AmortRow[] {
  const { balance, annualRate, emi } = opts
  const cap = opts.maxMonths ?? 600
  if (balance <= 0 || emi <= 0) return []
  const r = annualRate / 100 / 12
  if (r > 0 && emi <= balance * r) return []

  const rows: AmortRow[] = []
  let open = balance
  for (let i = 1; i <= cap && open > 0; i++) {
    const interest = open * r
    const payment = Math.min(emi, open + interest)
    const principal = payment - interest
    const closing = Math.max(0, open - principal)
    rows.push({ index: i, opening: open, interest, principal, payment, closing })
    open = closing
  }
  return rows
}
