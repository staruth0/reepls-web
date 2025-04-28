import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App.tsx';
import './index.scss';
import './lang/i18n.ts';
import { store } from './store/index.tsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorFallback from './components/molecules/ErrorFallback/ErrorFallback.tsx';
import AuthProvider from './context/AuthContext/AuthProvider.tsx';
import CognitiveModeProvider from './context/CognitiveMode/CognitiveModeProvider.tsx';
import FeedFollowingProvider from './context/Feedcontext/IsFeedFollowingProvider.tsx';
import NotificationProvider from './context/NotificationContext/NotificationProvider.tsx';
import SideBarProvider from './context/SidebarContext/SideBarProvider.tsx';
import { ThemeProvider } from './context/Theme/themeProvider.tsx';
import VoiceLanguageProvider from './context/VoiceLanguageContext/VoiceLanguageProvider.tsx';
import SearchContainerProvider from './context/suggestionContainer/isSearchProvider.tsx';
import { AudioPlayerProvider } from './providers/AudioProvider.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
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
                    <SearchContainerProvider>
                      <ErrorBoundary
                        FallbackComponent={ErrorFallback}
                        onError={(error, info) => {
                          console.error('Error caught by ErrorBoundary:', error, info);
                        }}>
                       <NotificationProvider> 
                        <AudioPlayerProvider>
                          <App />
                        </AudioPlayerProvider>
                        </NotificationProvider> 
                      </ErrorBoundary>
                    </SearchContainerProvider>
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
