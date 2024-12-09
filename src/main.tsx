import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import './lang/i18n.ts'
import { store } from './store/index.tsx'
import { Provider } from 'react-redux'

import { ThemeProvider } from './context/Theme/themeProvider.tsx'
import CognitiveModeProvider from './context/CognitiveMode/CognitiveModeProvider.tsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AuthProvider from './context/AuthProvider.tsx'


const queryClient = new QueryClient({})


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <CognitiveModeProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </Provider>
        </CognitiveModeProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
