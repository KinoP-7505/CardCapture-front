import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import GameBoard from './pages/GameBoard.tsx'
import { Box } from '@chakra-ui/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Box
        w="100vw"
        h="100vh"
        overflow="auto"
        bg="gray.100"
        p={4}
      >
        <GameBoard />
      </Box>
    </Provider>
  </StrictMode>,
)
