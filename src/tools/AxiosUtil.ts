import axios from "axios"
const baseUrl = import.meta.env.VITE_BASE_URL

// const baseUrl = http://127.0.0.1:8080/api/cardcapture/ // 接続先ドメイン+API
export const END_POINT = {
  get_initApp: "/initApp", // ゲーム初期化、定数受信
  get_startRound: "/startRound", // ゲーム開始
  actionCheck: "/actionCheck", // アクションチェック
  executeAction: "/executeAction", // アクション実行
}

const axiosClient = axios.create({
  baseURL: baseUrl,
  timeout: 5000, // 5000ms
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
})

// axiosFether
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await axiosClient.get<T>(url)
  return res.data
}
