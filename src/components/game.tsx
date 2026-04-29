import { useGameLogic } from '#/hooks/useGameLogic'
import { Link } from '@tanstack/react-router'

export const Game = () => {
  const {
    arret,
    newArret,
    linesToShow,
    score,
    timeLeftSeconds,
    timerProgress,
    isGameOver,
    resetGame,
    answerProgress,
    isCorrectAnswer,
    showAnswerModal,
    checkAnswer,
    newPoints,
    round,
  } = useGameLogic()

  return (
    <div className="p-8 relative">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">
          <Link to="/">Lineguessr</Link>
        </h1>
        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-500">
            Score: <span className="font-bold text-gray-900">{score}</span>
          </p>
          <p className="text-sm text-gray-500">
            Round: <span className="font-bold text-gray-900">{round}</span>
          </p>
          <p className="text-xs font-mono text-gray-600">{timeLeftSeconds}</p>
        </div>
      </div>

      <div className="h-3 w-full rounded bg-gray-200 overflow-hidden mb-6">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${timerProgress * 100}%` }}
        />
      </div>

      <p className="text-sm text-gray-500">
        Choisis la bonne ligne avant la fin (5s).
      </p>
      <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-center">
            <span className="font-bold text-6xl">{arret?.stop_name ?? ''}</span>
            <br />
            sur la ligne ...?
          </p>
          <div className="relative my-6">
            <div className="flex flex-row gap-4">
              {linesToShow.map((line) => (
                <button
                  className={`${showAnswerModal || isGameOver ? 'opacity-50 hover:cursor-not-allowed' : 'opacity-100 hover:cursor-pointer'} transition-all duration-300 ease-in-out`}
                  onClick={() => {
                    checkAnswer(line)
                  }}
                  disabled={showAnswerModal || isGameOver}
                >
                  <img
                    src={`/icons/${line.icon}`}
                    alt={line.route_long_name}
                    className="w-40 h-40"
                  />
                </button>
              ))}
            </div>
            {showAnswerModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-black/50">
                <div
                  className={`${isCorrectAnswer ? 'bg-green-500' : 'bg-red-500'} text-center text-white p-4 rounded-md flex flex-col gap-2 items-center shadow-lg`}
                >
                  {isCorrectAnswer ? (
                    <>
                      <p className="text-xl font-bold">Correct!</p>
                      <p>
                        +<span className="font-bold text-xl">{newPoints}</span>{' '}
                        points
                      </p>
                    </>
                  ) : (
                    <p className="text-xl font-bold">Incorrect!</p>
                  )}

                  <img
                    src={`/icons/${arret?.icon ?? ''}`}
                    alt={arret?.route_long_name ?? ''}
                    className="w-30 h-30"
                  />
                  <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
                    <div
                      className="h-full bg-gray-200 transition-all ease-linear"
                      style={{
                        width: `${answerProgress}%`,
                        transitionDuration: '1500ms',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 hover:cursor-pointer"
            onClick={resetGame}
            disabled={isGameOver}
          >
            Nouvelle partie
          </button>
        </div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-black/50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center flex flex-col gap-3 items-center">
            <p className="text-xl font-bold">Temps écoulé</p>
            <p className="text-sm text-gray-600">Ton score final : {score}</p>
            <button
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              onClick={resetGame}
            >
              Rejouer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
