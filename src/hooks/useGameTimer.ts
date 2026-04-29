import { useCallback, useEffect, useRef, useState } from 'react'

type UseGameTimerReturn = {
  timeLeftMs: number
  timeLeftSeconds: string
  progress: number
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: () => void
}

export const useGameTimer = (durationMs = 5_000): UseGameTimerReturn => {
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs)
  const [isRunning, setIsRunning] = useState(false)
  const rafRef = useRef<number | null>(null)

  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    cancelRaf()
    setIsRunning(false)
  }, [cancelRaf])

  const reset = useCallback(() => {
    stop()
    setTimeLeftMs(durationMs)
  }, [stop, durationMs])

  const start = useCallback(() => {
    cancelRaf()
    setTimeLeftMs(durationMs)
    setIsRunning(true)

    const startedAt = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(durationMs - elapsed, 0)

      setTimeLeftMs(remaining)
      if (remaining === 0) {
        stop()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [cancelRaf, durationMs, stop])

  useEffect(() => () => cancelRaf(), [cancelRaf])

  return {
    timeLeftMs,
    timeLeftSeconds: (timeLeftMs / 1000).toFixed(2),
    progress: timeLeftMs / durationMs,
    isRunning,
    start,
    stop,
    reset,
  }
}
