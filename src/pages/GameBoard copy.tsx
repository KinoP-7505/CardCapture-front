import { Box, Grid, GridItem } from "@chakra-ui/react"
import "./GameBoard.css"
import { useAxiosStore } from "@/tools/AxiosManager"
import { END_POINT, fetcher } from "@/tools/AxiosUtil"
import type { InitAppResponse } from "@/Types/InitAppResponse"
import useSWR from "swr"
import { EnemyArea } from "@/components/EnemyArea"
import { BattleInfo } from "@/components/BattleInfo"
import { PlayerHands } from "@/components/PlayerHands"
import { PlayerAction } from "@/components/PlayerAction"
import { PlayerInfo } from "@/components/PlayerInfo"

const GameBoard = () => {
  // const axiosStore = useAxiosStore();
  const trumpDeck = useAxiosStore((state) => state.trumpDeck)
  const setTrumpDeck = useAxiosStore((state) => state.setTrumpDeck)
  const addMessage = useAxiosStore((state) => state.addMessage)

  const shouldFetch = trumpDeck.size === 0

  // 画面表示時に呼び出し
  useSWR<InitAppResponse>(shouldFetch ? END_POINT.get_initApp : null, fetcher, {
    onSuccess: (data) => {
      console.log("GET通信成功:", data)
      setTrumpDeck(data.trumpDeck)
      addMessage("トランプカードを受信しました。")
    },
  })

  return (
    <Box
      w="800px"
      h="800px"
      minW="800px"
      maxW="800px"
      minH="800px"
      maxH="800px"
      p={3}
      bg="floralwhite"
    >
      <Grid
        w="800px"
        h="600px"
        templateColumns="2fr 1fr"
        templateRows="1fr 1fr 100px"
        gap="2"
        p="2"
        boxSizing="border-box"
      >
        {/* EnemyArea */}
        <GridItem
          colSpan={1}
          rowSpan={1}
          // bg="orange.700"
          // color="white"
          // p="4"
          overflow="hidden"
        >
          <EnemyArea />
        </GridItem>

        {/* PlayerHands */}
        <GridItem
          colSpan={1}
          rowSpan={1}
          // bg="blue.500"
          // color="white"
          // p="4"
          overflow="hidden"
        >
          <PlayerHands />
        </GridItem>

        {/* 情報エリア */}
        <GridItem
          colSpan={1}
          rowSpan={1}
          // bg="#fdfbf7"
          // border="3px solid black"
          // p="4"
          overflow="hidden"
        >
          <BattleInfo />
        </GridItem>

        {/* アクションエリア */}
        <GridItem
          colSpan={1}
          rowSpan={1}
          bg="#fdfbf7"
          border="3px solid black"
          p="4"
          overflow="hidden"
        >
          <PlayerAction />
        </GridItem>

        {/* ログエリア */}
        <GridItem
          colSpan={2}
          rowSpan={1}
          // bg="#fdfbf7"
          border="3px solid black"
          p="4"
          // overflow="hidden"
          // display="flex"
          // alignItems="center"
          justifyContent="center"
        >
          <PlayerInfo />
        </GridItem>
      </Grid>

      {/* <Stack direction="column" gap={0} align="stretch">
        <BattlePanel />

        <PlayerPanel />

        <MessageInfo />

        {/* 
        <BattleInfo />

        <EnemyArea /> 

        <PlayerInfo />

         <PlayerHands />
       </Stack> */}
    </Box>
  )
}

export default GameBoard
