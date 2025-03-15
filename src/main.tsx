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
import FeedFollowingProvider from './context/Feedcontext/IsFeedFollowingProvider.tsx';
import SideBarProvider from './context/SidebarContext/SideBarProvider.tsx';
import { ThemeProvider } from './context/Theme/themeProvider.tsx';
import VoiceLanguageProvider from './context/VoiceLanguageContext/VoiceLanguageProvider.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      retry: 3,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <CognitiveModeProvider>
          <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
              <SideBarProvider>
                <VoiceLanguageProvider>
                  <FeedFollowingProvider>
                    <App />
                  </FeedFollowingProvider>
                </VoiceLanguageProvider>
              </SideBarProvider>
            </QueryClientProvider>
          </ReduxProvider>
        </CognitiveModeProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
