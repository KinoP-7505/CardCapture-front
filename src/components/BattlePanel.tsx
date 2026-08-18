import { Grid, GridItem } from "@chakra-ui/react"
import { EnemyArea } from "./EnemyArea"
import { BattleInfo } from "./BattleInfo"

export const BattlePanel: React.FC = () => {
  return (
    <Grid templateColumns="7fr 3fr" gap={1} w="full">
      <GridItem>
        <EnemyArea />
      </GridItem>
      <GridItem>
        <BattleInfo />
      </GridItem>
    </Grid>
  )
}
