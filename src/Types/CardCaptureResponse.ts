import type { GameDeck } from "./GameDeck"

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
