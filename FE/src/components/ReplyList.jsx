import { useState, useEffect, useCallback } from 'react';
import { replyService } from '../services/replyService';
import ReplyItem from './ReplyItem';
import './ReplyList.css';

const ReplyList = ({ reviewId, refreshKey }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReplies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await replyService.getReplies(reviewId);

      if (response && (response.status === 'ok' || response.status === 'success')) {
        const repliesData = response.data || [];
        setReplies(repliesData);
      } else {
        setReplies([]);
      }
    } catch {
      setReplies([]);
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    loadReplies();
  }, [loadReplies, refreshKey]);

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

