import UserFeed from '../feature/Feed/Feed';
import Notifications from '../feature/Notifications/pages';
import Profile from '../feature/Profile/pages';
import UserLayout from '../layouts/UserLayout';
// import Home from "../feature/Home/pages/Home";

const UserRoutes = {
  path: '/test',
  element: <UserLayout />,
  children: [
    {
      path: 'feed',
      element: <UserFeed />,
    },
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
