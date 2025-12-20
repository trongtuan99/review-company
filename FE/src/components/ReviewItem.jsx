import { useState, useEffect } from 'react';
import { useReviewMutations } from '../hooks/useReviewMutations';
import ReplyList from './ReplyList';
import CreateReplyForm from './CreateReplyForm';
import './ReviewItem.css';

const ReviewItem = ({ review, isAuthenticated, onUpdate, companyId }) => {
  const [currentReview, setCurrentReview] = useState(review);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyRefreshKey, setReplyRefreshKey] = useState(0);
  const [reloadReplies, setReloadReplies] = useState(null);

  useEffect(() => {
    setCurrentReview(review);
  }, [review]);

  const handleMutationSuccess = (reviewId, reviewData) => {
    setCurrentReview(reviewData);
    onUpdate?.();
  };

  const { likeReview, dislikeReview, isLiking, isDisliking } = useReviewMutations(
    review.id,
    companyId,
    handleMutationSuccess
  );

  const liked = currentReview.user_like_status === 'like';
  const disliked = currentReview.user_like_status === 'dislike';
  const loading = isLiking || isDisliking;

  const handleLike = () => {
    if (loading) return;
    likeReview();
  };

  const handleDislike = () => {
    if (loading) return;
    dislikeReview();
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-title-score">
          <h4>{currentReview.title}</h4>
          <div className="score-badge">⭐ {currentReview.score}/10</div>
        </div>
        {currentReview.is_anonymous ? (
          <span className="anonymous-badge">Ẩn danh</span>
        ) : (
          <span className="review-author">Người dùng</span>
        )}
      </div>

      <div className="review-content">
        <p>{currentReview.reviews_content}</p>
      </div>

      <div className="review-actions">
        {isAuthenticated && (
          <>
            <button
              className={`action-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
              disabled={loading}
            >
              👍 {currentReview.total_like || 0}
            </button>
            <button
              className={`action-btn ${disliked ? 'active' : ''}`}
              onClick={handleDislike}
              disabled={loading}
            >
              👎 {currentReview.total_dislike || 0}
            </button>
          </>
        )}
        <button
          className="action-btn"
          onClick={() => setShowReplies(!showReplies)}
        >
          💬 {currentReview.total_reply || 0} trả lời
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
          reviewId={currentReview.id}
          onSuccess={async () => {
            setShowReplyForm(false);
            setShowReplies(true);
            setTimeout(() => {
              if (reloadReplies) {
                reloadReplies();
              } else {
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
            key={`replies-${currentReview.id}-${replyRefreshKey}`}
            reviewId={currentReview.id} 
            refreshKey={replyRefreshKey}
            onMounted={setReloadReplies}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
