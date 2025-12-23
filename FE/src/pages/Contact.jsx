import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Liên hệ với chúng tôi</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Thông tin liên hệ</h2>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>Địa chỉ</h3>
                <p>123 Đường ABC, Quận XYZ<br />TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>
                  <a href="mailto:contact@reviewcompany.com">contact@reviewcompany.com</a>
                </p>
                <p>
                  <a href="mailto:support@reviewcompany.com">support@reviewcompany.com</a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h3>Điện thoại</h3>
                <p><a href="tel:+84123456789">+84 123 456 789</a></p>
                <p className="sub-text">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">💬</div>
              <div>
                <h3>Mạng xã hội</h3>
                <div className="social-links">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h2>Gửi tin nhắn</h2>

            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Cảm ơn bạn!</h3>
                <p>Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Chủ đề *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="general">Câu hỏi chung</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="feedback">Góp ý & Phản hồi</option>
                    <option value="business">Hợp tác kinh doanh</option>
                    <option value="report">Báo cáo vi phạm</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Nội dung *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Nhập nội dung tin nhắn..."
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="map-section">
          <h2>Vị trí của chúng tôi</h2>
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>Bản đồ Google Maps</p>
            <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
