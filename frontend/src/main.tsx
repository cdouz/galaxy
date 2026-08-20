import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from '@/pages/landing/Landing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Note from '@/pages/note/Note'
import NoteView from '@/pages/note/NoteView'
import About from '@/pages/about/About'
import Dashboard from '@/pages/dashboard/Dashboard'
import Search from '@/pages/search/Search'
import Graph from '@/pages/graph/graph'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Settings from '@/pages/settings/Settings'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import NotFound from '@/pages/not-found/NotFound'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/note/new" element={<Note />} />
              <Route path="/note/:id" element={<Note />} />
              <Route path="/note/:id/view" element={<NoteView />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
