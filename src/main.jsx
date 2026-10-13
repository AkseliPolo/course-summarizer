import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './styles.css'
import App from './App.jsx'
import { SpeechProvider } from './lib/speech.jsx'
import { bootstrap } from './lib/storage.js'
import { GameProvider } from './lib/store.jsx'

// Saved progress and added courses are loaded before the first render.
const boot = await bootstrap()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameProvider boot={boot}>
      <SpeechProvider>
        <App />
      </SpeechProvider>
    </GameProvider>
  </StrictMode>,
)
