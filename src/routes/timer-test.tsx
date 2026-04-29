import { useGameTimer } from '#/hooks/useGameTimer'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/timer-test')({
  component: TimerTestPage,
})

function TimerTestPage() {
  const { timeLeftSeconds, progress, isRunning, start, stop, reset } = useGameTimer(5_000)

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Timer Test</h1>
      <div className="w-72">
        <p className="text-2xl font-mono text-center">{timeLeftSeconds}</p>
        <div className="mt-2 h-3 w-full rounded bg-gray-200 overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={start}
          disabled={isRunning}
          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!isRunning}
          className="bg-orange-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Stop
        </button>
        <button type="button" onClick={reset} className="bg-gray-500 text-white px-3 py-1 rounded">
          Reset
        </button>
      </div>

      <Link to="/" className="text-blue-600 underline">
        Retour a l'accueil
      </Link>
    </div>
  )
}
