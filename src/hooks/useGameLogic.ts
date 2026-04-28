import { arrayToShuffled } from "array-shuffle"
import type { LineWithIcon } from "#/lines"
import { getRandomArret, type ArretLigneWithIcon } from "#/lines"
import { getThreeOtherRandomLineIcons } from "#/lines"
import { useState, useEffect } from "react"

export const useGameLogic = () => {
    const [arret, setArret] = useState<ArretLigneWithIcon | null>(null)
    const [linesToShow, setLinesToShow] = useState<LineWithIcon[]>([])
    const [answer, setAnswer] = useState<LineWithIcon | null>(null)
    const [answerProgress, setAnswerProgress] = useState(0)
    const isCorrectAnswer = answer?.id === arret?.id
    const showAnswerModal = answer !== null
  
    useEffect(() => {
      newArret()
    }, [])
  
    const newArret = () => {
      const newStop = getRandomArret(arret?.id ?? '')
      setArret(newStop)
      const otherLines = getThreeOtherRandomLineIcons(newStop)
      const everyLinesToShow = arrayToShuffled([...otherLines, newStop])
      setLinesToShow(everyLinesToShow)
    }
  
    const checkAnswer = (line: LineWithIcon) => {
      console.log(`Checking answer: ${line.route_long_name} - ${line.id}`)
      setAnswer(line)
      setAnswerProgress(0)
  
      requestAnimationFrame(() => {
        setAnswerProgress(100)
      })
  
      setTimeout(() => {
        setAnswer(null)
        setAnswerProgress(0)
        newArret()
      }, 2000)
    }
  
    return {
      arret,
      newArret,
      linesToShow,
      answer,
      answerProgress,
      isCorrectAnswer,
      showAnswerModal,
      checkAnswer,
    } as const
  }
  