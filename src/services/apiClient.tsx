import axios, { AxiosInstance } from "axios";
import { refreshAuthTokens } from "../feature/Auth/api/index"; 

const getToken = () => localStorage.getItem("access");
const getRefreshToken = () => localStorage.getItem("refresh");

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://saah-server.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (
      token &&
      !config.url?.includes("/login") &&
      !config.url?.includes("/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const data = await refreshAuthTokens(refreshToken);
          localStorage.setItem("access", data.accessToken);
          localStorage.setItem("refresh", data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(error.config); // Retry request with new token
        } catch (e) {
          localStorage.clear();
          window.location.href = "/auth"; 
          console.log("Token refresh failed, redirecting to login page",e)
        }
      }
    }
    return Promise.reject(error);
  }
);



const apiClient3: AxiosInstance = axios.create({
  baseURL: "https://saah-server.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient2: AxiosInstance = axios.create({
  baseURL: "https://saah-server.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (
//       token &&
//       !config.url?.includes("/login") &&
//       !config.url?.includes("/register")
//     ) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export { apiClient, apiClient2, apiClient3 };
