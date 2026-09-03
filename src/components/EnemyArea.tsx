import { Box, Flex, Text } from "@chakra-ui/react"
import { CardItem } from "./CardItem"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import type { GameCard } from "@/Types/AppTypes"
import { STATE_ACTION, STATE_PROCESS } from "@/tools/constants"

export const EnemyArea: React.FC = () => {
  const cardTiitle = "Enemy\nCard"

  // const axiossStore = useAxiosStore()
  const info = useBattleInfoStore()
  const enemyArea = info.enemyArea
  // アクション（捕獲|吹き飛ばし）の場合、選択可能
  const canSelected =
    info.processState === STATE_PROCESS.ACTION &&
    (info.actionState === STATE_ACTION.CAPTURE || info.actionState === STATE_ACTION.BLOWOUT)

  // Enemyカード選択処理
  const handleToggleEnemySelected = (index: number) => {
    console.log(`handleToggleEnemySelected index = ${index}`)
    // 選択状態を変更
    info.toggleCaptureEnemySelected(index)
    // PlayerHandsを全未選択に設定
    info.resetSelectedPlayer()
  }

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
                // 捕獲|吹き飛ばしアクションの場合
                if (canSelected) {
                  const nowSelected = info.selectedEnemyCard
                  // 選択カードが現在選択と異なる場合
                  if (card.code !== nowSelected) {
                    handleToggleEnemySelected(index)
                    // info.toggleCaptureEnemySelected(index)
                  }
                }
              }}
            />
          )
        })}
      </Flex>
    </Box>
  )
}
