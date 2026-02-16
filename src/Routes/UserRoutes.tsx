import TermsPolicies from '../components/molecules/TermsPolicies';
import ChildSafetyStandards from '../components/molecules/ChildSafetyStandards';
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
import UploadPodcastTestPage from '../Tests/pages/UploadPodcastTestPage.tsx';
import UserFeed from '../feature/Feed/Feed';
import FeedFollowing from '../feature/Feed/FeedFollowings';
import FeedPodcasts from '../feature/Feed/FeedPodcasts';
import PostView from '../feature/Feed/PostView';
import Notifications from '../feature/Notifications/pages';
import Podcast from '../feature/Podcast/pages';
import PodcastDetail from '../feature/Podcast/pages/PodcastDetail';
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
import EditPodcast from '../feature/Podcast/pages/PodcastEdit.tsx';
import CreateStream from '../feature/Stream/Pages/CreateStream.tsx';
import StreamDetails from '../feature/Stream/Pages/StreamDetails.tsx';
import StreamManagement from '../feature/Stream/Pages/StreamManagement.tsx';
import SreamEdit from '../feature/Stream/Pages/SreamEdit.tsx';
import Subscribers from '../feature/Stream/Pages/Subscribers.tsx';
import Collaborators from '../feature/Stream/Pages/Collaborators.tsx';
import ProtectedRoute from '../components/atoms/ProtectedRoute';
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
      path: '/child-safety-standards',
      element: <ChildSafetyStandards />,
    },
    {
      path: '/child-safety',
      element: <ChildSafetyStandards />,
    },
    { 
      path: '/notifications',
      element: <Notifications />,
    },
    {
      path: '/podcast/:id',
      element: <PodcastDetail />,
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
      element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
    },
    {
      path: '/podcast/create',
      element: <ProtectedRoute><Podcast /></ProtectedRoute>,
    },
    {
      path: '/podcast/edit/:id',
      element: <EditPodcast />,
    },
    {
      path: '/feed/podcasts',
      element: <FeedPodcasts />,
    },
     {
      path: '/stream/create',
      element: <ProtectedRoute><CreateStream /></ProtectedRoute>,
    },
     {
      path: '/stream/edit/:id',
      element: <SreamEdit/>,
    },
     {
      path: '/stream/management',
      element: <StreamManagement />,
    },
     {
      path: '/stream/:id',
      element: <StreamDetails />,
    },
     {
      path: '/stream/:id/subscribers',
      element: <Subscribers />,
    },
     {
      path: '/stream/:id/collaborators',
      element: <Collaborators />,
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
      path: '/posts/article/slug/:id',
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
    {
      path: '/test',
      element: <UploadPodcastTestPage />,
    },

  ],
};

export { UserRoutes };
