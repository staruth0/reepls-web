import TermsPolicies from '../components/molecules/TermsPolicies';
import AnonymousBookmarks from '../feature/AnonymousUser/Pages/AnonymousBookmarks';
import AnonymousNotification from '../feature/AnonymousUser/Pages/AnonymousNotification';
import AnonymousProfile from '../feature/AnonymousUser/Pages/AnonymousProfile';
import EditPost from '../feature/Blog/components/EditPost';
import CreatePost from '../feature/Blog/pages';
import ArticleView from '../feature/Blog/pages/ArticleView';
import ArticleViewBySlug from '../feature/Blog/pages/ArticleViewBySlug';
import PostArticleAnalytics from '../feature/Blog/pages/Post&ArticleAnalytics';
import CommuniqueDetail from '../feature/Feed/CommuniqueDetail';
import CommuniqueList from '../feature/Feed/CommuniqueList';
import UserFeed from '../feature/Feed/Feed';
import FeedFollowing from '../feature/Feed/FeedFollowings';
import PostView from '../feature/Feed/PostView';
import Notifications from '../feature/Notifications/pages';
import Profile from '../feature/Profile/pages';
import EditProfile from '../feature/Profile/pages/EditProfile';
import Followers from '../feature/Profile/pages/Followers';
// import ProfileAnalytics from '../feature/Profile/pages/ProfileAnalytics';
import ProfileSettings from '../feature/Profile/pages/ProfileSettings';
import UserAnalytics from '../feature/Profile/pages/UsewrAnalytics';
import Bookmarks from '../feature/Saved/pages';
import Search from '../feature/Search/pages';
import SearchResults from '../feature/Search/pages/SearchResults';
import UserLayout from '../layouts/UserLayout';
// import Home from "../feature/Home/pages/Home";


const UserRoutes = {
  path: '/',
  element: <UserLayout />,
  children: [
    {
      path: '/feed',
      element: <UserFeed />,
    },
    {
      path: '/feed/following',
      element: <FeedFollowing />,
    },
    {
      path: '/search',
      element: <Search />,
    },
    {
      path: '/search/results/',
      element: <SearchResults/>,
    },
    {
      path: '/article/edit/:id',
      element: <EditPost/>,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/anonymous',
      element: <AnonymousProfile />,
    },
    {
      path: '/profile/edit/:username',
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
      path: '/profile/analytics/:id',
      element: <UserAnalytics />,
    },
    {
      path: '/post/analytics/:id',
      element: <PostArticleAnalytics/>,
    },
    {
      path: '/profilesettings',
      element: <ProfileSettings/>,
    },
    {
      path: '/Terms&Policies',
      element: <TermsPolicies />,
    },
    { 
      path: '/notifications',
      element: <Notifications />,
    },
    { 
      path: '/notifications/anonymous',
      element: <AnonymousNotification/>,
    },
    {
      path: '/bookmarks',
      element: <Bookmarks />,
    },
    {
      path: '/bookmarks/anonymous',
      element: <AnonymousBookmarks />,
    },
    {
      path: '/posts/create',
      element: <CreatePost />,
    },
    {
      path: '/posts/article/:articleUid',
      element: <ArticleView />,
    },
    {
      path: '/posts/article/slug/:slug',
      element: <ArticleViewBySlug />,
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
      path: '/posts/communiques',
      element: <CommuniqueList />,
    },

  ],
};

export { UserRoutes };
