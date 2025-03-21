import { LuArrowLeft } from 'react-icons/lu';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/authlayout.scss';
import Swiper from './Swiper';
import LanguageSwitcher from '../../Home/components/LanguageSwitcher';

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBackArrowVisible = location.pathname !== '/auth';

  // Function to navigate to the previous route
  const prevRoute = () => {
    navigate(-1);
  };

  return (
    <div className="auth__layout">
      <div className="swiper__part">
        <Swiper />
      </div>
      <div className="page__container">
        <div className="top__nav">
          {isBackArrowVisible && <LuArrowLeft onClick={prevRoute} className="size-4" />}
         <LanguageSwitcher/>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
