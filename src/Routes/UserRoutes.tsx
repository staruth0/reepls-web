import CreatePost from "../feature/Blog/pages";
import ArticleView from "../feature/Blog/pages/ArticleView";
import ArticleRead from "../feature/Feed/ArticleRead";
import CommuniqueDetail from "../feature/Feed/CommuniqueDetail";
import CommuniqueList from "../feature/Feed/CommuniqueList";
import UserFeed from "../feature/Feed/Feed";
import FeedFollowing from "../feature/Feed/FeedFollowings";
import Notifications from "../feature/Notifications/pages";
import Profile from "../feature/Profile/pages";
import EditProfile from "../feature/Profile/pages/EditProfile";
import Followers from "../feature/Profile/pages/Followers";
import ProfileAnalytics from "../feature/Profile/pages/ProfileAnalytics";
import Bookmarks from "../feature/Saved/pages";
import Search from "../feature/Search/pages";
import ResultsPage from "../feature/Search/pages/ResultsPages";
import UserLayout from "../layouts/UserLayout";
// import Home from "../feature/Home/pages/Home";

const UserRoutes = {
  path: "/",
  element: <UserLayout />,
  children: [
    {
      path: "feed",
      element: <UserFeed />,
    },
    {
      path: "feed/following",
      element: <FeedFollowing />,
    },
    {
      path: "explore",
      element: <Search />,
    },
    {
      path: "search/results/:query",
      element: <ResultsPage />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "profile/edit/:username",
      element: <EditProfile />,
    },
    {
      path: "/profile/:username",
      element: <Profile />,
    },
    {
      path: "/profile/followings/:user_id",
      element: <Followers />,
    },
    {
      path: "/profile/analytics/:username",
      element: <ProfileAnalytics />,
    },
    {
      path: "notifications",
      element: <Notifications />,
    },
    {
      path: "bookmarks",
      element: <Bookmarks />,
    },
    {
      path: "posts/create",
      element: <CreatePost />,
    },
    {
      path: "posts/article/:articleUid/view",
      element: <ArticleView />,
    },
    {
      path: "/posts/communique/:id",
      element: <CommuniqueDetail />,
    },
    {
      path: "/posts/article/:id",
      element: <ArticleRead/>,
    },
    {
      path: "posts/communiques",
      element: <CommuniqueList />,
    },
  ],
};

export { UserRoutes };
