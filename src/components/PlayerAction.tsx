import { Box, Button, Stack, Text } from "@chakra-ui/react"
import { PlayerActionSelect } from "./PlayerActionSelect"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { dataToInfo } from "@/tools/DataSetUtil"
import type { CardCaptureResponse } from "@/Types/CardCaptureDto"
import useSWRMutation from "swr/mutation"
import { END_POINT, fetcher } from "@/tools/AxiosUtil"
import { PlayerActionDiscard } from "./PlayerActionDiscard"
import { STATE_PROCESS } from "@/tools/constants"
import { DialogNotice } from "./DialogNotice"

export const PlayerAction: React.FC = () => {
  const info = useBattleInfoStore()
  const processState = info.processState

  // SWRフックを作成
  const { trigger } = useSWRMutation<CardCaptureResponse>(END_POINT.get_startRound, fetcher)

  const handleStartRound = async () => {
    const result = await trigger()
    const toInfo = dataToInfo(result)
    console.log("handleStartRound")
    console.log(result)

    info.setEnemyArea(toInfo.enemyAreaCards)
    info.setPlayerHands(toInfo.playerHandCards)
    info.setBattleInfo(toInfo.battleInfo)
    info.setProcessState(toInfo.processState)

    let message = ""
    if (processState === 0) {
      message = "ゲーム開始：盤面作成"
      info.setActionState(0)
    } else if (processState === 1) {
      message = "カードドロー：Enemy Area、PlayerHands補充"
      info.setActionState(0)
    }
    info.addMessage(message)
  }

  const openDialogResult =
    info.processState === STATE_PROCESS.RESULT && info.gameState === STATE_PROCESS.PLAYING

  const dialogResultText =
    `【合計】残りEnemyCard ${info.battleInfo.enemyDeckSize + info.enemyArea.length} 枚` +
    "\n" +
    `EnemyDeck ${info.battleInfo.enemyDeckSize} 枚` +
    "\n" +
    `EnemyArea ${info.enemyArea.length} 枚`

  // ディスカードプロセス遷移
  const gotoDiscard = () => {
    // ディスカードプロセスへ
    info.setCardSelected(2)
    info.setProcessState(STATE_PROCESS.DISCARDS)
  }

  return (
    <Box
      margin={1}
      border="3px solid black"
      p={1}
      h={"210px"}
      display="flex"
      flexDirection="column"
      justifyContent="space-between" // 全体をバランスよく配置
      //   w="520px"
    >
      <Stack align="flex-start">
        {(() => {
          switch (processState) {
            case STATE_PROCESS.INIT:
              return (
                <>
                  <text>■ゲーム開始前</text>
                </>
              )
            case STATE_PROCESS.SETUP:
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
            case STATE_PROCESS.ACTION:
              return <PlayerActionSelect />
            case STATE_PROCESS.RESULT:
              return (
                <>
                  <Text>アクション結果</Text>
                  <Text>{info.winMessage}</Text>
                  {/* <Button
                    w="160px"
                    h="36px"
                    colorPalette="cyan"
                    onClick={() => {
                      // ディスカードプロセスへ
                      info.setCardSelected(2)
                      info.setProcessState(STATE_PROCESS.DISCARDS)
                    }}
                  >
                    ゲーム継続
                  </Button> */}
                </>
              )
            case STATE_PROCESS.DISCARDS:
              return <PlayerActionDiscard />
            default:
              break
          }
        })()}
      </Stack>
      <DialogNotice
        open={openDialogResult}
        title="ゲーム継続"
        btnText="OK"
        onOpenChange={(open) => {
          if (!open) gotoDiscard()
        }}
        onAnser={() => gotoDiscard()}
      >
        <Stack align="center">
          <Text
            // fontWeight="bold"
            fontSize={18} // カードサイズ(100px)に合わせて小さめに設定
            lineClamp={3} // 最大2行に制限（超えた場合は ... 表示）
            lineHeight="short" // 行間を詰めて収まりを良くする
            wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
            whiteSpace="pre-line" // \n を改行として処理）
          >
            {dialogResultText}
          </Text>
        </Stack>
      </DialogNotice>
    </Box>
  )
}
