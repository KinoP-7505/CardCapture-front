import { create } from "zustand"
import { devtools } from "zustand/middleware"

// Store全体の型定義
type AxiosState = {
  isLoading: boolean // リクエスト状態
  setIsLoading: (loading: boolean) => void // セッター
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
      message: "",
      // SETTER
      setIsLoading: (isLoading) => set({ isLoading }),
      addMessage: (txt) => {
        const newMessage = get().message + "\n" + txt
        set({ message: newMessage })
      },
      setMessage: (message) => set({ message }),
    }),
    { name: "AxiosStore" },
  ),
)
