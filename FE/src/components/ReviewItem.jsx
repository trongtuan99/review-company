import { useState } from 'react';
import { reviewService } from '../services/reviewService';
import ReplyList from './ReplyList';
import CreateReplyForm from './CreateReplyForm';
import './ReviewItem.css';

const ReviewItem = ({ review, isAuthenticated, onUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyRefreshKey, setReplyRefreshKey] = useState(0);
  const [reloadReplies, setReloadReplies] = useState(null);

  const handleLike = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await reviewService.likeReview(review.id);
      setLiked(true);
      setDisliked(false);
      onUpdate?.();
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await reviewService.dislikeReview(review.id);
      setDisliked(true);
      setLiked(false);
      onUpdate?.();
    } catch (error) {
      console.error('Dislike error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-title-score">
          <h4>{review.title}</h4>
          <div className="score-badge">⭐ {review.score}/10</div>
        </div>
        {review.is_anonymous ? (
          <span className="anonymous-badge">Ẩn danh</span>
        ) : (
          <span className="review-author">Người dùng</span>
        )}
      </div>

      <div className="review-content">
        <p>{review.reviews_content}</p>
      </div>

      <div className="review-actions">
        {isAuthenticated && (
          <>
            <button
              className={`action-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
              disabled={loading}
            >
              👍 {review.total_like || 0}
            </button>
            <button
              className={`action-btn ${disliked ? 'active' : ''}`}
              onClick={handleDislike}
              disabled={loading}
            >
              👎 {review.total_dislike || 0}
            </button>
          </>
        )}
        <button
          className="action-btn"
          onClick={() => setShowReplies(!showReplies)}
        >
          💬 {review.total_reply || 0} trả lời
        </button>
        {isAuthenticated && (
          <button
            className="action-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? 'Hủy' : 'Trả lời'}
          </button>
        )}
      </div>

      {showReplyForm && isAuthenticated && (
        <CreateReplyForm
          reviewId={review.id}
          onSuccess={async () => {
            console.log('Reply created successfully');
            setShowReplyForm(false);
            // Always show replies after creating one
            setShowReplies(true);
            // Wait a bit for DB to commit, then reload
            setTimeout(() => {
              if (reloadReplies) {
                console.log('Reloading replies via callback');
                reloadReplies();
              } else {
                console.log('Reloading replies via refreshKey');
                setReplyRefreshKey(prev => prev + 1);
              }
            }, 300);
            onUpdate?.();
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {showReplies && (
        <div className="replies-section">
          <ReplyList 
            key={`replies-${review.id}-${replyRefreshKey}`}
            reviewId={review.id} 
            refreshKey={replyRefreshKey}
            onMounted={setReloadReplies}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewItem;

