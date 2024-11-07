import { useTranslation } from "react-i18next"
import useTheme from "../../../hooks/useTheme";

function Home() {
    const { t, i18n } = useTranslation()
    const { theme,toggleTheme } = useTheme()
    
  return (
    <div>
      {t("Welcome")}
      <div>
        <button onClick={() => i18n.changeLanguage("fr")}>French</button>
        <button onClick={() => i18n.changeLanguage("en")}>English</button>
      </div>
      <div className={`togglebtn ${theme==='dark'?'flex':''}`} onClick={()=>toggleTheme()}>
        <div className="togglebtn__mover"></div>
      </div>
    </div>
  );
}

export default Home