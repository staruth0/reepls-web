import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface BackendErrorResponse {
  error: {
    code: number;
    message: string;
    stack?: string;
  };
  message?: string;
}

export const handleMutationError = (error: unknown): void => {
  const axiosError = error as AxiosError<BackendErrorResponse>;
  
  if (axiosError.response?.data?.error?.message) {
    toast.error(axiosError.response.data.error.message);
    return;
  }

  if (axiosError.response?.data?.message) {
    toast.error(axiosError.response.data.message);
    return;
  }

  const status = axiosError.response?.status;
  const statusMessages: Record<number, string> = {
    400: "Invalid request. Please check your input.",
    401: "Authentication failed. Please try again.",
    403: "Access denied. You don't have permission.",
    404: "Resource not found.",
    409: "This action conflicts with existing data.",
    422: "Validation error. Please check your input.",
    429: "Too many requests. Please wait and try again.",
    500: "Server error. Please try again later.",
    502: "Service temporarily unavailable.",
    503: "Service unavailable. Please try again later.",
  };

  if (status && statusMessages[status]) {
    toast.error(statusMessages[status]);
    return;
  }

  if (axiosError.message?.includes('Network Error') || axiosError.code === 'ECONNREFUSED') {
    toast.error("No internet connection. Please check your connection and try again.");
    return;
  }

  toast.error("Something went wrong. Please try again.");
};

