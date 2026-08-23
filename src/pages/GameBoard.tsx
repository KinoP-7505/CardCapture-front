import { Box, Grid, GridItem } from "@chakra-ui/react"
import "./GameBoard.css"
import { END_POINT, fetcher } from "@/tools/AxiosUtil"
import useSWR from "swr"
import { EnemyArea } from "@/components/EnemyArea"
import { BattleInfo } from "@/components/BattleInfo"
import { PlayerHands } from "@/components/PlayerHands"
import { PlayerAction } from "@/components/PlayerAction"
import { MessageInfo } from "@/components/MessageInfo"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import type { CardCaptureResponse, InitAppResponse } from "@/Types/CardCaptureDto"
import { DialogConfirm } from "@/components/DialogConfirm"
import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { dataToInfo } from "@/tools/DataSetUtil"

const GameBoard = () => {
  // const axiosStore = useAxiosStore();
  const info = useBattleInfoStore()
  const trumpDeck = info.trumpDeck

  const [isOpen, setIsOpen] = useState(true)
  const dialogAnser = (ans: string) => {
    handleStartRound()
    console.log(`anser: ${ans}`)
  }

  const [isOpenDefeat, setIsOpenDefeat] = useState(false)

  const shouldFetch = trumpDeck.size === 0

  // 画面表示時に呼び出し
  useSWR<InitAppResponse>(shouldFetch ? END_POINT.get_initApp : null, fetcher, {
    onSuccess: (data) => {
      console.log("GET通信成功:", data)
      info.setTrumpDeck(data.trumpDeck)
      info.addMessage("トランプカードを受信しました。")
    },
  })

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

    info.addMessage("ゲーム開始：盤面作成")
  }

  return (
    <Box
      w="800px"
      h="auto"
      minW="800px"
      maxW="800px"
      minH="680px"
      maxH="760px"
      p={0}
      bg="floralwhite"
      boxSizing="border-box"
    >
      <Grid
        w="100%"
        h="100vh"
        templateColumns="2fr 1fr"
        templateRows="220px 220px 240px"
        gap="0"
        rowGap={0}
        columnGap={0}
        p={0}
        m={0}
        boxSizing="border-box"
      >
        {/* 左上 EnemyArea */}
        <GridItem gridColumn="1" gridRow="1" overflow="hidden">
          <EnemyArea />
        </GridItem>

        {/* 右上 BattleInfo */}
        <GridItem gridColumn="2" gridRow="1" overflow="hidden">
          <BattleInfo />
        </GridItem>

        {/* 中段左：PlayerHands */}
        <GridItem gridColumn="1" gridRow="2" overflow="hidden">
          <PlayerHands />
        </GridItem>

        {/* 中段右：PlayerAction */}
        <GridItem gridColumn="2" gridRow="2" overflow="hidden">
          <PlayerAction />
        </GridItem>

        {/* ログエリア */}
        <GridItem gridColumn="1 / -1" gridRow="3" p="1" overflow="hidden" w="100%" h="100%">
          <MessageInfo />
        </GridItem>
      </Grid>
      <DialogConfirm
        open={isOpen}
        title="タイトル"
        onOpenChange={setIsOpen}
        onAnser={(e) => {
          dialogAnser(e)
          setIsOpen(false)
        }}
        // confirmText="破棄する"
        // onConfirm={handleExecute}
      >
        ゲーム開始
      </DialogConfirm>
      <DialogConfirm
        open={isOpenDefeat}
        title="タイトル"
        onOpenChange={setIsOpenDefeat}
        onAnser={(e) => {
          dialogAnser(e)
          setIsOpen(false)
        }}
        // confirmText="破棄する"
        // onConfirm={handleExecute}
      >
        ゲーム敗北
      </DialogConfirm>
    </Box>
  )
}
export default GameBoard
