import { Box, Grid, GridItem, Image, Stack } from "@chakra-ui/react"
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
import { useMemo, useState } from "react"
import useSWRMutation from "swr/mutation"
import { dataToInfo } from "@/tools/DataSetUtil"
import { STATE_PROCESS } from "@/tools/constants"
import gameStartImg from "../assets/Gemini_Generated_Image_titole.jpg"
import gameWinImg from "../assets/Gemini_Generated_Image_gameWin.jpg"
import gameDefeat from "../assets/Gemini_Generated_Image_gameDefeat.jpg"
import { DialogNotice } from "@/components/DialogNotice"

const GameBoard = () => {
  // const axiosStore = useAxiosStore();
  const info = useBattleInfoStore()
  const trumpDeck = info.trumpDeck
  // 状態がProcessStateの場合
  const isProcessState = useBattleInfoStore((state) => state.processState) === STATE_PROCESS.RESULT
  const gameState = useBattleInfoStore((state) => state.gameState)

  // タイトルダイアログ制御
  const [isOpen, setIsOpen] = useState(true)
  const dialogAnser = (ans: string) => {
    handleInitGame()
    console.log(`anser: ${ans}`)
  }

  // 結果ダイアログボタン制御
  const dialogFinishAnser = () => {
    info.setGameState(0)
    // info.setProcessState(0)
    setIsOpen(true)
  }
  // 結果ダイアログオープン制御
  const openResultMatch =
    isProcessState && (gameState === STATE_PROCESS.DEFEAT || gameState === STATE_PROCESS.WIN)
  // 結果ダイアログ表示制御
  const valueResultMatch = useMemo(() => {
    // ゲーム勝利の場合
    if (isProcessState) {
      if (gameState === STATE_PROCESS.WIN) {
        return {
          text: "全てのカードを捕獲・封印しました。おめでとうございます",
          img: gameWinImg,
        }
      } else if (gameState === STATE_PROCESS.DEFEAT) {
        return {
          text: "敗北しました。",
          img: gameDefeat,
        }
      }
      return {
        text: "",
        img: gameWinImg,
      }
    }
  }, [isProcessState, gameState])

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
  const initGameSWR = useSWRMutation<CardCaptureResponse>(END_POINT.get_initGame, fetcher)

  const handleInitGame = async () => {
    const result = await initGameSWR.trigger()
    const toInfo = dataToInfo(result)
    console.log("handleInitGame")
    console.log(result)

    // メッセージクリア
    info.setMessage("")

    info.setEnemyArea(toInfo.enemyAreaCards)
    info.setPlayerHands(toInfo.playerHandCards)
    info.setBattleInfo(toInfo.battleInfo)
    info.setProcessState(toInfo.processState)
    info.setGameState(toInfo.gameState)

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
      <DialogNotice
        open={isOpen}
        title="タイトル"
        btnText="ゲーム開始"
        onOpenChange={setIsOpen}
        onAnser={(e) => {
          dialogAnser(e)
          setIsOpen(false)
        }}
      >
        <Stack align="center">
          <Image
            src={gameStartImg}
            alt="タイトル画面"
            borderRadius={"md"}
            maxH={"400px"}
            objectFit={"cover"}
          />
        </Stack>
      </DialogNotice>
      <DialogNotice
        open={openResultMatch}
        title="結果表示"
        btnText="タイトル画面"
        onOpenChange={(open) => {
          if (!open) dialogFinishAnser()
        }}
        onAnser={() => {
          dialogFinishAnser()
          // setIsOpenDefeat(false)
          // ゲームタイトルに移動するなど
        }}
      >
        <Stack align="center">
          <Image
            src={valueResultMatch?.img}
            alt="結果表示"
            borderRadius={"md"}
            maxH={"400px"}
            objectFit={"cover"}
          />
        </Stack>

        {valueResultMatch?.text}
      </DialogNotice>
    </Box>
  )
}
export default GameBoard
