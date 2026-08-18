import { useAxiosStore } from "@/tools/AxiosManager"
import { Box, Stack, Text } from "@chakra-ui/react"

/**
 * ゲーム情報コンポーネント
 * @returns ゲーム情報
 */
export const BattleInfo: React.FC = () => {
  const battleInfo = useAxiosStore((state) => state.battleInfo)

  const rounds = battleInfo.rounds === 0 ? "開始前" : battleInfo.rounds

  return (
    <Box
      margin={1}
      border="3px solid black"
      p={1}
      h={"210px"}
      //   w="520px"
    >
      <Stack align="flex-start">
        <Text>ラウンド：{rounds}</Text>
        <Text>EnemyDeck枚数：{battleInfo.enemyDeckSize}</Text>
        <Text>封印カード枚数：{battleInfo.sealDeckSize}</Text>
        <Text>PlayerDeck枚数：{battleInfo.playerDeckSize}</Text>
        <Text>Discards枚数：{battleInfo.discardSize}</Text>
      </Stack>
    </Box>
  )
}
