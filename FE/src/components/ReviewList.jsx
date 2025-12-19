import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviewService } from '../services/reviewService';
import ReviewItem from './ReviewItem';
import './ReviewList.css';

const ReviewList = ({ reviews, onUpdate }) => {
  const { isAuthenticated } = useAuth();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="empty-reviews">
        <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          isAuthenticated={isAuthenticated}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default ReviewList;

