import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkphone() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to email check immediately
    navigate('/auth/register/checkemail', { replace: true });
  }, [navigate]);

  return null; // This component will redirect, so no UI needed
}

export default Checkphone;