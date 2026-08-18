import { Box, VStack } from "@chakra-ui/react";

type StatusPanelProps = {
  top?: boolean;
};

export const StatusPanel:React.FC<StatusPanelProps> = (
    { top }
) => {
  return (
    <Box
      border="2px solid"
      p={3}
      width="340px"
      bg="white"
    >
      {top ? (
        <VStack align="start">
          <Text>ラウンド数 ： 1</Text>

          <HStack spacing={8}>
            <Text>EnemyDeck枚数 ： 36</Text>
            <Text>SealArea枚数 ： 0</Text>
          </HStack>
        </VStack>
      ) : (
        <VStack align="start" spacing={2}>
          <Text>PlayerDeck枚数 ： 10</Text>
          <Text>Discards枚数 ： 0</Text>
        </VStack>
      )}
    </Box>
  );
}