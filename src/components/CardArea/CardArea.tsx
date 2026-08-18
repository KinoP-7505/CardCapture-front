import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { CardItem } from "../CardItem";
import "./CardArea.css";

type CardAreaProps = {
  title: string;
  bg: string;
  prefix: string;
};

const CardArea = ({
  title,
  bg,
  prefix,
}: CardAreaProps) => {
  return (
    <Box
      bg={bg}
      border="1px solid"
      p={2}
    >
      <Text
        color="white"
        fontWeight="bold"
        mb={2}
      >
        {title}
      </Text>

      <SimpleGrid columns={4} gap="40px">
        {[0, 1, 2, 3].map((i) => (
          <CardItem
            key={i}
            title={prefix}
            no={i}
            bg={bg}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CardArea;