import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { favoriteService } from '../services/favoriteService';
import ProtectedRoute from '../components/ProtectedRoute';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadFavoriteCompanies();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      // Assuming we have a getProfile endpoint
      // For now, use the user from context
      setProfile(user);
      setFormData({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || ''
      });
    } catch (err) {
      console.error('Load profile error:', err);
      setError(err.message || 'Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // Assuming we have an updateProfile endpoint
      // const response = await userService.updateProfile(formData);
      // For now, just update local state
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      // Show success message
      alert('Cập nhật profile thành công!');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Không thể cập nhật profile');
    }
  };

  const loadFavoriteCompanies = async () => {
    try {
      setFavoritesLoading(true);
      const response = await favoriteService.getFavorites();
      if (response.status === 'ok' || response.status === 'success') {
        setFavoriteCompanies(response.data || []);
      }
    } catch (err) {
      console.error('Load favorites error:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFavorite = async (companyId) => {
    try {
      await favoriteService.removeFavorite(companyId);
      setFavoriteCompanies(favoriteCompanies.filter(c => c.id !== companyId));
    } catch (err) {
      console.error('Remove favorite error:', err);
      alert('Không thể xóa khỏi danh sách yêu thích');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="profile-container">
        <div className="profile-header">
          <Link to="/" className="back-link">← Quay lại trang chủ</Link>
          <h1>Hồ sơ của tôi</h1>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {profile?.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2>{profile?.first_name} {profile?.last_name}</h2>
              <p className="profile-email">{profile?.email}</p>
            </div>

            {!isEditing ? (
              <div className="profile-info">
                <div className="info-item">
                  <label>Họ và tên đệm</label>
                  <p>{profile?.first_name || 'Chưa cập nhật'}</p>
                </div>
                <div className="info-item">
                  <label>Tên</label>
                  <p>{profile?.last_name || 'Chưa cập nhật'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{profile?.email || 'Chưa cập nhật'}</p>
                </div>
                <div className="info-item">
                  <label>Vai trò</label>
                  <p className="role-badge">{profile?.role?.name || 'Người dùng'}</p>
                </div>
                <div className="profile-actions">
                  <button
                    className="btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa hồ sơ
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Họ và tên đệm *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên đệm"
                  />
                </div>
                <div className="form-group">
                  <label>Tên *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Nhập email"
                    disabled
                  />
                  <small>Email không thể thay đổi</small>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: profile?.first_name || '',
                        last_name: profile?.last_name || '',
                        email: profile?.email || ''
                      });
                    }}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="profile-stats">
            <h3>Hoạt động của tôi</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Đánh giá đã viết</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Bình luận đã viết</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👍</div>
                <div className="stat-value">0</div>
                <div className="stat-label">Lượt thích</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-value">{favoriteCompanies.length}</div>
                <div className="stat-label">Công ty yêu thích</div>
              </div>
            </div>
          </div>

          <div className="favorite-companies-section">
            <h3>Công ty yêu thích ({favoriteCompanies.length})</h3>
            {favoritesLoading ? (
              <div className="loading">Đang tải...</div>
            ) : favoriteCompanies.length === 0 ? (
              <div className="empty-favorites">
                <p>Bạn chưa yêu thích công ty nào</p>
                <Link to="/companies" className="browse-link">
                  Khám phá công ty →
                </Link>
              </div>
            ) : (
              <div className="favorite-companies-grid">
                {favoriteCompanies.map((company) => (
                  <div key={company.id} className="favorite-company-card">
                    <Link
                      to={`/companies/${company.id}`}
                      className="favorite-company-link"
                    >
                      <div className="favorite-company-header">
                        <h4>{company.name}</h4>
                        <div className="favorite-company-score">
                          ⭐ {company.avg_score?.toFixed(1) || '0.0'}
                        </div>
                      </div>
                      <div className="favorite-company-info">
                        <p>{company.total_reviews || 0} đánh giá</p>
                        {company.main_office && (
                          <p className="location">📍 {company.main_office}</p>
                        )}
                      </div>
                    </Link>
                    <button
                      className="remove-favorite-btn"
                      onClick={() => handleRemoveFavorite(company.id)}
                      title="Xóa khỏi yêu thích"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

