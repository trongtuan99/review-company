import { useState } from 'react';
import { replyService } from '../services/replyService';
import './CreateReplyForm.css';

const CreateReplyForm = ({ reviewId, onSuccess, onCancel }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung trả lời');
      return;
    }

    try {
      setLoading(true);
      const response = await replyService.createReply(reviewId, content);
      console.log('Create reply response:', response); // Debug
      
      // Backend returns status: 'ok' (not 'success')
      if (response.status === 'ok' || response.status === 'success') {
        onSuccess?.();
        setContent('');
      } else {
        setError(response.message || 'Không thể tạo trả lời');
      }
    } catch (err) {
      console.error('Create reply error:', err); // Debug
      setError(err.message || err.error || 'Không thể tạo trả lời');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-reply-form">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết trả lời..."
          rows={3}
          required
        />
        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Hủy
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang gửi...' : 'Gửi trả lời'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReplyForm;

