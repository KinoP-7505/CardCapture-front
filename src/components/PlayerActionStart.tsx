import { END_POINT, fetcher } from "@/tools/AxiosUtil"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { dataToInfo } from "@/tools/DataSetUtil"
import type { CardCaptureResponse } from "@/Types/CardCaptureDto"
import { Button } from "@chakra-ui/react"
import useSWRMutation from "swr/mutation"

export const PlayerActionStart = () => {
  const infoStore = useBattleInfoStore()

  // SWRフックを作成
  const { trigger } = useSWRMutation<CardCaptureResponse>(END_POINT.get_startRound, fetcher)

  const handleStartRound = async () => {
    const result = await trigger()
    const toInfo = dataToInfo(result)
    console.log("handleStartRound")
    console.log(result)

    infoStore.setEnemyArea(toInfo.enemyAreaCards)
    infoStore.setPlayerHands(toInfo.playerHandCards)
    infoStore.setBattleInfo(toInfo.battleInfo)
    infoStore.setProcessState(toInfo.processState)

    infoStore.addMessage("ゲーム開始：盤面作成")
  }

  return (
    <>
      <text>ゲーム開始前</text>
      <Button
        w="160px"
        h="36px"
        colorPalette="cyan"
        onClick={() => {
          // ラウンド１処理を行う
          handleStartRound()
        }}
      >
        ゲーム開始
      </Button>
    </>
  )
}
