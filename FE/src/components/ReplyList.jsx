import { useState, useEffect } from 'react';
import { replyService } from '../services/replyService';
import ReplyItem from './ReplyItem';
import './ReplyList.css';

const ReplyList = ({ reviewId, refreshKey, onMounted }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReplies();
  }, [reviewId, refreshKey]);

  // Expose reload function to parent
  useEffect(() => {
    if (onMounted) {
      onMounted(loadReplies);
    }
  }, [onMounted]);

  // Debug log
  useEffect(() => {
    console.log('ReplyList mounted/updated, reviewId:', reviewId, 'refreshKey:', refreshKey, 'replies count:', replies.length);
  }, [reviewId, refreshKey, replies.length]);

  const loadReplies = async () => {
    try {
      setLoading(true);
      console.log('Loading replies for reviewId:', reviewId);
      const response = await replyService.getReplies(reviewId);
      console.log('Replies response:', response); // Debug
      console.log('Response status:', response?.status);
      console.log('Response data:', response?.data);
      
      // Backend returns status: 'ok' (not 'success')
      if (response && (response.status === 'ok' || response.status === 'success')) {
        const repliesData = response.data || [];
        console.log('Setting replies:', repliesData);
        setReplies(repliesData);
      } else {
        console.warn('Unexpected response status:', response?.status);
        setReplies([]);
      }
    } catch (error) {
      console.error('Load replies error:', error);
      setReplies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reply-list-container">
      {loading ? (
        <div className="loading-replies">Đang tải...</div>
      ) : !replies || replies.length === 0 ? (
        <div className="empty-replies">Chưa có trả lời nào</div>
      ) : (
        <div className="reply-list">
          {replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} onUpdate={loadReplies} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;

