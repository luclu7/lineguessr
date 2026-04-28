import { Game } from '#/components/game'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/game')({
  component: Game,
})
