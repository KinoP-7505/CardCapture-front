import type { CardCaptureResponse } from "@/Types/CardCaptureDto"
import type { GameCard } from "@/Types/AppTypes"

/**
 * レスポンスをBattleInfo型に変換する
 * @param CardCaptureResponseデータ
 * @returns BattleInfo型データ
 */
export const dataToInfo = (data: CardCaptureResponse) => {
  const enemyAreaCards = data.enemyArea.deck.map((card: GameCard) => {
    const gameCard: GameCard = {
      code: card.code,
      suit: card.suit,
      number: card.number,
      face: card.face,
      numberCard: card.numberCard,
      selected: false,
    }
    return gameCard
  })
  const playerHandCards = data.playerHands.deck.map((card: GameCard) => {
    const gameCard: GameCard = {
      code: card.code,
      suit: card.suit,
      number: card.number,
      face: card.face,
      numberCard: card.numberCard,
      selected: false,
    }
    return gameCard
  })

  const info = {
    enemyAreaCards,
    playerHandCards,
    processState: data.processState,
    battleInfo: {
      rounds: data.rounds,
      enemyDeckSize: data.enemyDeckSize,
      sealDeckSize: data.sealDeckSize,
      playerDeckSize: data.playerDeckSize,
      discardSize: data.discardSize,
    },
  }

  return info
}
