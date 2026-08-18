export type BattleInfo = {
  rounds: number
  enemyDeckSize: number // EnemyDeck枚数
  sealDeckSize: number // SealCard枚数
  playerDeckSize: number // PlayerDeck枚数
  discardSize: number // 捨て場枚数
  // enemyArea: GameCard[] // cardCode(number)の配列
  // playerHands: GameCard[] // cardCode(number)の配列

  // カード情報
  //trumpCard: Map<number, GameCard> // トランプカードマップ

  // processState: number // 処理状態
}

export type GameDeck = {
  label: string // デッキラベル
  deck: GameCard[] // cardCode(number)の配列
}

export type GameCard = {
  code: number
  suit: number
  number: number
  face: boolean
  numberCard: boolean
  selected: boolean
}
