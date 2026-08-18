import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { Badge, Button, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"

export const PlayerActionSelect = () => {
  const info = useBattleInfoStore()
  const spCards = info.selectedPlayerCard

  const [phase, setPhase] = useState<number>(0)
  const [act, setAct] = useState<number>(0)

  const [text1, setText1] = useState<string>("")

  // アクション選択へ戻る
  const actionReturn = () => {
    setPhase(0)
    setAct(0)
    // 選択カードリセット
    info.resetSelected()
    console.log("アクション選択 戻る")
  }

  // 選択カードの数値を取得（ジョーカー考慮）
  const numberCard = (code: number) => {
    const suit = Math.trunc(code / 100)
    // ジョーカーの場合
    if (suit === 5) {
      // 選択中カードの最大数字を取得
      const maxNum = spCards.reduce((cMax, c) => {
        const pSuit = Math.trunc(c / 100)
        if (pSuit != 5) {
          const pNumber = c % 100
          return Math.max(cMax, pNumber)
        }
        return cMax
      }, 0)
      // ジョーカーの数字（選択中の最大値）を返却
      return maxNum
    }
    // ジョーカー以外は数字を返却
    return code % 100
  }
  const sumSelectedCard = spCards.reduce((sum, cardCode) => sum + numberCard(cardCode), 0)
  // 敵カード数値
  const numberEnemyCard = info.selectedEnemyCard % 100
  // 決定ボタン活性判定
  const executeButtonDisabled = () => {
    // 捕獲の場合
    if (act === 1) {
      // カード未選択の場合は非活性
      if (sumSelectedCard === 0 || numberEnemyCard === 0) return true
      // 捕獲ACTの場合、選択合計が敵数値以上の場合、活性false
      return !(sumSelectedCard >= numberEnemyCard)
    }
  }

  // バッヂ判定
  const showBadge1 = info.selectedEnemyCard === 0 ? "outline" : "solid"
  const showBadge2 = info.sumSelectedHands === 0 ? "outline" : "solid"
  const showBadge3 =
    numberEnemyCard > 0 && info.sumSelectedHands >= numberEnemyCard ? "solid" : "outline"

  return (
    <>
      {(() => {
        switch (phase) {
          case 0:
            return (
              <>
                <text>アクション選択</text>
                <Button
                  h="36px"
                  colorPalette="cyan"
                  onClick={() => {
                    info.setCardSelected(true)
                    setAct(1)
                    setPhase(1)
                    setText1("「対象Enemy」を選択後\n手札の「捕獲カード」を選択")
                    // setText2("手札の「捕獲カード」を選択")

                    console.log(
                      "アクション選択 捕獲  :  batteleInfo.setCardSelected :" + info.cardSelected,
                    )
                  }}
                >
                  捕獲
                </Button>
                <Button h="36px" colorPalette="cyan" onClick={() => setAct(2)}>
                  封印
                </Button>
                <Button h="36px" colorPalette="cyan">
                  吹き飛ばし
                </Button>
              </>
            )
            break
          case 1:
            return (
              <>
                <Text
                  // fontWeight="bold"
                  fontSize="md" // カードサイズ(100px)に合わせて小さめに設定
                  lineClamp={3} // 最大2行に制限（超えた場合は ... 表示）
                  lineHeight="short" // 行間を詰めて収まりを良くする
                  wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
                  whiteSpace="pre-line" // \n を改行として処理）
                >
                  {text1}
                </Text>
                {/* <text>{text2}</text> */}
                <Button w="160px" h="36px" colorPalette="cyan" disabled={executeButtonDisabled()}>
                  決定
                </Button>
                <Button w="160px" h="36px" colorPalette="cyan" onClick={() => actionReturn()}>
                  戻る
                </Button>
                <Stack direction="row">
                  <Badge colorPalette={"red"} variant={showBadge1}>
                    敵選択ＯＫ
                  </Badge>

                  <Badge colorPalette={"blue"} variant={showBadge2}>
                    手札選択ＯＫ
                  </Badge>
                  <Badge colorPalette={"blue"} variant={showBadge3}>
                    捕獲ＯＫ
                  </Badge>
                </Stack>
              </>
            )
            break
          case 2:
            return (
              <>
                <text>アクション選択</text>
                <Button h="36px" colorPalette="cyan">
                  捕獲
                </Button>
                <Button h="36px" colorPalette="cyan">
                  封印
                </Button>
                <Button h="36px" colorPalette="cyan">
                  吹き飛ばし
                </Button>
              </>
            )
          default:
            break
        }
      })()}
    </>
  )
}
