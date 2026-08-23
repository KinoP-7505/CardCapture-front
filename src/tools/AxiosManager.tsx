import { create } from "zustand"
import { devtools } from "zustand/middleware"

// Store全体の型定義
type AxiosState = {
  isLoading: boolean // リクエスト状態
  setIsLoading: (loading: boolean) => void // セッター
}
// Axios通信系のZustand Store
export const useAxiosStore = create<AxiosState>()(
  devtools(
    (set) => ({
      //初期値
      isLoading: false,
      // SETTER
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    { name: "AxiosStore" },
  ),
)
