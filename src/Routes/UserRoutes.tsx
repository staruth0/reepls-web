import TermsPolicies from '../components/molecules/TermsPolicies';
import CreatePost from '../feature/Blog/pages';
import ArticleView from '../feature/Blog/pages/ArticleView';
import CommuniqueDetail from '../feature/Feed/CommuniqueDetail';
import CommuniqueList from '../feature/Feed/CommuniqueList';
import UserFeed from '../feature/Feed/Feed';
import FeedFollowing from '../feature/Feed/FeedFollowings';
import PostView from '../feature/Feed/PostView';
import Notifications from '../feature/Notifications/pages';
import Profile from '../feature/Profile/pages';
import EditProfile from '../feature/Profile/pages/EditProfile';
import Followers from '../feature/Profile/pages/Followers';
import ProfileAnalytics from '../feature/Profile/pages/ProfileAnalytics';
import Bookmarks from '../feature/Saved/pages';
import Search from '../feature/Search/pages';
import ResultsPage from '../feature/Search/pages/ResultsPages';
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
      path: 'feed/following',
      element: <FeedFollowing />,
    },
    {
      path: 'search',
      element: <Search />,
    },
    {
      path: 'search/results/',
      element: <ResultsPage />,
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
      path: 'profile/settings/:username',
      element: <EditProfile />,
    },
    {
      path: '/profile/:username',
      element: <Profile />,
    },
    {
      path: '/profile/followings/:user_id',
      element: <Followers />,
    },
    {
      path: '/profile/analytics/:username',
      element: <ProfileAnalytics />,
    },
    {
      path: '/Terms&Policies',
      element: <TermsPolicies />,
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
      path: 'posts/article/:articleUid',
      element: <ArticleView />,
    },
    {
      path: '/posts/communique/:id',
      element: <CommuniqueDetail />,
    },
    {
      path: '/posts/post/:id',
      element: <PostView />,
    },
    {
      path: 'posts/communiques',
      element: <CommuniqueList />,
    },
  ],
};

export { UserRoutes };
