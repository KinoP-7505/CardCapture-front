import { Box, HStack, Icon, Text } from "@chakra-ui/react"
import { GiClubs, GiDiamonds, GiHearts, GiSpades } from "react-icons/gi"
import { TbJoker, TbPlayCardStar } from "react-icons/tb"
// import "./Card.css";

type CardItemProps = {
  title: string
  suit: number
  num: number
  bg: string
  selected: boolean
  onClick?: () => void // クリックイベント
}

export const CardItem: React.FC<CardItemProps> = ({ title, suit, num, bg, selected, onClick }) => {
  const selectText = selected ? "選択中" : ""

  // スートアイコンの設定
  const suit_icon = (suit: number) => {
    switch (suit) {
      case 1:
        return (
          <Icon size="md" color="blue" boxSize="28px">
            <GiSpades />
          </Icon>
        )
      case 2:
        return (
          <Icon size="md" color="red" boxSize="28px">
            <GiHearts />
          </Icon>
        )
      case 3:
        return (
          <Icon size="md" color="orange" boxSize="28px">
            <GiDiamonds />
          </Icon>
        )
      case 4:
        return (
          <Icon size="md" color="green" boxSize="28px">
            <GiClubs />
          </Icon>
        )
      case 5:
        return (
          <Icon size="md" color="black" boxSize="28px">
            <TbJoker />
          </Icon>
        )
    }
    return (
      <Icon size="md" color="black" boxSize="28px">
        <TbPlayCardStar />
      </Icon>
    )
  }

  return (
    <Box
      w="100px"
      h="140px"
      bg={bg}
      border="3px solid #8b5a00"
      p={3}
      boxShadow="md"
      onClick={onClick}
    >
      <Text
        fontWeight="bold"
        fontSize="sm" // カードサイズ(100px)に合わせて小さめに設定
        lineClamp={2} // 最大2行に制限（超えた場合は ... 表示）
        lineHeight="short" // 行間を詰めて収まりを良くする
        wordBreak="break-word" // 長い単語や日本語の途中で自然に改行
        whiteSpace="pre-line" // \n を改行として処理）
      >
        {title}
      </Text>
      <HStack gap={1} align={"center"} justify="center" mt={2}>
        {suit_icon(suit)}
        <Text fontSize="28px">{num}</Text>
      </HStack>
      <Text mt={3} fontWeight="bold">
        {selectText}
      </Text>
    </Box>
  )
}
