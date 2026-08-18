import { useAxiosStore } from "@/tools/AxiosManager"
import { Box, Text } from "@chakra-ui/react"

export const MessageInfo: React.FC = () => {
  const axiosStore = useAxiosStore()

  return (
    <Box
      border="3px solid black"
      w="100%"
      h="220px"
      p={1}
      overflowY="auto" // 縦方向の内容があふれたら自動でスクロールバーを表示
    >
      <Text whiteSpace="pre-line" fontSize="14px">
        {axiosStore.message}
      </Text>
    </Box>
  )
}
