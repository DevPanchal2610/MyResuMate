import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component's only job is to clear localStorage and redirect.
const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    navigate("/auth"); // Redirect to the login page
  }, [navigate]);

  return null; // Render nothing
};

export default AdminLogout;