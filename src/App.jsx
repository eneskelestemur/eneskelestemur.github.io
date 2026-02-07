import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { Home } from './pages/Home'
import { Notebook } from './pages/Notebook'
import { Research } from './pages/Research'
import { Code } from './pages/Code'
import { Future } from './pages/Future'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Global Theme Toggle (visible on all pages) */}
      <ThemeToggle />

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/research" element={<Research />} />
        <Route path="/code" element={<Code />} />
        <Route path="/future" element={<Future />} />
      </Routes>
    </div>
  )
}

export default App
