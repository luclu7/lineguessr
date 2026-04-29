import { arrayToShuffled } from 'array-shuffle'
import { getRandomArret, getThreeOtherRandomLineIcons } from '#/lines'
import type { ArretLigneWithIcon, LineWithIcon } from '#/lines'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGameTimer } from '#/hooks/useGameTimer'

const ROUND_DURATION_MS = 5_000
const SCORE_MAX = 1000
const BONUS_WINDOW_MS = 1_500
const NUMBER_OF_ROUNDS = 10
const NEXT_ROUND_DELAY_AFTER_ANSWER_MS = 1500

const computePointsFromElapsedMs = (elapsedMs: number) => {
  if (elapsedMs <= BONUS_WINDOW_MS) return SCORE_MAX

  if (elapsedMs < ROUND_DURATION_MS) {
    // Décroissance linéaire entre BONUS_WINDOW_MS et la fin.
    // BONUS_WINDOW_MS -> 1000 ; ROUND_DURATION_MS -> 0
    const t = elapsedMs - BONUS_WINDOW_MS
    const total = ROUND_DURATION_MS - BONUS_WINDOW_MS
    return Math.floor(((total - t) / total) * SCORE_MAX)
  }

  return 0
}

export const useGameLogic = () => {
  const [arret, setArret] = useState<ArretLigneWithIcon | null>(null)
  const [linesToShow, setLinesToShow] = useState<LineWithIcon[]>([])
  const [answer, setAnswer] = useState<LineWithIcon | null>(null)
  const [answerProgress, setAnswerProgress] = useState(0)

  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  const [round, setRound] = useState(0)

  // Le timer est géré via un hook dédié pour l'affichage (barre + temps),
  // mais le scoring/timeout est calculé via l'horloge réelle pour être exact.
  const { timeLeftMs, timeLeftSeconds, progress, start, stop, reset } =
    useGameTimer(ROUND_DURATION_MS)

  const isCorrectAnswer = useMemo(
    () => answer?.id === arret?.id,
    [answer, arret],
  )
  const showAnswerModal = answer !== null

  const isRoundActive = useRef(false)
  const roundStartedAtRef = useRef<number>(Date.now())
  const isGameOverRef = useRef(false)

  useEffect(() => {
    isGameOverRef.current = isGameOver
  }, [isGameOver])

  useEffect(() => {
    if (round > NUMBER_OF_ROUNDS) {
      setIsGameOver(true)
      stop()
    }
  }, [round])

  const clearAnswerState = useCallback(() => {
    setAnswer(null)
    setAnswerProgress(0)
  }, [])

  const generateRound = useCallback(() => {
    const newStop = getRandomArret(arret?.id ?? '')
    setArret(newStop)
    const otherLines = getThreeOtherRandomLineIcons(newStop)
    const everyLinesToShow = arrayToShuffled([...otherLines, newStop])
    setLinesToShow(everyLinesToShow)
  }, [arret?.id])

  const startRound = useCallback(() => {
    if (isGameOverRef.current || round > NUMBER_OF_ROUNDS) return

    generateRound()
    roundStartedAtRef.current = Date.now()
    isRoundActive.current = true

    reset()
    start()
    setRound(round + 1)
  }, [generateRound, reset, start, round, setRound])

  const endRound = useCallback(() => {
    isRoundActive.current = false
    stop()
  }, [stop])

  const handleTimeout = useCallback(() => {
    if (!isRoundActive.current || isGameOverRef.current) return
    newArret()
  }, [stop])

  // Quand le countdown atteint 0, on considère que le joueur n'a pas répondu donc on passe à la question suivante
  useEffect(() => {
    if (isGameOver) return
    if (!isRoundActive.current) return
    if (timeLeftMs > 0) return
    handleTimeout()
  }, [handleTimeout, isGameOver, timeLeftMs])

  useEffect(() => {
    startRound()
  }, [])

  const newArret = useCallback(() => {
    if (isGameOverRef.current) return
    clearAnswerState()
    endRound()
    startRound()
    setRound(round + 1)
  }, [clearAnswerState, endRound, startRound])

  const resetGame = useCallback(() => {
    setRound(1)
    setScore(0)
    setIsGameOver(false)
    clearAnswerState()
    endRound()
    startRound()
  }, [clearAnswerState, endRound, startRound])

  const [newPoints, setNewPoints] = useState(0)

  const checkAnswer = useCallback(
    (line: LineWithIcon) => {
      if (isGameOverRef.current) return
      if (!isRoundActive.current) return

      const elapsed = Date.now() - roundStartedAtRef.current
      const points = computePointsFromElapsedMs(elapsed)

      setNewPoints(points)

      // Stopper immédiatement le round: le joueur a "choisi", on fige le scoring.
      endRound()

      setAnswer(line)
      setAnswerProgress(0)

      requestAnimationFrame(() => {
        setAnswerProgress(100)
      })

      const correct = line.id === arret?.id
      if (correct) {
        setScore((prev) => prev + points)
      }

      setTimeout(() => {
        if (isGameOverRef.current) return
        clearAnswerState()
        startRound()
      }, NEXT_ROUND_DELAY_AFTER_ANSWER_MS)
    },
    [arret?.id, clearAnswerState, endRound, startRound],
  )

  return {
    arret,
    newArret,
    resetGame,
    score,
    timeLeftSeconds,
    timerProgress: progress,
    isGameOver,
    linesToShow,
    answer,
    answerProgress,
    isCorrectAnswer,
    showAnswerModal,
    checkAnswer,
    newPoints,
    round,
  } as const
}
