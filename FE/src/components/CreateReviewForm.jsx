import { useState } from 'react';
import { reviewService } from '../services/reviewService';
import './CreateReviewForm.css';

const CreateReviewForm = ({ companyId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    reviews_content: '',
    score: 5,
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

    if (!formData.title || formData.title.length < 5) {
      setError('Tiêu đề phải có ít nhất 5 ký tự');
      return;
    }

    try {
      setLoading(true);
      const response = await reviewService.createReview(companyId, formData);
      console.log('Create review response:', response); // Debug
      
      // Backend returns status: 'ok' (not 'success')
      if (response.status === 'ok' || response.status === 'success') {
        onSuccess?.();
        setFormData({ title: '', reviews_content: '', score: 5 });
      } else {
        setError(response.message || 'Không thể tạo đánh giá');
      }
    } catch (err) {
      console.error('Create review error:', err); // Debug
      setError(err.message || err.error || 'Không thể tạo đánh giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-review-form">
      <h3>Viết đánh giá</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={100}
            placeholder="Tiêu đề đánh giá..."
          />
        </div>
        <div className="form-group">
          <label>Điểm đánh giá (1-10)</label>
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min={1}
            max={10}
            required
          />
        </div>
        <div className="form-group">
          <label>Nội dung đánh giá</label>
          <textarea
            name="reviews_content"
            value={formData.reviews_content}
            onChange={handleChange}
            rows={5}
            placeholder="Chia sẻ trải nghiệm của bạn..."
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReviewForm;

