import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <strong className="brand-mark">Mini Food Ordering</strong>
      {!user && (
        <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/login">
          Login
        </NavLink>
      )}
      <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/foods">
        Thực đơn
      </NavLink>
      {user?.role !== 'ADMIN' && (
        <>
          <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/cart">
            Giỏ hàng
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'current' : '')} to="/checkout">
            Thanh toán
          </NavLink>
        </>
      )}
      <span className="nav-spacer nav-user">{user ? `Người dùng: ${user.username}` : 'Chưa đăng nhập'}</span>
      {user && (
        <button type="button" className="alt" onClick={logout}>
          Đăng xuất
        </button>
      )}
    </nav>
  );
}

export default NavBar;
