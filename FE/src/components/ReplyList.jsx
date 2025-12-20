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

  useEffect(() => {
    if (onMounted) {
      onMounted(loadReplies);
    }
  }, [onMounted]);

  const loadReplies = async () => {
    try {
      setLoading(true);
      const response = await replyService.getReplies(reviewId);
      
      if (response && (response.status === 'ok' || response.status === 'success')) {
        const repliesData = response.data || [];
        setReplies(repliesData);
      } else {
        setReplies([]);
      }
    } catch (error) {
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

