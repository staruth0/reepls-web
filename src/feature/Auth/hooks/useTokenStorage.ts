

export const useTokenStorage = () => {

    const storeAccessToken = (token: string) => {
        localStorage.setItem("access", token);
    }
    const storeRefreshToken = (token: string) => {
         localStorage.setItem("refresh", token);
    }

    const getAccessToken = () => {
        const token = localStorage.getItem('access');
        return token;
    }
    const getRefreshToken = () => {
        const token = localStorage.getItem("refresh");
        return token;
    }


    return {storeRefreshToken,getAccessToken,storeAccessToken,getRefreshToken}
    
}