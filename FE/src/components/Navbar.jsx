import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Review Company
        </Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Xin chào, {user?.first_name} {user?.last_name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Đăng nhập
              </Link>
              <Link to="/register" className="navbar-link btn-primary">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

