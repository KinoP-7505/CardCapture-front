import type { GameCard, GameDeck } from "./AppTypes"

export type InitAppResponse = {
  trumpDeck: Map<number, GameCard> // トランプカードマップ
}

export type CardCaptureResponse = {
  enemyArea: GameDeck // エネミーエリア
  playerHands: GameDeck // プレイヤーハンド
  rounds: number // ラウンド数
  enemyDeckSize: number // エネミーデッキサイズ
  sealDeckSize: number // シールデッキサイズ
  playerDeckSize: number // プレイヤーデッキサイズ
  discardSize: number // 捨て札デッキサイズ
  processState: number // 処理状態
}

export type CardCaptureRequest = {
  actionCode: number // 実行アクション 1.捕獲 2.封印 3.吹き飛ばし
  targetEnemy: number // 対象EnemyCardコード
  selected: number[] // 選択HandsCardコード
}
