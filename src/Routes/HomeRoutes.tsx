import HomeLayout from '../feature/Home/components/HomeLayout';
import FeedPosts from '../feature/Home/pages/FeedPosts';
import Search from '../feature/Search/pages/Search';
// import Home from "../feature/Home/pages/Home";

const HomeRoutes = {
  path: '/feed',
  element: <HomeLayout />,
  children: [
    {
      index: true,
      element: <FeedPosts />,
    },
    {
      path: 'search',
      element: <Search />,
    },
  ],
};

export { HomeRoutes };
