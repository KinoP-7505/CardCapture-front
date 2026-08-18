import type { BattleInfo } from "@/Types/BattleInfo"
import type { GameCard } from "@/Types/GameCard"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

// Store全体の型定義
type AxiosState = {
  isLoading: boolean // リクエスト状態
  trumpDeck: Map<number, GameCard> // トランプ束
  setIsLoading: (loading: boolean) => void // セッター
  setTrumpDeck: (trump: Map<number, GameCard>) => void
  battleInfo: BattleInfo // 処理情報
  setBattleInfo: (info: BattleInfo) => void
  // 一部の値だけを更新したい場合用のオプショナルな関数（後述）
  updateBattleInfo: (partialInfo: Partial<BattleInfo>) => void
  // メッセージ
  message: string
  addMessage: (txt: string) => void
  setMessage: (txt: string) => void
}
// Axios通信系のZustand Store
export const useAxiosStore = create<AxiosState>()(
  devtools(
    (set, get) => ({
      //初期値
      isLoading: false,
      trumpDeck: new Map<number, GameCard>(),
      battleInfo: {
        rounds: 0,
        enemyDeckSize: 0,
        sealDeckSize: 0,
        playerDeckSize: 0,
        discardSize: 0,
        enemyArea: [],
        playerHands: [],
        processState: 0,
      },
      message: "",
      // SETTER
      setIsLoading: (isLoading) => set({ isLoading }),
      setTrumpDeck: (trumpDeck) => {
        console.log("stateSET trumpDeck:", trumpDeck)
        const mapEntries = Object.entries(trumpDeck).map(
          ([k, v]) => [Number(k), v] as [number, GameCard],
        )
        set({ trumpDeck: new Map(mapEntries) })
      },
      setBattleInfo: (info) => set({ battleInfo: info }), // コメントリスト取得API
      updateBattleInfo: (partialInfo) =>
        set((state) => ({
          battleInfo: { ...state.battleInfo, ...partialInfo },
        })),
      addMessage: (txt) => {
        const newMessage = get().message + "\n" + txt
        set({ message: newMessage })
      },
      setMessage: (message) => set({ message }),
    }),
    { name: "AxiosStore" },
  ),
)
