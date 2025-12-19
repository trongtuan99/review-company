import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companyService } from '../services/companyService';
import { API_BASE_URL } from '../config/api';
import CreateCompanyForm from '../components/CreateCompanyForm';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async (query = null) => {
    try {
      setLoading(true);
      setError('');
      const response = await companyService.getCompanies(query);
      console.log('Companies response:', response); // Debug log
      
      // Backend returns status: 'ok' (not 'success')
      if (response.status === 'ok' || response.status === 'success') {
        setCompanies(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách công ty');
      }
    } catch (err) {
      console.error('Load companies error:', err); // Debug log
      let errorMessage = 'Không thể tải danh sách công ty';
      
      if (err.error === 'Network Error' || err.message?.includes('Network Error')) {
        errorMessage = err.message || 'Không thể kết nối đến server. Vui lòng kiểm tra lại URL API hoặc kết nối mạng.';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.error) {
        errorMessage = err.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadCompanies();
      setIsSearching(false);
      setShowCreateForm(false);
      return;
    }

    setIsSearching(true);
    setShowCreateForm(false);
    await loadCompanies(searchQuery);
  };

  const handleCompanyCreated = (company) => {
    setShowCreateForm(false);
    setSearchQuery('');
    setIsSearching(false);
    // Redirect to company detail
    navigate(`/companies/${company.id}`);
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
        {error.includes('Network Error') || error.includes('kết nối đến server') ? (
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#666', background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>💡 Thông tin debug:</p>
            <p style={{ marginBottom: '5px' }}><strong>URL hiện tại:</strong> <code style={{ background: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>{API_BASE_URL}</code></p>
            <p style={{ marginTop: '10px', marginBottom: '5px' }}>Kiểm tra lại:</p>
            <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '5px', marginLeft: '20px' }}>
              <li>File <code>.env</code> trong thư mục <code>FE/</code> có biến <code>VITE_API_BASE_URL</code></li>
              <li>Nếu dùng ngrok: URL phải là <code>https://your-url.ngrok-free.app/api/v1</code></li>
              <li>Ngrok tunnel đang chạy và URL đúng</li>
              <li>Rails server đang chạy trên port 3000 (nếu dùng localhost)</li>
              <li>Restart Vite dev server sau khi thay đổi <code>.env</code></li>
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1>Review Company</h1>
        <p>Khám phá và đánh giá các công ty</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm công ty..."
            className="search-input"
          />
          <button type="submit" className="btn-primary search-btn">
            🔍 Tìm kiếm
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
                setShowCreateForm(false);
                loadCompanies();
              }}
              className="btn-secondary"
            >
              Xóa
            </button>
          )}
        </form>
      </div>

      {/* Show create form if no results and user is searching */}
      {isSearching && companies.length === 0 && !loading && (
        <div className="no-results-section">
          <div className="no-results-message">
            <p>Không tìm thấy công ty nào với từ khóa "<strong>{searchQuery}</strong>"</p>
            {isAuthenticated ? (
              <button
                className="btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                + Tạo công ty mới
              </button>
            ) : (
              <p className="login-prompt">
                <a href="/login">Đăng nhập</a> để tạo công ty mới
              </p>
            )}
          </div>
        </div>
      )}

      {/* Create Company Form */}
      {showCreateForm && (
        <CreateCompanyForm
          searchQuery={searchQuery}
          onSuccess={handleCompanyCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="companies-grid">
        {companies.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có công ty nào</p>
          </div>
        ) : (
          companies.map((company) => (
            <Link
              key={company.id}
              to={`/companies/${company.id}`}
              className="company-card"
            >
              <div className="company-header">
                <h3>{company.name}</h3>
                <div className="company-score">
                  ⭐ {company.avg_score?.toFixed(1) || '0.0'}
                </div>
              </div>
              <div className="company-info">
                <p className="company-owner">👤 {company.owner}</p>
                <p className="company-reviews">
                  📝 {company.total_reviews || 0} đánh giá
                </p>
                {company.main_office && (
                  <p className="company-location">📍 {company.main_office}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

