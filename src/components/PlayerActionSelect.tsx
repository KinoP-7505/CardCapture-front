import { END_POINT, postFetcher } from "@/tools/AxiosUtil"
import { useBattleInfoStore } from "@/tools/BattleInfoManager"
import { STATE_ACTION, STATE_PCARD_SELECTED, STATE_PROCESS } from "@/tools/constants"
import { dataToInfoAct } from "@/tools/DataSetUtil"
import type { CardCaptureRequest, CardCaptureResponse } from "@/Types/CardCaptureDto"
import { Badge, Button, Stack, Text, Tooltip } from "@chakra-ui/react"
import { useState } from "react"
import useSWRMutation from "swr/mutation"

/**
 * アクション選択コンポーネント
 */
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
    info.setGameState(toInfo.gameState)
    info.setWinMessage(toInfo.winMessage)
    info.setCardSelected(0) // 選択状態OFF
    // battleInfoをコピーしてstore更新
    info.setBattleInfo({
      ...info.battleInfo,
      discardSize: toInfo.discardSize,
      sealAreaSize: toInfo.sealAreaSize,
      enemyDeckSize: toInfo.enemyDeckSize,
    })

    switch (act) {
      case STATE_ACTION.CAPTURE:
        info.addMessage("捕獲アクション：敵カード、手札を廃棄エリアに送りました。")
        break
      case STATE_ACTION.SEAL:
        info.addMessage("封印アクション：敵カード、手札１枚を封印エリアに送りました。")
        break
      case STATE_ACTION.BLOWOUT:
        info.addMessage(
          "吹き飛ばしアクション：敵カードをデッキ最下、手札２枚を封印エリアに送りました。",
        )
    }
  }

  // 選択、決定状態
  const [phase, setPhase] = useState<number>(STATE_ACTION.SELECTED)
  const act = info.actionState

  const [text1, setText1] = useState<string>("")

  // アクション選択へ戻る
  const actionReturn = () => {
    setPhase(STATE_ACTION.SELECTED)
    info.setActionState(0)
    // 選択カードリセット
    info.resetSelected()
    console.log("アクション選択 戻る")
  }

  // アクション選択ボタン非活性判定
  // 手札が全て絵札
  const isHandsAllFace = (): boolean => {
    const countFaceCards = info.playerHands.filter((card) => card.isFace).length
    // 手札枚数と絵札数が一致する場合、ALL絵札
    return info.playerHands.length === countFaceCards
  }
  // 捕獲ボタン
  const disabledCaptureBtn = isHandsAllFace()

  // 封印ボタン：絵札の場合、非活性
  const disabledSealBtn =
    info.enemyArea.length > 0 && (info.enemyArea[0].isFace || isHandsAllFace())
  // 吹き飛ばしボタン
  const disabledBlowBtn: boolean = isHandsAllFace()

  // 敵カード数値
  const numberEnemyCard = info.selectedEnemyCard % 100
  // 決定ボタン活性判定
  const disabledButtonExecute = () => {
    const seleted = info.playerHands.filter((card) => card.selected === true)
    // 捕獲の場合
    if (act === STATE_ACTION.CAPTURE) {
      // カード未選択の場合は非活性
      if (seleted.length === 0 || numberEnemyCard === 0) return true
      // 捕獲ACTの場合、選択合計が敵数値以上の場合、活性
      return !(info.sumSelectedHands >= numberEnemyCard)
    } else if (act === STATE_ACTION.SEAL) {
      // 封印の場合、手札１枚選択されていれば活性
      return seleted.length !== 1
    } else if (act === STATE_ACTION.BLOWOUT) {
      // Enemyカード未選択の場合は非活性
      if (numberEnemyCard === 0) return true
      // 手札２枚選択されていれば活性
      return seleted.length !== 2
    }
  }

  // 投了選択
  const handleDefete = () => {
    // 敗北状態に
    info.setProcessState(STATE_PROCESS.RESULT)
    info.setGameState(STATE_PROCESS.DEFEAT)
  }

  // バッヂ判定
  // 手札選択数
  const numSelectedHands = info.playerHands.filter((card) => card.selected).length
  const showBadge1 = info.selectedEnemyCard === 0 ? "outline" : "solid"
  const showBadge2 = info.sumSelectedHands === 0 ? "outline" : "solid"
  const showBadge3 =
    numberEnemyCard > 0 && info.sumSelectedHands >= numberEnemyCard ? "solid" : "outline"
  const showBadge_2_1 = disabledButtonExecute() ? "outline" : "solid"
  const showBadge_3_1 = numSelectedHands === 2 ? "solid" : "outline"

  const badge2text = () => {
    if (info.sumSelectedHands === 0) {
      return "手札未選択"
    } else {
      return `選択値：${info.sumSelectedHands}`
    }
  }

  // ボタンHサイズ
  const btnSizeH = "32px"
  const btnSizeW = "100px"

  return (
    <>
      {(() => {
        switch (phase) {
          // アクション選択
          case STATE_ACTION.SELECTED:
            return (
              <Stack
                direction="column"
                gap={1}
                align="stretch"
                h="100%"
                justifyContent="space-between"
              >
                <text>アクション選択</text>
                {/* ボタンホバーTooltip */}
                <Tooltip.Root openDelay={300} closeDelay={100} positioning={{ placement: "top" }}>
                  <Tooltip.Trigger asChild>
                    <Button
                      w={btnSizeW}
                      h={btnSizeH}
                      colorPalette="cyan"
                      disabled={disabledCaptureBtn}
                      onClick={() => {
                        info.setCardSelected(STATE_PCARD_SELECTED.MULTI) // カード選択状態(複数)
                        info.setActionState(STATE_ACTION.CAPTURE)
                        setPhase(STATE_ACTION.CONFIRM)
                        setText1("「対象Enemy」を選択後\n手札の「捕獲カード」を選択")
                      }}
                    >
                      捕獲
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Positioner>
                    <Tooltip.Content>
                      <Text
                        // fontWeight="bold"
                        lineClamp={4} // 最大2行に制限（超えた場合は ... 表示）
                        lineHeight="short" // 行間を詰めて収まりを良くする
                        wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
                        whiteSpace="pre-line" // \n を改行として処理）
                      >
                        {
                          "【捕獲アクション】\nEnemyCard1枚選択\n手札からEnemyCardと同じスートを選択（複数可）、手札の選択合計値がEnemyCard以上の場合、捕獲可能"
                        }
                      </Text>
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
                {/* ボタンホバーTooltip */}
                <Tooltip.Root openDelay={300} closeDelay={100} positioning={{ placement: "top" }}>
                  <Tooltip.Trigger asChild>
                    <Button
                      w={btnSizeW}
                      h={btnSizeH}
                      colorPalette="cyan"
                      disabled={disabledSealBtn}
                      onClick={() => {
                        info.setCardSelected(STATE_PCARD_SELECTED.STOCK_1) // カード選択状態(1枚)
                        info.setActionState(STATE_ACTION.SEAL)
                        setPhase(STATE_ACTION.CONFIRM)
                        setText1("ENEMY TOPカードが対象です。\n手札カード１枚を選択")
                        // EnemyカードにTOPカードをセット
                        info.toggleCaptureEnemySelected(0)
                      }}
                    >
                      封印
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Positioner>
                    <Tooltip.Content>
                      <Text
                        // fontWeight="bold"
                        lineClamp={4} // 最大2行に制限（超えた場合は ... 表示）
                        lineHeight="short" // 行間を詰めて収まりを良くする
                        wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
                        whiteSpace="pre-line" // \n を改行として処理）
                      >
                        {
                          "【封印アクション】\nEnemyCard対象 最前1枚（絵札不可）\n手札から数字札（絵札不可）を1枚選択、封印可能"
                        }
                      </Text>
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
                {/* ボタンホバーTooltip */}
                <Tooltip.Root openDelay={300} closeDelay={100} positioning={{ placement: "top" }}>
                  <Tooltip.Trigger asChild>
                    <Button
                      w={btnSizeW}
                      h={btnSizeH}
                      colorPalette="cyan"
                      disabled={disabledBlowBtn}
                      onClick={() => {
                        info.setCardSelected(3) // カード選択状態(2枚)
                        info.setActionState(STATE_ACTION.BLOWOUT)
                        setPhase(STATE_ACTION.CONFIRM)
                        setText1("「対象Enemy」を選択後\n手札カード２枚を選択")
                      }}
                    >
                      吹き飛ばし
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Positioner>
                    <Tooltip.Content>
                      <Text
                        // fontWeight="bold"
                        lineClamp={4} // 最大2行に制限（超えた場合は ... 表示）
                        lineHeight="short" // 行間を詰めて収まりを良くする
                        wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
                        whiteSpace="pre-line" // \n を改行として処理）
                      >
                        {
                          "【吹き飛ばしアクション】\nEnemyCard 1枚選択\n手札から数字札（絵札不可）を2枚選択、吹き飛ばし可能"
                        }
                      </Text>
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
                {/* ボタンホバーTooltip */}
                <Tooltip.Root openDelay={300} closeDelay={100} positioning={{ placement: "top" }}>
                  <Tooltip.Trigger asChild>
                    <Button
                      w={btnSizeW}
                      h={btnSizeH}
                      colorPalette="cyan"
                      onClick={() => {
                        info.setActionState(STATE_ACTION.DEFEATE)
                        setPhase(STATE_ACTION.CONFIRM)
                        setText1("投了します。")
                      }}
                    >
                      投了
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Positioner>
                    <Tooltip.Content>
                      <Text
                        // fontWeight="bold"
                        lineClamp={4} // 最大2行に制限（超えた場合は ... 表示）
                        lineHeight="short" // 行間を詰めて収まりを良くする
                        wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
                        whiteSpace="pre-line" // \n を改行として処理）
                      >
                        {"【投了】\nゲーム敗北\nタイトルに戻ります。"}
                      </Text>
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
              </Stack>
            )
          case STATE_ACTION.CONFIRM:
            return (
              <Stack
                direction="column"
                gap={1}
                align="stretch"
                h="100%"
                justifyContent="space-between"
              >
                <Text
                  // fontWeight="bold"
                  fontSize="md" // カードサイズ(100px)に合わせて小さめに設定
                  lineClamp={2} // 最大2行に制限（超えた場合は ... 表示）
                  lineHeight="short" // 行間を詰めて収まりを良くする
                  wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
                  whiteSpace="pre-line" // \n を改行として処理）
                >
                  {text1}
                </Text>
                {/* ボタンエリア */}
                <Stack direction="column" gap={1}>
                  <Button
                    w="160px"
                    h="32px"
                    colorPalette="cyan"
                    disabled={disabledButtonExecute()}
                    onClick={() => {
                      console.log("haddleActionExcecute onClick")
                      if (info.actionState === STATE_ACTION.DEFEATE) {
                        // 投了処理
                        handleDefete()
                      }
                      haddleActionExcecute()
                    }}
                  >
                    決定
                  </Button>
                  <Button w="160px" h="32px" colorPalette="cyan" onClick={() => actionReturn()}>
                    戻る
                  </Button>
                </Stack>
                {/* バッヂ表示 */}
                <Stack direction="column" gap={1} align="flex-start">
                  {(() => {
                    switch (act) {
                      case STATE_ACTION.CAPTURE:
                        // 捕獲バッヂ表示
                        return (
                          <>
                            <Stack direction="row" gap={1}>
                              <Badge colorPalette={"red"} variant={showBadge1}>
                                敵選択ＯＫ
                              </Badge>
                            </Stack>
                            <Stack direction="row" gap={1}>
                              <Badge colorPalette={"blue"} variant={showBadge2}>
                                {badge2text()}
                              </Badge>
                              <Badge colorPalette={"blue"} variant={showBadge3}>
                                捕獲ＯＫ
                              </Badge>
                            </Stack>
                          </>
                        )
                      case STATE_ACTION.SEAL:
                        // 封印バッヂ表示
                        return (
                          <Stack direction="row">
                            <Badge colorPalette={"blue"} variant={showBadge_2_1}>
                              封印ＯＫ
                            </Badge>
                          </Stack>
                        )
                      case STATE_ACTION.BLOWOUT:
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
                </Stack>
              </Stack>
            )
          default:
            break
        }
      })()}
    </>
  )
}
