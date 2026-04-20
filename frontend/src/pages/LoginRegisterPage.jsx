import { useState } from 'react';
import { userApi } from '../api/http';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';

const isBlank = (value) => value.trim().length === 0;

const validateRegister = (form) => ({
  username: isBlank(form.username) ? 'Vui lòng nhập tên đăng nhập.' : '',
  password: form.password.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự.' : '',
});

const validateLogin = (form) => ({
  username: isBlank(form.username) ? 'Vui lòng nhập tên đăng nhập.' : '',
  password: isBlank(form.password) ? 'Vui lòng nhập mật khẩu.' : '',
});

const emptyLine = '\u00a0';

function LoginRegisterPage() {
  const { user, login, logout } = useAuth();
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', role: 'USER' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerTouched, setRegisterTouched] = useState({ username: false, password: false });
  const [loginTouched, setLoginTouched] = useState({ username: false, password: false });
  const [registerErrors, setRegisterErrors] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ username: '', password: '' });
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [registerStatus, setRegisterStatus] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [registerStatusTone, setRegisterStatusTone] = useState('idle');
  const [loginStatusTone, setLoginStatusTone] = useState('idle');

  const updateRegisterField = (field, value) => {
    const nextForm = { ...registerForm, [field]: value };
    const nextErrors = validateRegister(nextForm);

    setRegisterForm(nextForm);
    setRegisterErrors((current) => ({
      ...current,
      [field]: registerTouched[field] ? nextErrors[field] : '',
    }));
    setRegisterStatus('');
    setRegisterStatusTone('idle');
  };

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

  const handleRegisterBlur = (field) => {
    setRegisterTouched((current) => ({ ...current, [field]: true }));
    setRegisterErrors(validateRegister(registerForm));
  };

  const handleLoginBlur = (field) => {
    setLoginTouched((current) => ({ ...current, [field]: true }));
    setLoginErrors(validateLogin(loginForm));
  };

  const onRegister = async (event) => {
    event.preventDefault();

    const nextTouched = { username: true, password: true };
    const nextErrors = validateRegister(registerForm);

    setRegisterTouched(nextTouched);
    setRegisterErrors(nextErrors);

    if (nextErrors.username || nextErrors.password) {
      setRegisterStatus('Vui lòng sửa các trường được đánh dấu.');
      setRegisterStatusTone('error');
      return;
    }

    setRegisterSubmitting(true);
    setRegisterStatus('');
    setRegisterStatusTone('idle');

    try {
      const response = await userApi.post('/register', registerForm);
      setRegisterStatus(`Đã đăng ký: ${response.data.username}.`);
      setRegisterStatusTone('success');
    } catch (error) {
      setRegisterStatus(error.response?.data?.error || 'Đăng ký thất bại.');
      setRegisterStatusTone('error');
    } finally {
      setRegisterSubmitting(false);
    }
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

  return (
    <AuthLayout>
      <div className={`auth-layout__forms ${user ? 'auth-layout__forms--single' : ''}`}>
        <section className="card stack form-card">
          <h2>Đăng ký</h2>
          <p className="section-subtitle">Tạo tài khoản dùng thử để kiểm tra luồng đặt món và thanh toán.</p>
          <form className="stack" onSubmit={onRegister} noValidate>
            <label className="field">
              <span>Tên đăng nhập</span>
              <input
                placeholder="Nhập tên đăng nhập"
                value={registerForm.username}
                onChange={(e) => updateRegisterField('username', e.target.value)}
                onBlur={() => handleRegisterBlur('username')}
                className={registerTouched.username && registerErrors.username ? 'input-error' : ''}
                aria-invalid={Boolean(registerTouched.username && registerErrors.username)}
              />
              <small className={registerTouched.username && registerErrors.username ? 'helper helper-error' : 'helper'}>
                {helperText(registerTouched.username, registerErrors.username)}
              </small>
            </label>
            <label className="field">
              <span>Mật khẩu</span>
              <input
                placeholder="Nhập mật khẩu"
                type="password"
                value={registerForm.password}
                onChange={(e) => updateRegisterField('password', e.target.value)}
                onBlur={() => handleRegisterBlur('password')}
                className={registerTouched.password && registerErrors.password ? 'input-error' : ''}
                aria-invalid={Boolean(registerTouched.password && registerErrors.password)}
              />
              <small className={registerTouched.password && registerErrors.password ? 'helper helper-error' : 'helper'}>
                {helperText(registerTouched.password, registerErrors.password)}
              </small>
            </label>
            <label className="field">
              <span>Vai trò</span>
              <select value={registerForm.role} onChange={(e) => updateRegisterField('role', e.target.value)}>
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </label>
            <button type="submit" disabled={registerSubmitting}>
              {registerSubmitting && <span className="spinner" aria-hidden="true" />}
              <span>{registerSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}</span>
            </button>
            <p className={statusClass(registerStatusTone)}>{registerStatus || emptyLine}</p>
          </form>
        </section>

        {!user ? (
          <section className="card stack form-card">
            <h2>Đăng nhập</h2>
            <p className="section-subtitle">Đăng nhập để đặt món và mô phỏng thanh toán.</p>
            <form className="stack" onSubmit={onLogin} noValidate>
              <label className="field">
                <span>Tên đăng nhập</span>
                <input
                  placeholder="Nhập tên đăng nhập"
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
                  placeholder="Nhập mật khẩu"
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

export default LoginRegisterPage;