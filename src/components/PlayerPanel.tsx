import { Grid, GridItem } from "@chakra-ui/react"
import { PlayerHands } from "./PlayerHands"
import { PlayerAction } from "./PlayerAction"

export const PlayerPanel: React.FC = () => {
  return (
    <Grid templateColumns="7fr 3fr" gap={1} w="full">
      <GridItem>
        <PlayerHands />
      </GridItem>
      <GridItem>
        <PlayerAction />
      </GridItem>
    </Grid>
  )
}
