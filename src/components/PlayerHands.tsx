import { Box, Flex, Text } from "@chakra-ui/react"
import { CardItem } from "./CardItem"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import type { GameCard } from "@/Types/AppTypes"
import { STATE_ACTION, STATE_PROCESS } from "@/tools/constants"

export const PlayerHands = () => {
  const title = "Player\nCard"

  const info = useBattleInfoStore()
  const playerHands = info.playerHands
  // 選択済枚数
  const selectedSize = playerHands.filter((card) => card.selected).length
  // EnemyCard選択済み
  const isSelectedEnemy = info.selectedEnemyCard > 0
  // アクション（捕獲|封印|吹き飛ばし）、または、ディスカートの場合、選択可能
  const canSelected =
    (info.processState === STATE_PROCESS.ACTION &&
      (info.actionState === STATE_ACTION.CAPTURE ||
        info.actionState === STATE_ACTION.SEAL ||
        info.actionState === STATE_ACTION.BLOWOUT)) ||
    info.processState === STATE_PROCESS.DISCARDS

  const act = info.actionState

  // カードの選択状態更新
  const toggleSelected = (card: GameCard, index: number) => {
    const enemySuit = Math.trunc(info.selectedEnemyCard / 100)
    const pSuit = card.suit
    const isJoker = card.isJoker // ジョーカー判定

    console.log(`toggleSelected act=${act} eCard=${info.selectedEnemyCard} pSuit=${pSuit}`)

    // ディスカードプロセスの場合
    if (info.processState === STATE_PROCESS.DISCARDS) {
      // ディスカードの場合、複数選択
      info.toggleHandsMultiSelected(index, card.selected)
    } else {
      // それ以外はアクションプロセス
      if (act === STATE_ACTION.CAPTURE) {
        // １．選択状態である、かつ、
        // ２．敵カードが選択中である、かつ、
        // ３．クリックしたカードが選択中敵カードのスートと一致する、かつ、数字であること
        //     ジョーカーの場合、選択中カードが１枚以上
        if (isSelectedEnemy) {
          // ジョーカー選択判定
          const isSelectedJoker = isJoker && selectedSize > 0
          // 選択判定判定
          if (enemySuit === pSuit || isSelectedJoker) {
            // スート選択
            console.log("call toggleHandsMultiSelected")
            // カードの選択状態を引数に設定
            info.toggleHandsMultiSelected(index, card.selected)
          }
        }
      } else if (act === STATE_ACTION.SEAL) {
        // 封印アクション
        // 対象が未選択のとき
        if (isSelectedEnemy && !card.selected) {
          info.toggleHandsSingleSelected(index)
        }
      } else if (act === STATE_ACTION.BLOWOUT) {
        // 吹き飛ばしアクション
        // Enemyカード選択済み、かつ、数字カードの場合
        if (isSelectedEnemy && card.isNumberCard) {
          // 手札2枚選択済みの場合、かつ、対象が未選択の場合、更新しない
          if (selectedSize === 2 && !card.selected) return
          // 上記以外の場合、カードの選択状態更新
          // ジョーカーは選択できないため、ジョーカー解除なし
          info.toggleHandsMultiSelected(index, false)
        }
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
              topLabel=" "
              selected={card.selected}
              onClick={() => {
                // アクション選択時、選択可能
                if (canSelected) {
                  toggleSelected(card, index)
                }
              }}
            />
          )
        })}
      </Flex>
    </Box>
  )
}
