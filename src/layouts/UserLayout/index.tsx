import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext/authContext';
import './index.scss';

const UserLayout: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (checkTokenExpiration()) {
      navigate('/auth/login');
    }
  }, []);

  return (
    <div className={`user__layout ${ isSidebarCollapsed ? 'user__layout__bar__collapsed': ''} `}>
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      <Outlet />
    </div>
  );
};

export default UserLayout;
