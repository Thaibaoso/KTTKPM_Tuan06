import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { userApi } from '../api/http';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';

const isBlank = (value) => value.trim().length === 0;

const validateRegister = (form) => ({
  username: isBlank(form.username) ? 'Vui lòng nhập tên đăng nhập.' : '',
  password: form.password.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự.' : '',
});

const emptyLine = '\u00a0';

function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', role: 'USER' });
  const [registerTouched, setRegisterTouched] = useState({ username: false, password: false });
  const [registerErrors, setRegisterErrors] = useState({ username: '', password: '' });
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [registerStatus, setRegisterStatus] = useState('');
  const [registerStatusTone, setRegisterStatusTone] = useState('idle');

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

  const handleRegisterBlur = (field) => {
    setRegisterTouched((current) => ({ ...current, [field]: true }));
    setRegisterErrors(validateRegister(registerForm));
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
      setRegisterStatus(`Đã đăng ký: ${response.data.username}. Chuyển sang đăng nhập...`);
      setRegisterStatusTone('success');
      
      // Navigate to login after successful registration after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setRegisterStatus(error.response?.data?.error || 'Đăng ký thất bại.');
      setRegisterStatusTone('error');
    } finally {
      setRegisterSubmitting(false);
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
                placeholder="••••••••"
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
                <option value="USER">Khách hàng</option>
                <option value="ADMIN">Người quản trị</option>
              </select>
            </label>
            <button type="submit" disabled={registerSubmitting}>
              {registerSubmitting && <span className="spinner" aria-hidden="true" />}
              <span>{registerSubmitting ? 'Đang đăng ký...' : 'Đăng ký ngay'}</span>
            </button>
            <p className={statusClass(registerStatusTone)}>{registerStatus || emptyLine}</p>
            
            <footer className="form-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p className="section-subtitle">
                Đã có tài khoản? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Đăng nhập tại đây</Link>
              </p>
            </footer>
          </form>
        </section>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
