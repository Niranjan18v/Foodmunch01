import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="https://ik.imagekit.io/w3efjbdfv/FOOD%20STORE%20PROJECT/food-munch-img.webp?updatedAt=1756443677939"
            alt="FoodMunch Logo"
            style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <span>FoodMunch</span>
        </Link>

        <div className="navbar-right">
          <div className="navbar-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
            <Link to="/book" className={`nav-link ${isActive('/book') ? 'active' : ''}`}>Book Table</Link>
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-action-btn dashboard-btn">
                  <LayoutDashboard size={18} />
                  {user.role !== 'customer' ? (
                    <span className="role-badge">{user.role.toUpperCase()}</span>
                  ) : (
                    <span>Profile</span>
                  )}
                </Link>
                <button onClick={handleLogout} className="nav-action-btn logout-btn">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-action-btn login-btn">
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="nav-action-btn register-btn">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
