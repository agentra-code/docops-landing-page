import '@docops/ui/tokens.css'
import '@renderer/app.css'
import { createRoot } from 'react-dom/client'
import { applyTheme, readTheme } from '@renderer/theme'
import { App } from '@renderer/App'
import { installFakeBridge } from './fake'

installFakeBridge()
applyTheme(readTheme())
createRoot(document.getElementById('goc')!).render(<App />)
