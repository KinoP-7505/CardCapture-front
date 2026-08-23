import { END_POINT, postFetcher } from "@/tools/AxiosUtil"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { dataToInfoAct } from "@/tools/DataSetUtil"
import type { CardCaptureRequest, CardCaptureResponse } from "@/Types/CardCaptureDto"
import { Badge, Button, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import useSWRMutation from "swr/mutation"

export const PlayerActionSelect = () => {
  const info = useBattleInfoStore()

  // SWRフックを作成
  // const { trigger, isMutating } = useSWRMutation<
  const { trigger } = useSWRMutation<CardCaptureResponse, Error, string, CardCaptureRequest>(
    END_POINT.post_executeAction,
    postFetcher,
  )

  // アクション実行（POST）
  const haddleActionExcecute = async () => {
    // フィルタしたCARD配列からcode配列を作成
    const selected: number[] = info.playerHands
      .filter((card) => card.selected)
      .map((card) => card.code)
    const reqeest: CardCaptureRequest = {
      actionCode: act,
      targetEnemy: info.selectedEnemyCard,
      selected,
    }
    const res = await trigger(reqeest)
    console.log("haddleActionExcecute response")
    console.log(res)

    const toInfo = dataToInfoAct(res)
    // store更新
    info.setEnemyArea(toInfo.enemyAreaCards)
    info.setPlayerHands(toInfo.playerHandCards)
    info.setProcessState(toInfo.processState)
    info.setWinMessage(toInfo.winMessage)
    info.setCardSelected(0) // 選択状態OFF
    // battleInfoをコピーしてstore更新
    info.setBattleInfo({
      ...info.battleInfo,
      discardSize: toInfo.discardSize,
      sealAreaSize: toInfo.sealAreaSize,
    })

    if (act === 2) {
      info.addMessage("封印アクション：敵カード、手札を封印エリアに送りました。")
    }
  }

  // const spCards = info.selectedPlayerCard

  const [phase, setPhase] = useState<number>(0)
  const act = info.actionState

  const [text1, setText1] = useState<string>("")

  // アクション選択へ戻る
  const actionReturn = () => {
    setPhase(0)
    info.setActionState(0)
    // 選択カードリセット
    info.resetSelected()
    console.log("アクション選択 戻る")
  }

  // アクション選択ボタン非活性判定
  // 手札が全て絵札
  const isHandsAllFace = (): boolean => {
    const numberCards = info.playerHands.filter((card) => card.isNumberCard)

    return numberCards.length === 0
  }
  // 捕獲ボタン
  const disabledCaptureBtn = isHandsAllFace()
  // 封印ボタン：絵札の場合、非活性
  const disabledSealBtn: boolean = info.enemyArea[0].isFace || isHandsAllFace()
  // 吹き飛ばしボタン
  const disabledBlowBtn: boolean = isHandsAllFace()

  // 敵カード数値
  const numberEnemyCard = info.selectedEnemyCard % 100
  // 決定ボタン活性判定
  const executeButtonDisabled = () => {
    const seleted = info.playerHands.filter((card) => card.selected === true)
    // 捕獲の場合
    if (act === 1) {
      // カード未選択の場合は非活性
      if (seleted.length === 0 || numberEnemyCard === 0) return true
      // 捕獲ACTの場合、選択合計が敵数値以上の場合、活性
      return !(info.sumSelectedHands >= numberEnemyCard)
    } else if (act === 2) {
      // 封印の場合、手札１枚選択されていれば活性
      return seleted.length !== 1
    } else if (act === 3) {
      // Enemyカード未選択の場合は非活性
      if (numberEnemyCard === 0) return true
      // 手札２枚選択されていれば活性
      return seleted.length !== 2
    }
  }

  // 投了選択
  const handleDefete = () => {
    // 敗北状態に
    info.setProcessState(9)
  }

  // バッヂ判定
  // 手札選択数
  const numSelectedHands = info.playerHands.filter((card) => card.selected).length
  const showBadge1 = info.selectedEnemyCard === 0 ? "outline" : "solid"
  const showBadge2 = info.sumSelectedHands === 0 ? "outline" : "solid"
  const showBadge3 =
    numberEnemyCard > 0 && info.sumSelectedHands >= numberEnemyCard ? "solid" : "outline"
  const showBadge_2_1 = executeButtonDisabled() ? "outline" : "solid"
  const showBadge_3_1 = numSelectedHands === 2 ? "solid" : "outline"

  // ボタンHサイズ
  const btnSizeH = "32px"
  const btnSizeW = "100px"

  return (
    <>
      {(() => {
        switch (phase) {
          case 0:
            return (
              <>
                <text>アクション選択</text>
                <Button
                  w={btnSizeW}
                  h={btnSizeH}
                  colorPalette="cyan"
                  disabled={disabledCaptureBtn}
                  onClick={() => {
                    info.setCardSelected(1) // カード選択状態(複数)
                    info.setActionState(1)
                    setPhase(1)
                    setText1("「対象Enemy」を選択後\n手札の「捕獲カード」を選択")
                  }}
                >
                  捕獲
                </Button>
                <Button
                  w={btnSizeW}
                  h={btnSizeH}
                  colorPalette="cyan"
                  disabled={disabledSealBtn}
                  onClick={() => {
                    info.setCardSelected(2) // カード選択状態(1枚)
                    info.setActionState(2)
                    setPhase(1)
                    setText1("ENEMY TOPカードが対象です。\n手札カード１枚を選択")
                    // EnemyカードにTOPカードをセット
                    info.toggleCaptureEnemySelected(0)
                  }}
                >
                  封印
                </Button>
                <Button
                  w={btnSizeW}
                  h={btnSizeH}
                  colorPalette="cyan"
                  disabled={disabledBlowBtn}
                  onClick={() => {
                    info.setCardSelected(3) // カード選択状態(2枚)
                    info.setActionState(3)
                    setPhase(1)
                    setText1("「対象Enemy」を選択後\n手札カード２枚を選択")
                  }}
                >
                  吹き飛ばし
                </Button>
                <Button
                  w={btnSizeW}
                  h={btnSizeH}
                  colorPalette="cyan"
                  onClick={() => {
                    info.setActionState(4)
                    setPhase(1)
                    setText1("投了します。")
                  }}
                >
                  投了
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
                <Button
                  w="160px"
                  h="36px"
                  colorPalette="cyan"
                  disabled={executeButtonDisabled()}
                  onClick={() => {
                    console.log("haddleActionExcecute onClick")
                    if (info.actionState === 4) {
                      // 投了処理
                      handleDefete()
                    }
                    haddleActionExcecute()
                  }}
                >
                  決定
                </Button>
                <Button w="160px" h="36px" colorPalette="cyan" onClick={() => actionReturn()}>
                  戻る
                </Button>
                {(() => {
                  switch (act) {
                    case 1:
                      // 捕獲バッヂ表示
                      return (
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
                      )
                    case 2:
                      // 封印バッヂ表示
                      return (
                        <Stack direction="row">
                          <Badge colorPalette={"blue"} variant={showBadge_2_1}>
                            封印ＯＫ
                          </Badge>
                        </Stack>
                      )
                    case 3:
                      // 吹き飛ばしバッヂ表示
                      return (
                        <Stack direction="row">
                          <Badge colorPalette={"red"} variant={showBadge1}>
                            敵選択ＯＫ
                          </Badge>
                          <Badge colorPalette={"blue"} variant={showBadge_3_1}>
                            手札選択ＯＫ
                          </Badge>
                        </Stack>
                      )
                  }
                })()}
              </>
            )
          default:
            break
        }
      })()}
    </>
  )
}
