import { useTranslation } from 'react-i18next';

// Type definitions for different error formats
interface BackendError {
  error: {
    code: number;
    message: string;
    stack?: string;
  };
}

interface AxiosError {
  response?: {
    data?: {
      error?: {
        code: number;
        message: string;
        stack?: string;
      };
      message?: string;
      details?: string;
      errors?: Array<string | { message: string }>;
    };
    status: number;
  };
  message?: string;
}

interface NetworkError {
  message: string;
}

// Main error handler function
export const getBackendErrorMessage = (error: unknown, t: (key: string, options?: any) => string): string => {
  if (!error) {
    return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
  }

  // Type guards
  const isBackendError = (err: unknown): err is BackendError => {
    return typeof err === 'object' && 
           err !== null && 
           'error' in err && 
           typeof (err as Record<string, unknown>).error === 'object' &&
           (err as Record<string, unknown>).error !== null &&
           'message' in ((err as Record<string, unknown>).error as Record<string, unknown>) &&
           'code' in ((err as Record<string, unknown>).error as Record<string, unknown>);
  };

  const isAxiosError = (err: unknown): err is AxiosError => {
    return typeof err === 'object' && 
           err !== null && 
           'response' in err;
  };

  const isNetworkError = (err: unknown): err is NetworkError => {
    return typeof err === 'object' && 
           err !== null && 
           'message' in err && 
           typeof (err as Record<string, unknown>).message === 'string' &&
           ((err as Record<string, unknown>).message as string).includes('Network Error');
  };

  // Handle backend error format: { error: { code: 400, message: "Email already taken" } }
  if (isBackendError(error)) {
    const errorCode = (error as BackendError).error.code;
    const errorMessage = (error as BackendError).error.message;

    // Map specific error codes to user-friendly messages
    const errorCodeMessages: Record<number, string> = {
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

    // Return the specific error message from backend if available, otherwise use mapped message
    return errorMessage || errorCodeMessages[errorCode] || t('authErrors.generic');
  }

  // Handle Axios error format
  if (isAxiosError(error)) {
    const responseData = (error as AxiosError).response?.data;
    const status = (error as AxiosError).response?.status;

    // Check for nested error object in response
    if (responseData?.error?.message) {
      return responseData.error.message;
    }

    // Check for direct message in response
    if (responseData?.message) {
      return responseData.message;
    }

    // Check for details field
    if (responseData?.details) {
      return responseData.details;
    }

    // Check for errors array
    if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
      const firstError = responseData.errors[0];
      if (typeof firstError === 'string') {
        return firstError;
      }
      if (typeof firstError === 'object' && firstError !== null && 'message' in firstError) {
        return (firstError as { message: string }).message;
      }
    }

    // Fallback to status-based messages
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
  }

  // Handle network errors
  if (isNetworkError(error)) {
    return t('authErrors.network', { defaultValue: "No internet connection. Please check your connection and try again." });
  }

  // Handle simple error objects with message
  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as Record<string, unknown>).message === 'string') {
    return (error as Record<string, unknown>).message as string;
  }

  // Fallback for unknown error types
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
