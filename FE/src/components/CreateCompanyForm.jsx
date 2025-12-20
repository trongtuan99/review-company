import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companyService } from '../services/companyService';
import './CreateCompanyForm.css';

const CreateCompanyForm = ({ searchQuery, onSuccess, onCancel }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: searchQuery || '',
    owner: '',
    phone: '',
    main_office: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Tên công ty phải có ít nhất 2 ký tự');
      return;
    }

    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để tạo công ty');
      return;
    }

    try {
      setLoading(true);
      const response = await companyService.createCompany(formData);
      
      if (response.status === 'ok' || response.status === 'success') {
        const company = response.data;
        if (onSuccess) {
          onSuccess(company);
        } else {
          navigate(`/companies/${company.id}`);
        }
      } else {
        setError(response.message || 'Không thể tạo công ty');
      }
    } catch (err) {
      setError(err.message || err.error || 'Không thể tạo công ty');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-company-form">
        <div className="info-message">
          <p>Vui lòng <a href="/login">đăng nhập</a> để tạo công ty mới.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-company-form">
      <h3>Tạo công ty mới</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên công ty *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            placeholder="Tên công ty..."
          />
        </div>
        <div className="form-group">
          <label>Chủ sở hữu *</label>
          <input
            type="text"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            required
            placeholder="Tên chủ sở hữu..."
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+84123456789"
          />
        </div>
        <div className="form-group">
          <label>Văn phòng chính</label>
          <input
            type="text"
            name="main_office"
            value={formData.main_office}
            onChange={handleChange}
            placeholder="Địa chỉ văn phòng..."
          />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>
        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Hủy
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang tạo...' : 'Tạo công ty'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyForm;

