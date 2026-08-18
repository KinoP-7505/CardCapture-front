import type { GameCard } from "./GameCard"

export type InitAppResponse = {
  trumpDeck: Map<number, GameCard> // トランプカードマップ
}
