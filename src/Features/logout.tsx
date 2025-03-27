import { useDispatch } from 'react-redux';
import { logout } from './loginSlice'; // adjust the import path
import { useNavigate } from 'react-router-dom'; // assuming you're using react-router

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());

    // Optional: Redirect to login page or home page
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;