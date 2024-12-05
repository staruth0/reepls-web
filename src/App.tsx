import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useContext, useEffect } from "react";
import useTheme from "./hooks/useTheme";
import { HomeRoutes } from "./Routes/HomeRoutes";
import { AuthRoutes } from "./Routes/AuthRoutes";
import { WebRoutes } from "./Routes/WebRoutes";
import { useTokenStorage } from "./feature/Auth/hooks/useTokenStorage";
import { AuthContext } from "./context/authContext";

const router = createBrowserRouter([
  WebRoutes,
  HomeRoutes,
  AuthRoutes
]);

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext); 
  const token = useTokenStorage().getAccessToken();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    console.log("Theme:", theme);
  }, [theme]);

  useEffect(() => {
    console.log("Auth state:", isAuthenticated, "Token:", token);
  }, [isAuthenticated, token]);

  return <RouterProvider router={router} />;
}

export default App;

