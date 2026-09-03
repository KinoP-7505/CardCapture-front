import { END_POINT, postFetcher } from "@/tools/AxiosUtil"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { dataToInfoDiscard } from "@/tools/DataSetUtil"
import type { CardCaptureRequest, CardCaptureResponse } from "@/Types/CardCaptureDto"
import { Button, Text } from "@chakra-ui/react"
import useSWRMutation from "swr/mutation"

/**
 * ディスカード選択コンポーネント
 */
export const PlayerActionDiscard = () => {
  const info = useBattleInfoStore()
  const pHands = info.playerHands
  const addMessage = info.addMessage

  // SWRフックを作成
  // const { trigger, isMutating } = useSWRMutation<
  const { trigger } = useSWRMutation<CardCaptureResponse, Error, string, CardCaptureRequest>(
    END_POINT.post_executeDiscard, // ディスカード
    postFetcher,
  )

  // ディスカード処理送信
  const handleDiscard = async () => {
    // フィルタしたCARD配列からcode配列を作成
    const selected: number[] = pHands.filter((card) => card.selected).map((card) => card.code)
    // 選択カードを捨て場に移動
    const reqeest: CardCaptureRequest = {
      actionCode: 5, // ディスカードアクション
      targetEnemy: 0, // 敵カードの選択なし
      selected, // 選択カードを送信
    }
    const res = await trigger(reqeest)
    console.log("haddleActionExcecute response")
    console.log(res)

    // store更新（ディスカード反映）
    const toInfo = dataToInfoDiscard(res)
    info.setProcessState(toInfo.processState) // セットアップフェイスへ戻る
    info.setPlayerHands(toInfo.playerHandCards)
    info.setCardSelected(0) // 選択状態OFF
    // battleInfoをコピーしてstore更新
    info.setBattleInfo({
      ...info.battleInfo,
      discardSize: toInfo.discardSize, //捨て場枚数
      rounds: toInfo.battleInfo.rounds, // ラウンド更新
    })

    // 手札選択数が0より大きい場合
    if (selected.length > 0) {
      addMessage("ディスカード：選択カードを破棄しました。")
    } else {
      addMessage("ディスカード：選択カード０枚、破棄しませんでした。")
    }
  }

  return (
    <>
      <Text>ディスカードフェイズ</Text>
      <Text>選択した手札を破棄します。</Text>
      <Button
        w="160px"
        h="36px"
        colorPalette="cyan"
        onClick={() => {
          // ディスカード処理
          handleDiscard()
        }}
      >
        カード破棄
      </Button>
    </>
  )
}
