import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { userApi } from '../api/http';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';

const isBlank = (value) => value.trim().length === 0;

const validateLogin = (form) => ({
  username: isBlank(form.username) ? 'Vui lòng nhập tên đăng nhập.' : '',
  password: isBlank(form.password) ? 'Vui lòng nhập mật khẩu.' : '',
});

const emptyLine = '\u00a0';

function LoginPage() {
  const { user, login, logout } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginTouched, setLoginTouched] = useState({ username: false, password: false });
  const [loginErrors, setLoginErrors] = useState({ username: '', password: '' });
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const [loginStatusTone, setLoginStatusTone] = useState('idle');

  const updateLoginField = (field, value) => {
    const nextForm = { ...loginForm, [field]: value };
    const nextErrors = validateLogin(nextForm);

    setLoginForm(nextForm);
    setLoginErrors((current) => ({
      ...current,
      [field]: loginTouched[field] ? nextErrors[field] : '',
    }));
    setLoginStatus('');
    setLoginStatusTone('idle');
  };

  const handleLoginBlur = (field) => {
    setLoginTouched((current) => ({ ...current, [field]: true }));
    setLoginErrors(validateLogin(loginForm));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    const nextTouched = { username: true, password: true };
    const nextErrors = validateLogin(loginForm);

    setLoginTouched(nextTouched);
    setLoginErrors(nextErrors);

    if (nextErrors.username || nextErrors.password) {
      setLoginStatus('Vui lòng sửa các trường được đánh dấu.');
      setLoginStatusTone('error');
      return;
    }

    setLoginSubmitting(true);
    setLoginStatus('');
    setLoginStatusTone('idle');

    try {
      const response = await userApi.post('/login', loginForm);
      login(response.data);
      setLoginStatus(`Chào mừng ${response.data.username}.`);
      setLoginStatusTone('success');
    } catch (error) {
      setLoginStatus(error.response?.data?.error || 'Đăng nhập thất bại.');
      setLoginStatusTone('error');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const helperText = (touched, error) => (touched && error ? error : emptyLine);

  const statusClass = (tone) => {
    if (tone === 'error') return 'status-line status-error';
    if (tone === 'success') return 'status-line status-success';
    return 'status-line';
  };

  if (user) {
    return <Navigate to="/foods" replace />;
  }

  return (
    <AuthLayout>
      <div className="auth-layout__forms auth-layout__forms--single">
        {!user ? (
          <section className="card stack form-card">
            <header className="auth-header">
              <h2>Đăng nhập</h2>
              <p className="auth-header__subtitle">Nhập thông tin tài khoản để tiếp tục</p>
            </header>
            <form className="stack" onSubmit={onLogin} noValidate>
              <label className="field">
                <span>Tên đăng nhập</span>
                <input
                  placeholder="ten.dang.nhap"
                  value={loginForm.username}
                  onChange={(e) => updateLoginField('username', e.target.value)}
                  onBlur={() => handleLoginBlur('username')}
                  className={loginTouched.username && loginErrors.username ? 'input-error' : ''}
                  aria-invalid={Boolean(loginTouched.username && loginErrors.username)}
                />
                <small className={loginTouched.username && loginErrors.username ? 'helper helper-error' : 'helper'}>
                  {helperText(loginTouched.username, loginErrors.username)}
                </small>
              </label>
              <label className="field">
                <span>Mật khẩu</span>
                <input
                  placeholder="••••••••"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => updateLoginField('password', e.target.value)}
                  onBlur={() => handleLoginBlur('password')}
                  className={loginTouched.password && loginErrors.password ? 'input-error' : ''}
                  aria-invalid={Boolean(loginTouched.password && loginErrors.password)}
                />
                <small className={loginTouched.password && loginErrors.password ? 'helper helper-error' : 'helper'}>
                  {helperText(loginTouched.password, loginErrors.password)}
                </small>
              </label>
              <button type="submit" className="alt" disabled={loginSubmitting}>
                {loginSubmitting && <span className="spinner" aria-hidden="true" />}
                <span>{loginSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              </button>
              <p className={statusClass(loginStatusTone)}>{loginStatus || emptyLine}</p>
              
              <footer className="form-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p className="section-subtitle">
                  Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Đăng ký ngay</Link>
                </p>
              </footer>
            </form>
          </section>
        ) : (
          <section className="card stack form-card">
            <h2>Tài khoản hiện tại</h2>
            <p className="section-subtitle">Bạn đã đăng nhập thành công vào hệ thống.</p>
            <div className="stack">
              <div className="row spread">
                <span>Tên người dùng</span>
                <strong>{user.username}</strong>
              </div>
              <div className="row spread">
                <span>Vai trò</span>
                <strong>{user.role}</strong>
              </div>
              <button type="button" className="alt" onClick={logout}>
                Đăng xuất tài khoản hiện tại
              </button>
            </div>
          </section>
        )}
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
