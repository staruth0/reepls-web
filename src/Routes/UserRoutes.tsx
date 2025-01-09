import CreatePost from '../feature/Blog/pages';
import PostPreview from '../feature/Blog/pages/PostPreview';
import UserFeed from '../feature/Feed/Feed';
import Notifications from '../feature/Notifications/pages';
import Profile from '../feature/Profile/pages';
import EditProfile from '../feature/Profile/pages/EditProfile';
import Bookmarks from '../feature/Saved/pages';
import Search from '../feature/Search/pages';
import UserLayout from '../layouts/UserLayout';
// import Home from "../feature/Home/pages/Home";

const UserRoutes = {
  path: "/test",
  element: <UserLayout />,
  children: [
    {
      path: "feed",
      element: <UserFeed />,
    },
    {
      path: "explore",
      element: <Search />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "profile/edit",
      element: <EditProfile />,
    },
    {
      path: ":username",
      element: <Profile />,
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
      path: "posts/create/preview",
      element: <PostPreview />,
    },
  ],
};

export { UserRoutes };
