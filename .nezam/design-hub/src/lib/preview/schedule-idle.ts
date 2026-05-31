/** Run work when the browser is idle (fallback: short timeout). */
export function scheduleIdleWork(fn: () => void, timeoutMs = 3000): void {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(fn, { timeout: timeoutMs })
  } else {
    setTimeout(fn, 64)
  }
}
