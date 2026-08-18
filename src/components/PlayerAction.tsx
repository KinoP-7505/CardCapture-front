import { useAxiosStore } from "@/tools/AxiosManager"
import { Box, Button, Stack } from "@chakra-ui/react"
import { PlayerActionSelect } from "./PlayerActionSelect"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { dataToInfo } from "@/tools/DataSetUtil"
import type { CardCaptureResponse } from "@/Types/CardCaptureResponse"
import useSWRMutation from "swr/mutation"
import { END_POINT, fetcher } from "@/tools/AxiosUtil"

export const PlayerAction: React.FC = () => {
  const axiosStore = useAxiosStore()
  const infoStore = useBattleInfoStore()
  const processState = infoStore.processState

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

    console.log("battleInfo:", axiosStore.battleInfo)

    axiosStore.addMessage("ゲーム開始：盤面作成")
  }

  return (
    <Box
      margin={1}
      border="3px solid black"
      p={1}
      h={"210px"}
      //   w="520px"
    >
      <Stack align="flex-start">
        {(() => {
          switch (processState) {
            case 0:
              // return <PlayerActionStart />
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

              break
            case 1:
              return (
                <Button h="36px" colorPalette="cyan">
                  ラウンド開始
                </Button>
              )
              break
            case 2:
              return <PlayerActionSelect />
            // return (
            //   <>
            //     <text>アクション選択</text>
            //     <Button h="36px" colorPalette="cyan">
            //       捕獲
            //     </Button>
            //     <Button h="36px" colorPalette="cyan">
            //       封印
            //     </Button>
            //     <Button h="36px" colorPalette="cyan">
            //       吹き飛ばし
            //     </Button>
            //   </>
            // )
            default:
              break
          }
        })()}
      </Stack>
    </Box>
  )
}
