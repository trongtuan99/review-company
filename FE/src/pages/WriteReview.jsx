import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCompanies, useCompany } from '../hooks';
import { useReviewMutationsExtended } from '../hooks/useReviewMutationsExtended';
import StarRating from '../components/StarRating';
import './WriteReview.css';

const WriteReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCompanyId = searchParams.get('company');

  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    reviews_content: '',
    score: 5,
    job_title: '',
    custom_job_title: '',
    is_anonymous: false,
    pros: '',
    cons: '',
    advice: '',
  });
  const [error, setError] = useState('');

  const { data: companiesResponse } = useCompanies(1, searchTerm);
  const { data: selectedCompanyResponse } = useCompany(selectedCompanyId);
  const { createReview, isCreating } = useReviewMutationsExtended(selectedCompanyId);

  const companies = companiesResponse?.data || [];
  const selectedCompany = selectedCompanyResponse?.data || selectedCompanyResponse;

  useEffect(() => {
    if (preselectedCompanyId) {
      setSelectedCompanyId(preselectedCompanyId);
    }
  }, [preselectedCompanyId]);

  const commonJobTitles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'QA Engineer',
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Data Analyst',
    'Data Scientist',
    'UI/UX Designer',
    'Marketing Manager',
    'Sales Manager',
    'HR Manager',
    'Accountant',
    'Customer Support',
    'Intern',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCompanySelect = (company) => {
    setSelectedCompanyId(company.id);
    setSearchTerm(company.name);
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    if (!e.target.value) {
      setSelectedCompanyId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCompanyId) {
      setError('Vui lòng chọn công ty bạn muốn đánh giá');
      return;
    }

    if (!formData.title || formData.title.length < 5) {
      setError('Tiêu đề phải có ít nhất 5 ký tự');
      return;
    }

    if (!formData.reviews_content || formData.reviews_content.length < 20) {
      setError('Nội dung đánh giá phải có ít nhất 20 ký tự');
      return;
    }

    try {
      // Combine pros, cons, advice into reviews_content using special delimiters
      let fullContent = formData.reviews_content;
      if (formData.pros) {
        fullContent += `\n\n[PROS]\n${formData.pros}`;
      }
      if (formData.cons) {
        fullContent += `\n\n[CONS]\n${formData.cons}`;
      }
      if (formData.advice) {
        fullContent += `\n\n[ADVICE]\n${formData.advice}`;
      }

      const submitData = {
        title: formData.title,
        reviews_content: fullContent,
        score: formData.score,
        job_title: formData.job_title === 'Other' ? formData.custom_job_title : formData.job_title,
        is_anonymous: formData.is_anonymous,
      };

      await createReview({ companyId: selectedCompanyId, reviewData: submitData });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || err.error || 'Không thể tạo đánh giá. Vui lòng thử lại.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="write-review-page">
        <div className="write-review-container">
          <div className="auth-required">
            <div className="auth-icon">🔒</div>
            <h2>Đăng nhập để viết đánh giá</h2>
            <p>Bạn cần đăng nhập để có thể chia sẻ trải nghiệm làm việc của mình.</p>
            <div className="auth-actions">
              <Link to="/login" className="btn-primary">Đăng nhập</Link>
              <Link to="/register" className="btn-secondary">Đăng ký</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="write-review-page">
        <div className="write-review-container">
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h2>Cảm ơn bạn đã đánh giá!</h2>
            <p>Đánh giá của bạn đã được gửi thành công và sẽ được hiển thị sau khi được xét duyệt.</p>
            <div className="success-actions">
              <button onClick={() => navigate(`/companies/${selectedCompanyId}`)} className="btn-primary">
                Xem công ty
              </button>
              <button onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: '',
                  reviews_content: '',
                  score: 5,
                  job_title: '',
                  custom_job_title: '',
                  is_anonymous: false,
                  pros: '',
                  cons: '',
                  advice: '',
                });
                setSelectedCompanyId(null);
                setSearchTerm('');
              }} className="btn-secondary">
                Viết đánh giá khác
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="write-review-page">
      <div className="write-review-container">
        <div className="page-header">
          <h1>Viết đánh giá</h1>
          <p>Chia sẻ trải nghiệm làm việc của bạn để giúp đỡ cộng đồng</p>
        </div>

        <div className="guidelines-reminder">
          <div className="reminder-icon">💡</div>
          <div className="reminder-content">
            <strong>Lưu ý khi viết đánh giá</strong>
            <p>Đánh giá trung thực, cụ thể và cân bằng sẽ hữu ích nhất cho cộng đồng.
              <Link to="/guidelines"> Xem hướng dẫn đầy đủ →</Link>
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="review-form">
          {/* Company Selection */}
          <div className="form-section">
            <h3>1. Chọn công ty</h3>
            <div className="form-group company-search">
              <label>Công ty bạn muốn đánh giá *</label>
              <div className="search-container">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Tìm kiếm công ty..."
                  className="search-input"
                />
                {showDropdown && searchTerm && companies.length > 0 && (
                  <div className="company-dropdown">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="dropdown-item"
                        onClick={() => handleCompanySelect(company)}
                      >
                        <div className="company-name">{company.name}</div>
                        <div className="company-info-small">
                          ⭐ {company.avg_score?.toFixed(1) || '0.0'} • {company.total_reviews || 0} đánh giá
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCompany && (
                <div className="selected-company">
                  <span className="selected-label">Đã chọn:</span>
                  <span className="selected-name">{selectedCompany.name}</span>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => {
                      setSelectedCompanyId(null);
                      setSearchTerm('');
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="form-section">
            <h3>2. Đánh giá tổng quan</h3>
            <div className="form-group">
              <label>Điểm đánh giá (1-10) *</label>
              <div className="rating-container">
                <StarRating
                  value={formData.score}
                  onChange={(score) => setFormData(prev => ({ ...prev, score }))}
                />
                <span className="rating-label">
                  {formData.score <= 3 ? 'Không hài lòng' :
                   formData.score <= 5 ? 'Tạm được' :
                   formData.score <= 7 ? 'Hài lòng' :
                   formData.score <= 9 ? 'Rất hài lòng' : 'Tuyệt vời'}
                </span>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="form-section">
            <h3>3. Thông tin công việc</h3>
            <div className="form-group">
              <label>Chức danh của bạn</label>
              <select
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Chọn chức danh --</option>
                {commonJobTitles.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
              {formData.job_title === 'Other' && (
                <input
                  type="text"
                  name="custom_job_title"
                  value={formData.custom_job_title}
                  onChange={handleChange}
                  placeholder="Nhập chức danh của bạn..."
                  className="form-input mt-2"
                />
              )}
            </div>
          </div>

          {/* Review Content */}
          <div className="form-section">
            <h3>4. Nội dung đánh giá</h3>

            <div className="form-group">
              <label>Tiêu đề đánh giá *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Môi trường làm việc tốt, nhiều cơ hội phát triển"
                maxLength={100}
                className="form-input"
              />
              <span className="char-count">{formData.title.length}/100</span>
            </div>

            <div className="form-group">
              <label>Trải nghiệm tổng quan *</label>
              <textarea
                name="reviews_content"
                value={formData.reviews_content}
                onChange={handleChange}
                rows={4}
                placeholder="Chia sẻ trải nghiệm chung của bạn khi làm việc tại công ty..."
                className="form-textarea"
              />
              <span className="char-count">{formData.reviews_content.length} ký tự (tối thiểu 20)</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ưu điểm</label>
                <textarea
                  name="pros"
                  value={formData.pros}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Những điểm tích cực..."
                  className="form-textarea"
                />
              </div>
              <div className="form-group">
                <label>Nhược điểm</label>
                <textarea
                  name="cons"
                  value={formData.cons}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Những điểm cần cải thiện..."
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lời khuyên cho ban lãnh đạo</label>
              <textarea
                name="advice"
                value={formData.advice}
                onChange={handleChange}
                rows={2}
                placeholder="Bạn có đề xuất gì cho công ty? (tùy chọn)"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Privacy */}
          <div className="form-section">
            <h3>5. Tùy chọn hiển thị</h3>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={handleChange}
                />
                <span>Đánh giá ẩn danh</span>
              </label>
              <p className="form-hint">
                Nếu chọn, tên của bạn sẽ không được hiển thị công khai.
                Chỉ hiển thị "Người dùng ẩn danh".
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Hủy
            </button>
            <button type="submit" disabled={isCreating || !selectedCompanyId} className="btn-primary">
              {isCreating ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;
