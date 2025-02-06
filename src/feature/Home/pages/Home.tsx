import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '../../../constants';
import { AuthContext } from '../../../context/AuthContext/authContext';
import useTheme from '../../../hooks/useTheme';
import '../styles/home.scss';

function Home() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const {  authState } = useContext(AuthContext);

  const handleClick = () => {
    console.log('Current authState:', authState);
    console.log('Stored token:', localStorage.getItem(ACCESS_TOKEN_KEY));

    if (authState?.userId) {
      console.log('Navigating to feed');
      navigate('/feed');
    } else {
      console.log('Navigating to auth');
      navigate('/auth');
    }
  };

  return (
    <div className="home__container">
      <h1>{t('Welcome to REEPLS')}</h1>
      <div className="language__translators">
        <button onClick={() => i18n.changeLanguage('fr')}>French</button>
        <button onClick={() => i18n.changeLanguage('en')}>English</button>
      </div>
      <div className={`togglebtn ${theme === 'dark' ? 'flex' : ''}`} onClick={() => toggleTheme()}>
        <div className="togglebtn__mover"></div>
      </div>

      <h2 onClick={handleClick}>{t('Get Started')}</h2>
    </div>
  );
}

export default Home;
