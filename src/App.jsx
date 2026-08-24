import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Center, Loader } from '@mantine/core'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'

// Home ships in the main bundle; everything else loads on navigation. This
// keeps the markdown renderer and syntax highlighter off the landing page.
const Notebook = lazy(() => import('./pages/Notebook').then(m => ({ default: m.Notebook })))
const NotebookDetail = lazy(() => import('./pages/NotebookDetail').then(m => ({ default: m.NotebookDetail })))
const Research = lazy(() => import('./pages/Research').then(m => ({ default: m.Research })))
const Code = lazy(() => import('./pages/Code').then(m => ({ default: m.Code })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

function PageFallback() {
  return (
    <Center style={{ minHeight: '100vh' }}>
      <Loader />
    </Center>
  )
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/notebook" element={<Notebook />} />
          <Route path="/notebook/:slug" element={<NotebookDetail />} />
          <Route path="/research" element={<Research />} />
          <Route path="/code" element={<Code />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
