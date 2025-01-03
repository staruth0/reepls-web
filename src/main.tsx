import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App.tsx';
import './index.scss';
import './lang/i18n.ts';
import { store } from './store/index.tsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthContext/AuthProvider.tsx';
import CognitiveModeProvider from './context/CognitiveMode/CognitiveModeProvider.tsx';
import { ThemeProvider } from './context/Theme/themeProvider.tsx';

const queryClient = new QueryClient({});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <CognitiveModeProvider>
          <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ReduxProvider>
        </CognitiveModeProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
