import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Import core Mantine styles
import '@mantine/core/styles.css';

// Import custom global styles (if any)
import './index.css';

// 1. Define your "Muted/Scientific" Theme
const theme = createTheme({
  // Force dark mode by default
  primaryColor: 'cyan', // Good contrast on dark backgrounds
  defaultRadius: 'md', // Rounded corners on cards/buttons
  colors: {
    // Custom "Deep Space" background palette (overriding default grays)
    dark: [
      '#C1C2C5', // 0: Text Color
      '#A6A7AB', // 1: Subtext
      '#909296', // 2
      '#5C5F66', // 3
      '#373A40', // 4
      '#2C2E33', // 5
      '#25262B', // 6: Card Background
      '#1A1B1E', // 7: Main Background (Dark Muted Blue-Grey)
      '#141517', // 8
      '#101113', // 9
    ],
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
)