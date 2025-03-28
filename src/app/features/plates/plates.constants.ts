export const PLATE_DIGITS: number = 6
export const NUMERIC_BASE: number = 10
export const LETTERS: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const ALPHABETIC_BASE: number = LETTERS.length
export const THRESHOLDS = Array.from({ length: ALPHABETIC_BASE }, (_, i) => (NUMERIC_BASE ** (PLATE_DIGITS - i)) * ALPHABETIC_BASE ** i)
export function getThreshold(digits: number, letters: number): number {
  return (NUMERIC_BASE ** digits) * (ALPHABETIC_BASE ** letters)
}
export function cumulativeThreshold(count: number) {
  return THRESHOLDS.slice(0, count).reduce((acc, threshold) => acc + threshold, 0)
}

