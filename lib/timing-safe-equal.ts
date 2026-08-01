

export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false

  const len = Math.max(a.length, b.length)
  let mismatch = a.length === b.length ? 0 : 1

  for (let i = 0; i < len; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0
    const charB = i < b.length ? b.charCodeAt(i) : 0
    mismatch |= charA ^ charB
  }

  return mismatch === 0
}
