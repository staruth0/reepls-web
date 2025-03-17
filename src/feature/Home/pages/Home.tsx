import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import useTheme from '../../../hooks/useTheme';
import '../styles/home.scss';
import { useUser } from '../../../hooks/useUser';
import Header from '../components/header/Header';
import Banner from '../components/Banner/Banner';
import Sections from '../components/Sections/Sections';
import FooterTop from '../components/Footer/FooterTop'
import FooterBottom from '../components/Footer/FooterBottom';


function Home() {
  const { t, i18n } = useTranslation();
  // const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { authUser} = useUser();

  const handleClick = () => {
    console.log('Current authState:', authUser);


    if (authUser?.id) {
      console.log('Navigating to feed');
      navigate('/feed');
    } else {
      console.log('Navigating to auth');
      navigate('/auth');
    }
  };

  return (
    <div className="home__container">
     <Header />
     <Banner />
     <Sections />
     <FooterTop />
     <FooterBottom />
     {/* <h1>{t('Welcome to REEPLS')}</h1> */}
      {/* <div className="language__translators">
        <button onClick={() => i18n.changeLanguage('fr')}>French</button>
        <button onClick={() => i18n.changeLanguage('en')}>English</button>
      </div> */} 
      {/* <div className={`togglebtn ${theme === 'dark' ? 'flex' : ''}`} onClick={() => toggleTheme()}>
        <div className="togglebtn__mover"></div>
      </div> */}

      {/* <h2 onClick={handleClick}>{t('Get Started')}</h2> */}
    </div>
  );
}

export default Home;
