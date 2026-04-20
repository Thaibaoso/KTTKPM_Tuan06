import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <strong className="brand-mark">Mini Food Ordering</strong>
      <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/auth">
        Login/Register
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/foods">
        Food List
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/cart">
        Cart
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/checkout">
        Checkout
      </NavLink>
      <span className="nav-spacer nav-user">{user ? `User: ${user.username}` : 'Not logged in'}</span>
      {user && (
        <button type="button" className="alt" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default NavBar;
