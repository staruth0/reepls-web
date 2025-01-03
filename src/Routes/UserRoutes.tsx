import HomeLayout from '../feature/Home/components/HomeLayout';
import Notifications from '../feature/Notifications/pages';
import Profile from '../feature/Profile/pages';
// import Home from "../feature/Home/pages/Home";

const UserRoutes = {
  path: '/',
  element: <HomeLayout />,
  children: [
    {
      path: 'profile',
      element: <Profile />,
    },
    {
      path: ':username',
      element: <Profile />,
    },
    {
      path: 'notifications',
      element: <Notifications />,
    },
  ],
};

export { UserRoutes };
