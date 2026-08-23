import { devtools } from "zustand/middleware"
import { create } from "zustand"
import type { BattleInfo, GameCard } from "@/Types/AppTypes"

// ゲーム情報State
type BattleInfoState = {
  trumpDeck: Map<number, GameCard> // トランプ束
  setTrumpDeck: (trump: Map<number, GameCard>) => void
  battleInfo: BattleInfo
  setBattleInfo: (info: BattleInfo) => void

  enemyArea: GameCard[] // cardCode(number)の配列
  setEnemyArea: (cards: GameCard[]) => void
  playerHands: GameCard[] // cardCode(number)の配列
  setPlayerHands: (cards: GameCard[]) => void
  processState: number // 処理状態
  setProcessState: (pState: number) => void
  actionState: number // アクション状態
  setActionState: (aState: number) => void
  // メッセージ
  message: string
  addMessage: (txt: string) => void
  setMessage: (txt: string) => void
  winMessage: string
  setWinMessage: (txt: string) => void

  cardSelected: number // カード選択中
  setCardSelected: (selected: number) => void // カード選択中
  selectedEnemyCard: number // 選択中敵カード
  setSelectedEnemyCard: (cardCode: number) => void // 選択中敵カード
  toggleCaptureEnemySelected: (index: number) => void // 選択状態変更
  toggleEnemyCardSelected: (index: number) => void
  selectedPlayerCard: number[] // 選択中手札カード
  setSelectedPlayerCard: (cardCodes: number[]) => void // 選択中手札カード
  toggleHandsSingleSelected: (index: number) => void // 選択状態１枚変更
  toggleHandsMultiSelected: (index: number, changeUnSelected: boolean) => void // 選択状態変更
  resetSelected: () => void // 選択状態をリセット
  resetSelectedPlayer: () => void
  sumSelectedHands: number // 選択中カード数字合計
}
// Zustand Store
export const useBattleInfoStore = create<BattleInfoState>()(
  devtools(
    (set) => ({
      trumpDeck: new Map<number, GameCard>(),
      setTrumpDeck: (trumpDeck) => {
        console.log("stateSET trumpDeck:", trumpDeck)
        const mapEntries = Object.entries(trumpDeck).map(
          // ([k, v]) => [Number(k), v] as [number, GameCard],
          ([k, v]) =>
            [
              Number(k),
              {
                ...v,
                isFace: v.number > 10,
                isNumberCard: v.number <= 10,
                selected: false,
              },
            ] as [number, GameCard],
        )
        console.log("mapEntries")
        console.log(mapEntries)

        set({ trumpDeck: new Map(mapEntries) }, false, "setTrumpDeck")
      },
      battleInfo: {
        rounds: 0,
        enemyDeckSize: 0,
        sealAreaSize: 0,
        playerDeckSize: 0,
        discardSize: 0,
      },
      setBattleInfo: (info) => set({ battleInfo: info }, false, "setBattleInfo"), // コメントリスト取得API
      enemyArea: [],
      setEnemyArea: (cards) => set({ enemyArea: cards }, false, "setEnemyArea"),
      playerHands: [],
      setPlayerHands: (cards) => set({ playerHands: cards }, false, "setPlayerHands"),
      processState: 0,
      setProcessState: (pState) => set({ processState: pState }, false, "setProcessState"),

      actionState: 0, // アクション状態
      setActionState: (aState) => set({ actionState: aState }, false, "setActionState"),

      winMessage: "",
      setWinMessage: (txt: string) => set({ winMessage: txt }, false, "setWinMessage"),

      message: "",
      addMessage: (txt) => {
        set(
          (state) => {
            {
              const newMessage = state.message + "\n" + txt
              return { message: newMessage }
            }
          },
          false,
          "addMessage",
        )
      },
      setMessage: (message) => set({ message }, false, "setMessage"),

      cardSelected: 0, // カード選択中(0:OFF)
      setCardSelected: (selected) => set({ cardSelected: selected }, false, "setCardSelected"), // カード選択中

      selectedEnemyCard: 0, // 選択中敵カード
      setSelectedEnemyCard: (cardCode) =>
        set({ selectedEnemyCard: cardCode }, false, "setSelectedEnemyCard"), // 選択中敵カード
      selectedPlayerCard: [], // 選択中手札カード
      toggleCaptureEnemySelected: (index) =>
        set(
          (state) => {
            let selectedCode = state.selectedEnemyCard // 選択中カードコード
            // enemyArea配列のselectedを全てfalseに更新
            const newEnemyArea = state.enemyArea.map((item) => ({
              ...item, // itemをコピーした配列を新規作成
              selected: false, // コピー後のselectedプロパティに値設定
            }))
            const updatedEnemyArea = newEnemyArea.map((item, i) => {
              if (i === index) {
                const nextSelected = !item.selected
                // 選択状態の場合、コード更新
                if (nextSelected) {
                  selectedCode = item.code
                }
                return {
                  ...item,
                  selected: nextSelected,
                }
              }
              return item
            })

            // battleInfoの更新
            return {
              enemyArea: updatedEnemyArea, // ⭕ boolean ではなく配列を渡す
              selectedEnemyCard: selectedCode, // 選択中コード更新
            }
          },
          false,
          "toggleCaptureEnemySelected",
        ),
      toggleEnemyCardSelected: (index) =>
        set(
          (state) => {
            // 1. .map で該当要素の selected だけを反転させた新しい配列を生成する
            const updatedEnemyArea = state.enemyArea.map((item, i) => {
              if (i === index) {
                const nextSelected = !item.selected
                // console.log(
                //   `index = ${index} の selected を ${item.selected} -> ${nextSelected} に変更`,
                // )
                return {
                  ...item,
                  selected: nextSelected,
                }
              }
              return item
            })
            return {
              enemyArea: updatedEnemyArea, // ⭕ boolean ではなく配列を渡す
            }
          },
          false,
          "toggleEnemyCardSelected",
        ),

      setSelectedPlayerCard: (cardCodes: number[]) =>
        set({ selectedPlayerCard: cardCodes }, false, "setSelectedPlayerCard"), // 選択中手札カード
      // 選択状態１枚変更
      toggleHandsSingleSelected: (index: number) =>
        set(
          (state) => {
            // 対象カードが未選択の場合は、選択中を解除して、indexを選択中
            const newHands = state.playerHands.map((item, idx) => {
              return {
                ...item, // itemをコピーした配列を新規作成
                selected: index === idx, // インデックスと一致するカードを選択中にする
              }
            })
            return {
              playerHands: newHands,
            }
          },
          false,
          "toggleHandsSingleSelected",
        ),
      // PlayerHands選択状態更新
      toggleHandsMultiSelected: (index: number, changeUnSelected: boolean) =>
        set(
          (state) => {
            // 1. .map で該当要素の selected だけを反転させた新しい配列を生成する
            const updatedHands = state.playerHands.map((item, i) => {
              if (i === index) {
                const nextSelected = !item.selected
                console.log(
                  `index = ${index} の selected を ${item.selected} -> ${nextSelected} に変更`,
                )
                return {
                  ...item,
                  selected: nextSelected,
                }
              } else if (changeUnSelected && item.isJoker) {
                // 未選択状態変更、かつ、対象カードがジョーカーの場合、ジョーカーも未選択にする
                const nextSelected = !item.selected
                return {
                  ...item,
                  selected: nextSelected,
                }
              }
              // 上記以外は変更なし
              return item
            })
            // 捕獲アクションの場合
            if (state.actionState === 1) {
              // 手札数字合計を行う
              const sum = updatedHands.reduce((numSum, card) => {
                if (card.selected) {
                  return numSum + card.number
                }
                return numSum
              }, 0)
              return {
                playerHands: updatedHands,
                sumSelectedHands: sum,
              }
            }

            // 上記委以外の場合
            return {
              playerHands: updatedHands,
            }
          },
          false,
          "toggleHandsMultiSelected",
        ),
      resetSelected: () =>
        set(
          (state) => {
            // 敵エリア選択リセット
            const resetEnemyArea = state.enemyArea.map((item) => ({
              ...item, // itemをコピーした配列を新規作成
              selected: false, // コピー後のselectedプロパティに値設定
            }))

            // 手札選択リセット
            const resetHands = state.playerHands.map((item) => ({
              ...item, // itemをコピーした配列を新規作成
              selected: false, // コピー後のselectedプロパティに値設定
            }))

            // state更新
            return {
              battleInfo: {
                ...state.battleInfo,
              },
              enemyArea: resetEnemyArea,
              playerHands: resetHands,
              selectedEnemyCard: 0, // 選択敵カード
              selectedPlayerCard: [], // 選択手札
            }
          },
          false,
          "resetSelected",
        ),
      resetSelectedPlayer: () =>
        set(
          (state) => {
            // 手札選択リセット
            const resetHands = state.playerHands.map((item) => ({
              ...item, // itemをコピーした配列を新規作成
              selected: false, // コピー後のselectedプロパティに値設定
            }))
            // state更新
            return {
              battleInfo: {
                ...state.battleInfo,
              },
              playerHands: resetHands,
              selectedPlayerCard: [], // 選択手札
              sumSelectedHands: 0, // 手札数字合計リセット
            }
          },
          false,
          "resetSelectedPlayer",
        ),

      // resetSelectedPlayer
      sumSelectedHands: 0, // 選択カード合計
    }),
    { name: "BattleInfoStore" },
  ),
)
