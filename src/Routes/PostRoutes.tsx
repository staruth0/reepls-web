import CreatePost from "../feature/Blog/pages/CreatePost"
import PreviewPost from "../feature/Blog/pages/PreviewPost";


const PostRoutes = {
    path: '/posts/create',
    element:<CreatePost/>
}

const Previewroutes = {
  path: "/posts/create/preview",
  element: <PreviewPost/>
};

export {PostRoutes, Previewroutes}