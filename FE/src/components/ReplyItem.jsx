import './ReplyItem.css';

const ReplyItem = ({ reply, onUpdate }) => {
  return (
    <div className="reply-item">
      <div className="reply-content">
        <p>{reply.content}</p>
        {reply.is_edited && <span className="edited-badge">(đã chỉnh sửa)</span>}
      </div>
      <div className="reply-meta">
        <span>Người dùng</span>
        <span>{new Date(reply.created_at).toLocaleDateString('vi-VN')}</span>
      </div>
    </div>
  );
};

export default ReplyItem;

