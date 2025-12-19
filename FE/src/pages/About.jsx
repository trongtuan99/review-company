import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
        <h1>Về ReviewCompany</h1>
        <p className="about-subtitle">Nền tảng đánh giá công ty uy tín và minh bạch</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Chúng tôi là ai?</h2>
          <p>
            ReviewCompany là nền tảng đánh giá công ty hàng đầu, giúp người tìm việc và nhân viên 
            chia sẻ trải nghiệm thực tế về môi trường làm việc, văn hóa công ty, và các khía cạnh 
            khác của công việc.
          </p>
          <p>
            Mục tiêu của chúng tôi là tạo ra một cộng đồng minh bạch, nơi mọi người có thể đưa ra 
            quyết định nghề nghiệp sáng suốt dựa trên thông tin thực tế từ những người đã từng 
            làm việc tại các công ty.
          </p>
        </section>

        <section className="about-section">
          <h2>Sứ mệnh của chúng tôi</h2>
          <p>
            Chúng tôi tin rằng mọi người đều xứng đáng có thông tin đầy đủ về nơi họ sẽ làm việc. 
            Bằng cách kết nối người tìm việc với những trải nghiệm thực tế, chúng tôi giúp:
          </p>
          <ul className="mission-list">
            <li>Người tìm việc đưa ra quyết định nghề nghiệp sáng suốt</li>
            <li>Công ty cải thiện môi trường làm việc dựa trên phản hồi thực tế</li>
            <li>Tạo ra một thị trường lao động minh bạch và công bằng hơn</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Tính năng chính</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Đánh giá công ty</h3>
              <p>Xem và đánh giá các công ty dựa trên nhiều tiêu chí khác nhau</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Bình luận và phản hồi</h3>
              <p>Thảo luận và chia sẻ kinh nghiệm với cộng đồng</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Tìm kiếm thông minh</h3>
              <p>Tìm kiếm công ty theo tên, địa điểm, hoặc từ khóa</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Xếp hạng công ty</h3>
              <p>Xem top các công ty được đánh giá cao nhất</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Liên hệ với chúng tôi</h2>
          <div className="contact-info">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:contact@reviewcompany.com">contact@reviewcompany.com</a>
            </p>
            <p>
              <strong>Điện thoại:</strong>{' '}
              <a href="tel:+84123456789">+84 123 456 789</a>
            </p>
            <p>
              <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

