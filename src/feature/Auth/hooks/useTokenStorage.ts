import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../constants';

export const useTokenStorage = () => {
  const storeAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  };
  const storeRefreshToken = (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  };

  const getAccessToken = () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
  };
  const getRefreshToken = () => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    return token;
  };

  return { storeRefreshToken, getAccessToken, storeAccessToken, getRefreshToken };
};
