import { useNavigate } from "react-router-dom"


export const useRoute = () => { 
    const navigate = useNavigate();

    const goToProfile = (id:string) => {
        navigate(`/profile/${id}`);
    }
    

    return { goToProfile };
}