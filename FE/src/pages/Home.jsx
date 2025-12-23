import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companyService } from '../services/companyService';
import { API_BASE_URL } from '../config/api';
import CreateCompanyForm from '../components/CreateCompanyForm';
import RecentReviews from '../components/RecentReviews';
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
  const [isPaused, setIsPaused] = useState(false);
  const [filterType, setFilterType] = useState('recent'); // 'recent' or 'top'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isSearching) {
      loadAllCompanies();
    }
  }, []);

  useEffect(() => {
    if (!isSearching && filterType) {
      setPage(1);
      setLoading(true);
      loadRemainingCompanies().finally(() => setLoading(false));
    }
  }, [filterType]);

  useEffect(() => {
    if (!isSearching && page > 1) {
      setLoading(true);
      loadRemainingCompanies().finally(() => setLoading(false));
    }
  }, [page]);

  // Auto-play slider
  useEffect(() => {
    if (isSearching || topCompanies.length === 0 || isPaused) return;
    
    const totalSlides = Math.ceil(topCompanies.length / 3);
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [topCompanies.length, isSearching, isPaused]);

  const loadAllCompanies = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTopCompanies(), loadRemainingCompanies()]);
    } catch (err) {
      console.error('Error loading companies:', err);
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
      // Silent fail for top companies
    }
  };

  const loadRemainingCompanies = async () => {
    try {
      const options = {
        page: page,
        perPage: 20,
        sortBy: filterType === 'top' ? 'avg_score' : 'created_at',
        sortOrder: 'desc',
      };
      
      if (filterType === 'top') {
        options.filterBy = 'highest_rated';
      }
      
      const response = await companyService.getCompanies(null, options);
      if (response.status === 'ok' || response.status === 'success') {
        setRemainingCompanies(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages || 1);
        }
      }
    } catch (err) {
      // Silent fail for remaining companies
    }
  };

  const loadCompanies = async (query = null) => {
    try {
      setLoading(true);
      setError('');
      const response = await companyService.getCompanies(query);
      
      if (response.status === 'ok' || response.status === 'success') {
        setCompanies(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách công ty');
      }
    } catch (err) {
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

  const formatEmployeeCount = (company) => {
    if (company.employee_count_range) {
      return company.employee_count_range;
    }
    if (company.employee_count_min && company.employee_count_max) {
      return `${company.employee_count_min} - ${company.employee_count_max} nhân viên`;
    }
    return null;
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-bg-decoration">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🏆</span>
            <span>Nền tảng đánh giá công ty #1 Việt Nam</span>
          </div>
          <h1 className="hero-title">
            Khám phá <span className="highlight">30,000+</span> đánh giá
            <br />từ <span className="highlight">15,000</span> công ty
          </h1>
          <p className="hero-subtitle">
            Tìm hiểu môi trường làm việc thực tế, đọc review từ nhân viên
            <br />và đưa ra quyết định nghề nghiệp đúng đắn
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">30K+</span>
              <span className="stat-label">Đánh giá</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-number">15K+</span>
              <span className="stat-label">Công ty</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Người dùng</span>
            </div>
          </div>
        </div>
        <div className="hero-search">
          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên công ty bạn muốn tìm..."
                className="hero-search-input"
              />
            </div>
            <button type="submit" className="hero-search-btn">
              <span className="btn-text">Tìm kiếm</span>
              <span className="btn-icon">→</span>
            </button>
          </form>
          <div className="search-suggestions">
            <span className="suggestion-label">Phổ biến:</span>
            <button type="button" onClick={() => { setSearchQuery('FPT'); }} className="suggestion-tag">FPT</button>
            <button type="button" onClick={() => { setSearchQuery('Viettel'); }} className="suggestion-tag">Viettel</button>
            <button type="button" onClick={() => { setSearchQuery('VNG'); }} className="suggestion-tag">VNG</button>
            <button type="button" onClick={() => { setSearchQuery('Grab'); }} className="suggestion-tag">Grab</button>
          </div>
        </div>
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
          <div 
            className="companies-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
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

      {/* Main Content with Sidebar */}
      {!isSearching && (
        <div className="main-content-layout">
          <div className="companies-main-section">
            {/* Filter Buttons */}
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterType === 'recent' ? 'active' : ''}`}
                onClick={() => setFilterType('recent')}
              >
                Mới cập nhật
              </button>
              <button
                className={`filter-btn ${filterType === 'top' ? 'active' : ''}`}
                onClick={() => setFilterType('top')}
              >
                Top công ty xịn
              </button>
            </div>

            {/* Companies List */}
            <div className="companies-list">
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
                    className="company-list-item"
                  >
                    <div className="company-list-header">
                      <h3 className="company-list-name">{company.name}</h3>
                      <div className="company-list-rating">
                        <span className="rating-stars">⭐</span>
                        <span className="rating-value">{company.avg_score?.toFixed(1) || '0.0'}</span>
                        <span className="rating-separator">sao</span>
                        <span className="rating-separator">|</span>
                        <span className="review-count">{company.total_reviews || 0} review</span>
                      </div>
                    </div>
                    <div className="company-list-info">
                      {company.industry && (
                        <span className="info-badge industry">{company.industry}</span>
                      )}
                      {formatEmployeeCount(company) && (
                        <span className="info-badge">{formatEmployeeCount(company)}</span>
                      )}
                      {company.main_office && (
                        <span className="info-badge location">📍 {company.main_office}</span>
                      )}
                      {company.is_hiring && (
                        <span className="hiring-badge">Tuyển gấp</span>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {!isSearching && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹ Trước
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-page ${page === pageNum ? 'active' : ''}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sau ›
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Recent Reviews */}
          <div className="sidebar-section">
            <RecentReviews limit={10} />
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching && (
        <div className="main-content-layout">
          <div className="companies-main-section">
            <div className="companies-header">
              <h2>Kết quả tìm kiếm ({companies.length})</h2>
            </div>
            <div className="companies-list">
              {companies.length === 0 && !loading ? (
                <div className="empty-state">
                  <p>Không tìm thấy công ty nào</p>
                </div>
              ) : (
                companies.map((company) => (
                  <Link
                    key={company.id}
                    to={`/companies/${company.id}`}
                    className="company-list-item"
                  >
                    <div className="company-list-header">
                      <h3 className="company-list-name">{company.name}</h3>
                      <div className="company-list-rating">
                        <span className="rating-stars">⭐</span>
                        <span className="rating-value">{company.avg_score?.toFixed(1) || '0.0'}</span>
                        <span className="rating-separator">sao</span>
                        <span className="rating-separator">|</span>
                        <span className="review-count">{company.total_reviews || 0} review</span>
                      </div>
                    </div>
                    <div className="company-list-info">
                      {company.industry && (
                        <span className="info-badge industry">{company.industry}</span>
                      )}
                      {formatEmployeeCount(company) && (
                        <span className="info-badge">{formatEmployeeCount(company)}</span>
                      )}
                      {company.main_office && (
                        <span className="info-badge location">📍 {company.main_office}</span>
                      )}
                      {company.is_hiring && (
                        <span className="hiring-badge">Tuyển gấp</span>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="sidebar-section">
            <RecentReviews limit={10} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

