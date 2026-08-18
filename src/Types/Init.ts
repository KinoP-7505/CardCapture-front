import type { GameCard } from "./GameCard"

export type InitResponse = {
  trumpDeck: Map<number, GameCard>
}
