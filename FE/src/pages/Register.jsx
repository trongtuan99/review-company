import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Đăng ký thất bại');
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Đăng ký</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Nguyễn"
              />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Văn A"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+84123456789"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

