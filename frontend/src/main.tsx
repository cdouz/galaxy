import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './pages/landing/Landing.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Note from './pages/note/Note.js'
import NoteView from './pages/note/NoteView.js'
import About from './pages/about/About.js'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/note" element={<Note />} />
          <Route path="/note/view" element={<NoteView />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
