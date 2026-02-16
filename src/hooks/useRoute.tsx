import { useNavigate } from "react-router-dom"


export const useRoute = () => { 
    const navigate = useNavigate();

    const goToProfile = (username:string) => {
        navigate(`/profile/${username}`);
    }
    const goToFollowingsPage = (username:string) => {
        navigate(`/profile/followings/${username}`);
    }
    

    return { goToProfile , goToFollowingsPage };
}