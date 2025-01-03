import ProfileLayout from "../feature/Profile/components/ProfileLayout";
import ProfileEdit from "../feature/Profile/pages/ProfileEdit";
import ProfileView from "../feature/Profile/pages/ProfileView";


const ProfileRoutes = {
    path: '/profile',
    element: <ProfileLayout />,
    children: [
        {
            index: true,
            element:<ProfileView/>
        },
        {
            path: '/profile/edit',
            element: <ProfileEdit/>

        }
    ]

}

export { ProfileRoutes }