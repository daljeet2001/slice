export function splitEven(total, n) {
  const cents = Math.round(Number(total) * 100);
  const base = Math.floor(cents / n);
  const rem = cents % n;
  return Array.from({ length: n }, (_, i) => (base + (i < rem ? 1 : 0)) / 100);
}

