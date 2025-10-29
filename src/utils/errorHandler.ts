import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

interface BackendErrorResponse {
  error: {
    code: number;
    message: string;
    stack?: string;
  };
  message?: string;
}

export const getBackendErrorMessage = (error: unknown, t: (key: string, options?: any) => string): string => {
  if (!error) {
    return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
  }

  const axiosError = error as AxiosError<BackendErrorResponse>;

  if (axiosError.response?.data?.error?.message) {
    return axiosError.response.data.error.message;
  }

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  const status = axiosError.response?.status;
  if (status) {
    const statusMessages: Record<number, string> = {
      400: t('authErrors.badRequest', { defaultValue: "Invalid request. Please check your input." }),
      401: t('authErrors.unauthorized', { defaultValue: "Authentication failed. Please try again." }),
      403: t('authErrors.forbidden', { defaultValue: "Access denied. You don't have permission." }),
      404: t('authErrors.notFound', { defaultValue: "Resource not found. Please check your request." }),
      409: t('authErrors.conflict', { defaultValue: "Email already registered. Please log in instead." }),
      422: t('authErrors.validation', { defaultValue: "Validation error. Please check your input." }),
      429: t('authErrors.tooManyRequests', { defaultValue: "Too many requests. Please wait and try again." }),
      500: t('authErrors.serverError', { defaultValue: "Server error. Please try again later." }),
      502: t('authErrors.badGateway', { defaultValue: "Service temporarily unavailable. Please try again." }),
      503: t('authErrors.serviceUnavailable', { defaultValue: "Service unavailable. Please try again later." }),
    };
    return statusMessages[status] || t('authErrors.generic');
  }

  if (axiosError.message?.includes('Network Error') || axiosError.code === 'ECONNREFUSED') {
    return t('authErrors.network', { defaultValue: "No internet connection. Please check your connection and try again." });
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: string }).message;
    if (typeof msg === 'string') return msg;
  }

  return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
};

// Hook for using error handler with translation
export const useErrorHandler = () => {
  const { t } = useTranslation();
  
  return (error: unknown) => getBackendErrorMessage(error, t);
};

// Specific error handlers for different auth scenarios
export const getAuthErrorMessage = (error: unknown, t: (key: string, options?: any) => string, context: 'login' | 'register' | 'forgotPassword' | 'resetPassword' = 'login'): string => {
  const baseMessage = getBackendErrorMessage(error, t);
  
  // Add context-specific modifications if needed
  if (context === 'login' && baseMessage.includes('Email already registered')) {
    return t('authErrors.loginEmailExists', { defaultValue: "No account found with this email. Please sign up first." });
  }
  
  if (context === 'register' && baseMessage.includes('Not found')) {
    return t('authErrors.registerNotFound', { defaultValue: "Registration failed. Please try again." });
  }
  
  return baseMessage;
};

// Hook for auth-specific error handling
export const useAuthErrorHandler = (context: 'login' | 'register' | 'forgotPassword' | 'resetPassword' = 'login') => {
  const { t } = useTranslation();
  
  return (error: unknown) => getAuthErrorMessage(error, t, context);
};
