import axios from "axios"
// const baseUrl = import.meta.env.VITE_BASE_URL

// const baseUrl = http://127.0.0.1:8080/api/cardcapture/ // 接続先ドメイン+API
const url = "/api/cardcapture"
export const END_POINT = {
  get_initApp: url + "/initApp", // アプリ初期化、定数受信
  get_initGame: url + "/initGame", // ゲーム初期化
  get_startRound: url + "/startRound", // ゲーム開始
  get_setUp: url + "/setUp", // ゲーム開始
  actionCheck: url + "/actionCheck", // アクションチェック
  post_executeAction: url + "/executeAction", // アクション実行
  post_executeDiscard: url + "/executeDiscards", // ディスカード実行
}

const axiosClient = axios.create({
  // baseURL: baseUrl,
  withCredentials: true, // Cookie送信許可
  timeout: 5000, // 5000ms
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
})

// axiosGetFether
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await axiosClient.get<T>(url)
  return res.data
}
// axiosPostFether
export const postFetcher = async <T, V>(url: string, { arg }: { arg: V }): Promise<T> => {
  const res = await axiosClient.post<T>(url, arg)
  return res.data
}
