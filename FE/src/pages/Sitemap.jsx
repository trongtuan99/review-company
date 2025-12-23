import { Link } from 'react-router-dom';
import './Sitemap.css';

const Sitemap = () => {
  const sitemapData = [
    {
      title: 'Trang chính',
      icon: '🏠',
      links: [
        { name: 'Trang chủ', path: '/' },
        { name: 'Danh sách công ty', path: '/companies' },
        { name: 'So sánh công ty', path: '/compare' },
      ],
    },
    {
      title: 'Tài khoản',
      icon: '👤',
      links: [
        { name: 'Đăng nhập', path: '/login' },
        { name: 'Đăng ký', path: '/register' },
        { name: 'Hồ sơ cá nhân', path: '/profile' },
      ],
    },
    {
      title: 'Đánh giá',
      icon: '⭐',
      links: [
        { name: 'Viết đánh giá', path: '/write-review' },
        { name: 'Hướng dẫn đánh giá', path: '/guidelines' },
      ],
    },
    {
      title: 'Hỗ trợ',
      icon: '💬',
      links: [
        { name: 'Liên hệ', path: '/contact' },
        { name: 'Câu hỏi thường gặp', path: '/faq' },
      ],
    },
    {
      title: 'Pháp lý',
      icon: '📋',
      links: [
        { name: 'Điều khoản sử dụng', path: '/terms' },
        { name: 'Chính sách bảo mật', path: '/privacy' },
      ],
    },
  ];

  return (
    <div className="sitemap-page">
      <div className="sitemap-container">
        <h1>Sơ đồ trang web</h1>
        <p className="sitemap-intro">
          Tìm nhanh các trang và tính năng trên ReviewCompany
        </p>

        <div className="sitemap-grid">
          {sitemapData.map((section, index) => (
            <div key={index} className="sitemap-section">
              <div className="section-header">
                <span className="section-icon">{section.icon}</span>
                <h2>{section.title}</h2>
              </div>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sitemap-footer">
          <p>Không tìm thấy trang bạn cần?</p>
          <Link to="/contact" className="contact-link">
            Liên hệ với chúng tôi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
