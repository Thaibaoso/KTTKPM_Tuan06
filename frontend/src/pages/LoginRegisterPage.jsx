import { useState } from 'react';
import { userApi } from '../api/http';
import { useAuth } from '../context/AuthContext';

function LoginRegisterPage() {
  const { login } = useAuth();
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', role: 'USER' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const onRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await userApi.post('/register', registerForm);
      setMessage(`Registered: ${response.data.username}`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Register failed');
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await userApi.post('/login', loginForm);
      login(response.data);
      setMessage(`Welcome ${response.data.username}`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="page-grid auth-grid">
      <section className="hero card">
        <p className="eyebrow">Mini Food Ordering System</p>
        <h1>Register, browse, order, and pay across isolated services.</h1>
        <p className="lede">
          User, food, order, and payment flows are split into separate Spring Boot services and
          connected with HTTP calls.
        </p>
        <div className="status-chip-row">
          <span className="chip">User 8081</span>
          <span className="chip">Food 8082</span>
          <span className="chip">Order 8083</span>
          <span className="chip">Payment 8084</span>
        </div>
      </section>

      <section className="card stack">
        <h2>Register</h2>
        <form className="stack" onSubmit={onRegister}>
          <input
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
          />
          <select
            value={registerForm.role}
            onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </section>

      <section className="card stack">
        <h2>Login</h2>
        <form className="stack" onSubmit={onLogin}>
          <input
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
          <button type="submit" className="alt">
            Login
          </button>
        </form>
      </section>

      {message && <div className="card notice full-span">{message}</div>}
    </div>
  );
}

export default LoginRegisterPage;
