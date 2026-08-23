import { Box, Button, Stack, Text } from "@chakra-ui/react"
import { PlayerActionSelect } from "./PlayerActionSelect"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { dataToInfo } from "@/tools/DataSetUtil"
import type { CardCaptureResponse } from "@/Types/CardCaptureDto"
import useSWRMutation from "swr/mutation"
import { END_POINT, fetcher } from "@/tools/AxiosUtil"
import { PlayerActionDiscard } from "./PlayerActionDiscard"

export const PlayerAction: React.FC = () => {
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

    let message = ""
    if (processState === 0) {
      message = "ゲーム開始：盤面作成"
    } else if (processState === 1) {
      message = "カードドロー：Enemy Area、PlayerHands補充"
    }
    infoStore.addMessage(message)
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
              return (
                <>
                  <text>■ゲーム開始前</text>
                  {/* <Button
                    w="160px"
                    h="36px"
                    colorPalette="cyan"
                    onClick={() => {
                      // ラウンド１処理を行う
                      handleStartRound()
                    }}
                  >
                    ゲーム開始
                  </Button> */}
                </>
              )
            case 1:
              return (
                <>
                  <Text>■セットアップ</Text>
                  <Text>EnemyArea補充</Text>
                  <Text>PlayerHands補充</Text>
                  <Button
                    w="160px"
                    h="36px"
                    colorPalette="cyan"
                    onClick={() => {
                      // セットアップ処理
                      handleStartRound()
                    }}
                  >
                    開始
                  </Button>
                </>
              )
            case 2:
              return <PlayerActionSelect />
            case 3:
              return (
                <>
                  <Text>アクション結果</Text>
                  <Text>{infoStore.winMessage}</Text>
                  <Button
                    w="160px"
                    h="36px"
                    colorPalette="cyan"
                    onClick={() => {
                      // ディスカードプロセスへ
                      infoStore.setCardSelected(2)
                      infoStore.setProcessState(4)
                    }}
                  >
                    ゲーム継続
                  </Button>
                </>
              )
            case 4:
              return <PlayerActionDiscard />
            default:
              break
          }
        })()}
      </Stack>
    </Box>
  )
}
