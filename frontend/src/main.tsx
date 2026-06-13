import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './pages/landing/Landing.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing/>
  </StrictMode>,
)
