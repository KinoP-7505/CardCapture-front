import type { CardCaptureResponse } from "@/Types/CardCaptureDto"
import type { GameCard, GameDeck } from "@/Types/AppTypes"

/**
 * レスポンスをBattleInfo型に変換する
 * @param CardCaptureResponseデータ
 * @returns BattleInfo型データ
 */
export const dataToInfo = (data: CardCaptureResponse) => {
  const enemyAreaCards = deckToGameCards(data.enemyArea)
  const playerHandCards = deckToGameCards(data.playerHands)

  const info = {
    enemyAreaCards,
    playerHandCards,

    processState: data.processState,
    gameState: data.gameState,
    battleInfo: {
      rounds: data.rounds,
      enemyDeckSize: data.enemyDeckSize,
      sealAreaSize: data.sealAreaSize,
      playerDeckSize: data.playerDeckSize,
      discardSize: data.discardSize,
    },
  }

  return info
}

/**
 * 封印アクション結果反映
 * @param data
 * @returns
 */
export const dataToInfoAct = (data: CardCaptureResponse) => {
  const enemyAreaCards = deckToGameCards(data.enemyArea)
  const playerHandCards = deckToGameCards(data.playerHands)

  const info = {
    processState: data.processState,
    gameState: data.gameState,
    winMessage: data.gameStateMessage,
    enemyAreaCards,
    playerHandCards,
    sealAreaSize: data.sealAreaSize,
    discardSize: data.discardSize,
    enemyDeckSize: data.enemyDeckSize,
  }

  return info
}

/**
 * ディスカード結果反映
 * @param data
 * @returns
 */
export const dataToInfoDiscard = (data: CardCaptureResponse) => {
  const playerHandCards = deckToGameCards(data.playerHands)

  const info = {
    processState: data.processState,
    playerHandCards,
    discardSize: data.discardSize,
    battleInfo: {
      rounds: data.rounds,
    },
  }

  return info
}

const deckToGameCards = (deck: GameDeck) =>
  deck.deck.map((card: GameCard) => {
    const gameCard: GameCard = {
      code: card.code,
      suit: card.suit,
      number: card.number,
      isFace: card.isFace,
      isNumberCard: card.isNumberCard,
      isJoker: card.isJoker,
      selected: false,
    }
    return gameCard
  })
