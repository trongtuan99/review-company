import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'ReviewCompany là gì?',
      answer: 'ReviewCompany là nền tảng cho phép người dùng đánh giá và chia sẻ trải nghiệm về các công ty. Chúng tôi giúp người tìm việc có thông tin đầy đủ về môi trường làm việc trước khi ứng tuyển.'
    },
    {
      question: 'Làm thế nào để đánh giá một công ty?',
      answer: 'Để đánh giá công ty, bạn cần đăng nhập vào tài khoản. Sau đó, tìm công ty bạn muốn đánh giá và nhấp vào nút "Viết đánh giá". Bạn có thể đánh giá theo thang điểm từ 1-10 và viết nhận xét chi tiết.'
    },
    {
      question: 'Tôi có thể đánh giá ẩn danh không?',
      answer: 'Có, bạn có thể chọn đánh giá ẩn danh khi tạo đánh giá. Tuy nhiên, chúng tôi khuyến khích bạn đánh giá công khai để tăng tính minh bạch và uy tín của đánh giá.'
    },
    {
      question: 'Làm thế nào để tìm kiếm công ty?',
      answer: 'Bạn có thể sử dụng thanh tìm kiếm ở trang chủ để tìm công ty theo tên, địa điểm, hoặc từ khóa. Nếu không tìm thấy công ty bạn muốn, bạn có thể tạo công ty mới (cần đăng nhập).'
    },
    {
      question: 'Điểm đánh giá được tính như thế nào?',
      answer: 'Điểm đánh giá trung bình của công ty được tính dựa trên tất cả các đánh giá mà công ty nhận được. Điểm được làm tròn đến 1 chữ số thập phân.'
    },
    {
      question: 'Tôi có thể chỉnh sửa hoặc xóa đánh giá của mình không?',
      answer: 'Hiện tại, bạn có thể chỉnh sửa đánh giá của mình. Tính năng xóa đánh giá đang được phát triển và sẽ sớm có mặt.'
    },
    {
      question: 'Làm thế nào để báo cáo đánh giá không phù hợp?',
      answer: 'Nếu bạn phát hiện đánh giá vi phạm quy tắc cộng đồng, vui lòng liên hệ với chúng tôi qua email contact@reviewcompany.com với thông tin chi tiết về đánh giá đó.'
    },
    {
      question: 'Tôi có thể tạo nhiều công ty không?',
      answer: 'Có, bạn có thể tạo nhiều công ty. Tuy nhiên, chúng tôi khuyến khích bạn kiểm tra xem công ty đã tồn tại chưa trước khi tạo mới để tránh trùng lặp.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
        <h1>Câu hỏi thường gặp</h1>
        <p className="faq-subtitle">Tìm câu trả lời cho các câu hỏi phổ biến</p>
      </div>

      <div className="faq-content">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h2>Không tìm thấy câu trả lời?</h2>
          <p>Nếu bạn có câu hỏi khác, vui lòng liên hệ với chúng tôi:</p>
          <div className="contact-buttons">
            <a href="mailto:contact@reviewcompany.com" className="contact-btn">
              📧 Gửi email
            </a>
            <Link to="/contact" className="contact-btn">
              📝 Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

