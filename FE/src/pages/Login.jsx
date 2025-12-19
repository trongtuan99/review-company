import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        {error && (
          <div className="error-message">
            <p style={{ whiteSpace: 'pre-line', marginBottom: '10px' }}>{error}</p>
            {(error.includes('Network Error') || error.includes('kết nối đến server')) && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '5px' }}>
                <p style={{ marginBottom: '5px' }}><strong>URL hiện tại:</strong> <code>{API_BASE_URL}</code></p>
                <p style={{ marginTop: '5px', marginBottom: '0' }}>💡 Cập nhật file <code>FE/.env</code> với ngrok URL và restart Vite server</p>
              </div>
            )}
            {(error.includes('404') || error.includes('không tìm thấy')) && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '5px' }}>
                <p style={{ marginBottom: '5px' }}><strong>URL đang gọi:</strong> <code style={{ fontSize: '10px', wordBreak: 'break-all' }}>{API_BASE_URL}/auth/sign_in</code></p>
                <p style={{ marginTop: '10px', marginBottom: '5px' }}>💡 Kiểm tra:</p>
                <ul style={{ marginLeft: '20px', marginTop: '5px', marginBottom: '0' }}>
                  <li>Ngrok tunnel đang chạy: <code>ngrok http 3000</code></li>
                  <li>Rails server đang chạy: <code>rails s</code></li>
                  <li>URL trong <code>.env</code> đúng: <code>https://your-ngrok-url.ngrok-free.app/api/v1</code></li>
                  <li>Restart Vite server sau khi thay đổi <code>.env</code></li>
                </ul>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

