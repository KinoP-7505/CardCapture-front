import { Box, Flex, Text } from "@chakra-ui/react"
import { CardItem } from "./CardItem"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import type { GameCard } from "@/Types/AppTypes"

export const PlayerHands = () => {
  const title = "Player\nCard"

  const info = useBattleInfoStore()
  const playerHands = info.playerHands
  const canSelected = info.cardSelected

  const toggleSelected = (index: number) => {
    const enemySuit = Math.trunc(info.selectedEnemyCard / 100)
    const pSuit = playerHands[index].suit
    // １．選択状態である、かつ、
    // ２．敵カードが選択中である、かつ、
    // ３．クリックしたカードが選択中敵カードのスートと一致する
    //     ジョーカーの場合、選択中カードが１枚以上
    if (canSelected && info.selectedEnemyCard > 0) {
      console.log(
        `info.selectedEnemyCard  : ${info.selectedEnemyCard}` +
          `enemySuit : ${enemySuit}` +
          `pSuit : ${pSuit}`,
      )
      // ジョーカー選択判定
      const isSelectedJoker = pSuit === 5 && info.selectedPlayerCard.length > 0
      // 選択判定判定
      if (enemySuit === pSuit || isSelectedJoker) {
        // スート選択
        info.toggleHandsSelected(index)
      }
    }
  }

  return (
    <Box h="220px" bg="#5B97CF" p={4}>
      <Text color="white" fontWeight="bold" mb={4}>
        PlayerHands
      </Text>

      <Flex gap={4}>
        {playerHands.map((card: GameCard, index) => {
          const cardKey = "ph-" + card.code

          return (
            <CardItem
              key={cardKey}
              title={title}
              suit={card.suit}
              num={card.number}
              bg="#CFF8FF"
              selected={card.selected}
              onClick={() => {
                toggleSelected(index)
              }}
            />
          )
        })}
      </Flex>
    </Box>
  )
}
