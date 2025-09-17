import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterWithPhone1() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to email registration step 1 immediately
    navigate('/auth/register/email/one', { replace: true });
  }, [navigate]);

  return null; // This component will redirect, so no UI needed
}

export default RegisterWithPhone1;