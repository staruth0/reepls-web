import { useNavigate } from "react-router-dom"


export const useRoute = () => { 
    const navigate = useNavigate();

    const goToProfile = (username:string) => {
        navigate(`/profile/${username}`);
    }
    

    return { goToProfile };
}