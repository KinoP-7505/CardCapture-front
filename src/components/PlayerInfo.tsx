import { Box, Text } from "@chakra-ui/react"

export const PlayerInfo: React.FC = () => {
  return (
    <Box
      border="3px solid black"
      p={1}
      //   w="520px"
    >
      <Text>PlayerDeck枚数：10</Text>

      <Text mt={2}>Discards枚数：0</Text>
    </Box>
  )
}
