import { Box, Flex, Text } from "@chakra-ui/react"
import { CardItem } from "./CardItem"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import type { GameCard } from "@/Types/AppTypes"

export const EnemyArea: React.FC = () => {
  const cardTiitle = "Enemy\nCard"

  // const axiossStore = useAxiosStore()
  const info = useBattleInfoStore()
  const enemyArea = info.enemyArea
  const canSelected = info.cardSelected
  const act = info.actionState

  return (
    <Box h="220px" bg="#C95C0C" p={4}>
      <Text color="white" fontWeight="bold" mb={4}>
        EnemyArea
      </Text>

      <Flex gap={4}>
        {enemyArea.map((card: GameCard, index) => {
          const cardKey = "ea-" + card.code
          return (
            <CardItem
              key={cardKey}
              title={cardTiitle}
              suit={card.suit}
              num={card.number}
              bg="#ffeacf"
              topLabel={index === 0 ? "TOP CARD" : ""}
              selected={card.selected}
              onClick={() => {
                if (canSelected && act === 1) {
                  // 選択中、かつ、捕獲アクションの場合
                  info.toggleCaptureEnemySelected(index)
                }
              }}
            />
          )
        })}
      </Flex>
    </Box>
  )
}
