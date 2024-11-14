import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import './lang/i18n.ts'
import { store } from './store/index.tsx'
import { Provider } from 'react-redux'

import { ThemeProvider } from './context/Theme/themeProvider.tsx'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
