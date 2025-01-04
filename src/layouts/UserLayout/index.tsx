import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext/authContext';
import './index.scss';

const UserLayout: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (checkTokenExpiration()) {
      navigate('/auth/login');
    }
  }, [checkTokenExpiration]);

  return (
    <div className={`user__layout`}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default UserLayout;
