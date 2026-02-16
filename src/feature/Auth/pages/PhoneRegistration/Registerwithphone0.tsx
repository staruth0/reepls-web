import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterWithPhone0() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to email registration immediately
    navigate('/auth/register/email', { replace: true });
  }, [navigate]);

  return null; // This component will redirect, so no UI needed
}

export default RegisterWithPhone0;