// src/services/apiClient.ts

import axios, { AxiosInstance } from "axios";

const getToken = () => {
  return localStorage.getItem("access");
};

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://saah-server.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient,apiClient2,apiClient3};
