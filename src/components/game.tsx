import { useGameLogic } from "#/hooks/useGameLogic"

export const Game = () => {
    const {
      arret,
      newArret,
      linesToShow,
      answerProgress,
      isCorrectAnswer,
      showAnswerModal,
      checkAnswer,
    } = useGameLogic()
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Lineguessr</h1>
        <p className="text-sm text-gray-500">jsp je m'ennuie en cours</p>
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
                    className={`${showAnswerModal ? 'opacity-50 hover:cursor-not-allowed' : 'opacity-100 hover:cursor-pointer'} transition-all duration-300 ease-in-out`}
                    onClick={() => {
                      checkAnswer(line)
                    }}
                    disabled={showAnswerModal}
                  >
                    <img
                      src={`/icons/${line.icon ?? ''}`}
                      alt={line.route_long_name ?? ''}
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
                    {isCorrectAnswer ? 'Correct!' : 'Incorrect!'}
                    <img
                      src={`/icons/${arret?.icon ?? ''}`}
                      alt={arret?.route_long_name ?? ''}
                      className="w-30 h-30"
                    />
                    <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
                      <div
                        className="h-full bg-gray-200 transition-all ease-linear"
                        style={{ width: `${answerProgress}%`, transitionDuration: '2000ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            <button
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 hover:cursor-pointer"
              onClick={newArret}
            >
              New random arret
            </button>
          </div>
        </div>
      </div>
    )
  }
  