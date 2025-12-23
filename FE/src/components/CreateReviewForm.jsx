import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviewMutationsExtended } from '../hooks/useReviewMutationsExtended';
import StarRating from './StarRating';
import './CreateReviewForm.css';

const CreateReviewForm = ({ companyId, onSuccess, onCancel }) => {
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
  const { createReview, isCreating } = useReviewMutationsExtended(companyId);

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

  const getRatingLabel = (score) => {
    if (score <= 3) return 'Không hài lòng';
    if (score <= 5) return 'Tạm được';
    if (score <= 7) return 'Hài lòng';
    if (score <= 9) return 'Rất hài lòng';
    return 'Tuyệt vời';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

      await createReview({ companyId, reviewData: submitData });
      onSuccess?.();
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
    } catch (err) {
      setError(err.message || err.error || 'Không thể tạo đánh giá');
    }
  };

  return (
    <div className="create-review-form">
      <div className="form-header">
        <h3>Viết đánh giá</h3>
        <Link to="/guidelines" className="guidelines-link">
          📋 Xem hướng dẫn
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Rating Section */}
        <div className="form-section">
          <div className="section-title">Đánh giá tổng quan</div>
          <div className="form-group">
            <label>Điểm đánh giá (1-10) *</label>
            <div className="rating-container">
              <StarRating
                value={formData.score}
                onChange={(score) => setFormData(prev => ({ ...prev, score }))}
              />
              <span className="rating-label">{getRatingLabel(formData.score)}</span>
            </div>
          </div>
        </div>

        {/* Job Info Section */}
        <div className="form-section">
          <div className="section-title">Thông tin công việc</div>
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

        {/* Review Content Section */}
        <div className="form-section">
          <div className="section-title">Nội dung đánh giá</div>

          <div className="form-group">
            <label>Tiêu đề đánh giá *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={100}
              placeholder="VD: Môi trường làm việc tốt, nhiều cơ hội phát triển"
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
              <label>👍 Ưu điểm</label>
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
              <label>👎 Nhược điểm</label>
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
            <label>💡 Lời khuyên cho ban lãnh đạo</label>
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

        {/* Privacy Section */}
        <div className="form-section">
          <div className="section-title">Tùy chọn hiển thị</div>
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
              Nếu chọn, tên của bạn sẽ không được hiển thị công khai. Chỉ hiển thị "Người dùng ẩn danh".
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Hủy
          </button>
          <button type="submit" disabled={isCreating} className="btn-primary">
            {isCreating ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReviewForm;
