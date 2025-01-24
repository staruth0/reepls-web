import CreatePost from '../feature/Blog/pages';
import ArticleView from '../feature/Blog/pages/ArticleView';
import CommuniqueDetail from '../feature/Feed/CommuniqueDetail';
import UserFeed from '../feature/Feed/Feed';
import Notifications from '../feature/Notifications/pages';
import Profile from '../feature/Profile/pages';
import EditProfile from '../feature/Profile/pages/EditProfile';
import Followers from '../feature/Profile/pages/Followers';
import ProfileAnalytics from '../feature/Profile/pages/ProfileAnalytics';
import Bookmarks from '../feature/Saved/pages';
import Search from '../feature/Search/pages';
import UserLayout from '../layouts/UserLayout';
// import Home from "../feature/Home/pages/Home";

const UserRoutes = {
  path: '/',
  element: <UserLayout />,
  children: [
    {
      path: 'feed',
      element: <UserFeed />,
    },
    {
      path: 'explore',
      element: <Search />,
    },
    {
      path: 'profile',
      element: <Profile />,
    },
    {
      path: 'profile/edit/:username',
      element: <EditProfile />,
    },
    {
      path: '/profile/:username',
      element: <Profile />,
    },
    {
      path: '/profile/followings/:username',
      element: <Followers/>,
    },
    {
      path: '/profile/analytics/:username',
      element: <ProfileAnalytics />,
    },
    {
      path: 'notifications',
      element: <Notifications />,
    },
    {
      path: 'bookmarks',
      element: <Bookmarks />,
    },
    {
      path: 'posts/create',
      element: <CreatePost />,
    },
    {
      path: 'posts/article/:articleUid/view',
      element: <ArticleView />,
    },
    {
      path: 'posts/communique',
      element: <CommuniqueDetail />,
    },
  ],
};

export { UserRoutes };
