import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/authContext';
import useTheme from '../../../hooks/useTheme';
import '../styles/home.scss';

function Home() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { loading, authState } = useContext(AuthContext);

  const handleClick = () => {
    if (authState?.userId) {
      navigate('/test/feed');
    } else {
      navigate('/auth');
    }
  };

  const test = t('Get Started');

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

      <h2 onClick={handleClick}>{loading ? 'updating state' : test}</h2>
    </div>
  );
}

export default Home;
