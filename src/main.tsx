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
import SideBarProvider from './context/SidebarContext/SideBarProvider.tsx';
import VoiceLanguageProvider from './context/VoiceLanguageContext/VoiceLanguageProvider.tsx';
import FeedFollowingProvider from './context/Feedcontext/IsFeedFollowingProvider.tsx';

const queryClient = new QueryClient({ defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: false, 
      refetchOnReconnect: true, 
      refetchOnMount: false, 
    },
  },
});

createRoot(document.getElementById("root")!).render(
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
