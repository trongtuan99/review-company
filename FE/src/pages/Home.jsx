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
  const [topCompanies, setTopCompanies] = useState([]);
  const [remainingCompanies, setRemainingCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!isSearching) {
      loadAllCompanies();
    }
  }, []);

  const loadAllCompanies = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTopCompanies(), loadRemainingCompanies()]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopCompanies = async () => {
    try {
      const response = await companyService.getTopRatedCompanies();
      if (response.status === 'ok' || response.status === 'success') {
        setTopCompanies(response.data || []);
      }
    } catch (err) {
      console.error('Load top companies error:', err);
    }
  };

  const loadRemainingCompanies = async () => {
    try {
      // First get top companies to exclude them
      const topResponse = await companyService.getTopRatedCompanies();
      const topIds = (topResponse.data || []).map(c => c.id);
      
      if (topIds.length > 0) {
        const response = await companyService.getRemainingCompanies(topIds, { limit: 20 });
        if (response.status === 'ok' || response.status === 'success') {
          setRemainingCompanies(response.data || []);
        }
      } else {
        // If no top companies, load first 20
        const response = await companyService.getCompanies(null, { limit: 20 });
        if (response.status === 'ok' || response.status === 'success') {
          setRemainingCompanies(response.data || []);
        }
      }
    } catch (err) {
      console.error('Load remaining companies error:', err);
    }
  };

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
      setIsSearching(false);
      setShowCreateForm(false);
      loadAllCompanies();
      return;
    }

    setIsSearching(true);
    setShowCreateForm(false);
    await loadCompanies(searchQuery);
  };

  const handleCompanyCreated = async (company) => {
    setShowCreateForm(false);
    setSearchQuery('');
    setIsSearching(false);
    // Reload companies list to show the new company
    await loadTopCompanies();
    await loadRemainingCompanies();
    // Scroll to top to see the new company in the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAll = () => {
    setSearchQuery('');
    setIsSearching(false);
    setShowCreateForm(false);
    loadAllCompanies();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(topCompanies.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(topCompanies.length / 3)) % Math.ceil(topCompanies.length / 3));
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
        <h1>Tìm hiểu về công ty trước khi ứng tuyển</h1>
        <p>Khám phá đánh giá thực tế từ nhân viên và cựu nhân viên</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm công ty, vị trí hoặc từ khóa..."
            className="search-input"
          />
          <button type="submit" className="btn-primary search-btn">
            Tìm kiếm
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleViewAll}
              className="btn-secondary"
            >
              Xóa
            </button>
          )}
        </form>
        {isSearching && companies.length > 0 && (
          <div className="view-all-section">
            <button
              type="button"
              onClick={handleViewAll}
              className="view-all-btn"
            >
              Xem tất cả công ty
            </button>
          </div>
        )}
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

      {/* Top Rated Companies Slider - Only show when not searching */}
      {!isSearching && topCompanies.length > 0 && (
        <div className="top-companies-section">
          <div className="top-companies-header">
            <h2>🏆 Top 10 Công Ty Đánh Giá Cao Nhất</h2>
          </div>
          <div className="companies-slider">
            <button 
              className="slider-btn prev-btn" 
              onClick={prevSlide}
              aria-label="Previous"
            >
              ‹
            </button>
            <div className="slider-container">
              <div 
                className="slider-track" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(topCompanies.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="slider-slide">
                    {topCompanies.slice(slideIndex * 3, slideIndex * 3 + 3).map((company) => (
                      <Link
                        key={company.id}
                        to={`/companies/${company.id}`}
                        className="company-card featured"
                      >
                        <div className="company-badge">Top Rated</div>
                        <div className="company-header">
                          <h3>{company.name}</h3>
                          <div className="company-score">
                            <span>⭐</span>
                            <span>{company.avg_score?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                        <div className="company-info">
                          <p className="company-owner">
                            <span className="icon">👤</span>
                            <span>{company.owner}</span>
                          </p>
                          <p className="company-reviews">
                            <span className="icon">📝</span>
                            <span>{company.total_reviews || 0} đánh giá</span>
                          </p>
                          {company.main_office && (
                            <p className="company-location">
                              <span className="icon">📍</span>
                              <span>{company.main_office}</span>
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button 
              className="slider-btn next-btn" 
              onClick={nextSlide}
              aria-label="Next"
            >
              ›
            </button>
          </div>
          <div className="slider-dots">
            {Array.from({ length: Math.ceil(topCompanies.length / 3) }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results or Remaining Companies */}
      <div className="companies-section">
        {isSearching && companies.length > 0 && (
          <div className="companies-header">
            <h2>Kết quả tìm kiếm ({companies.length})</h2>
          </div>
        )}
        {!isSearching && remainingCompanies.length > 0 && (
          <div className="companies-header">
            <h2>Tất cả công ty khác</h2>
            <p className="companies-subtitle">Hiển thị {remainingCompanies.length} công ty đầu tiên</p>
          </div>
        )}
        <div className="companies-grid">
          {(isSearching ? companies : remainingCompanies).length === 0 && !loading ? (
            <div className="empty-state">
              {isSearching ? (
                <p>Không tìm thấy công ty nào</p>
              ) : (
                <p>Chưa có công ty nào</p>
              )}
            </div>
          ) : (
            (isSearching ? companies : remainingCompanies).map((company) => (
            <Link
              key={company.id}
              to={`/companies/${company.id}`}
              className="company-card"
            >
              <div className="company-header">
                <h3>{company.name}</h3>
                <div className="company-score">
                  <span>⭐</span>
                  <span>{company.avg_score?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <div className="company-info">
                <p className="company-owner">
                  <span className="icon">👤</span>
                  <span>{company.owner}</span>
                </p>
                <p className="company-reviews">
                  <span className="icon">📝</span>
                  <span>{company.total_reviews || 0} đánh giá</span>
                </p>
                {company.main_office && (
                  <p className="company-location">
                    <span className="icon">📍</span>
                    <span>{company.main_office}</span>
                  </p>
                )}
              </div>
            </Link>
            ))
          )}
        </div>
        {!isSearching && remainingCompanies.length >= 20 && (
          <div className="show-all-section">
            <Link to="/companies" className="show-all-btn">
              Xem tất cả công ty →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

