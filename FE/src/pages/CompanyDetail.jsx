import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companyService } from '../services/companyService';
import { reviewService } from '../services/reviewService';
import ReviewList from '../components/ReviewList';
import CreateReviewForm from '../components/CreateReviewForm';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [companyRes, reviewsRes] = await Promise.all([
        companyService.getCompanyOverview(id),
        reviewService.getReviews(id),
      ]);

      console.log('Company response:', companyRes); // Debug
      console.log('Reviews response:', reviewsRes); // Debug

      // Backend returns status: 'ok' (not 'success')
      if (companyRes.status === 'ok' || companyRes.status === 'success') {
        setCompany(companyRes.data);
      } else {
        setError(companyRes.message || 'Không tìm thấy công ty');
      }
      
      if (reviewsRes.status === 'ok' || reviewsRes.status === 'success') {
        setReviews(reviewsRes.data || []);
      }
    } catch (err) {
      console.error('Load company error:', err); // Debug
      setError(err.message || err.error || 'Không thể tải thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewCreated = () => {
    setShowReviewForm(false);
    loadCompanyData();
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="company-detail-container">
        <Link to="/" className="back-link">← Quay lại</Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!company && !loading) {
    return (
      <div className="company-detail-container">
        <Link to="/" className="back-link">← Quay lại</Link>
        <div className="error">Không tìm thấy công ty</div>
      </div>
    );
  }

  return (
    <div className="company-detail-container">
      <Link to="/" className="back-link">← Quay lại</Link>
      
      <div className="company-header">
        <h1>{company.name}</h1>
        <div className="company-meta">
          <div className="score-badge">
            ⭐ {company.avg_score?.toFixed(1) || '0.0'}
          </div>
          <span>{company.total_reviews || 0} đánh giá</span>
        </div>
      </div>

      <div className="company-info">
        <div className="info-item">
          <strong>Chủ sở hữu:</strong> {company.owner}
        </div>
        {company.main_office && (
          <div className="info-item">
            <strong>Văn phòng:</strong> {company.main_office}
          </div>
        )}
        {company.phone && (
          <div className="info-item">
            <strong>Điện thoại:</strong> {company.phone}
          </div>
        )}
        {company.website && (
          <div className="info-item">
            <strong>Website:</strong>{' '}
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
          </div>
        )}
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Đánh giá ({reviews.length})</h2>
          {isAuthenticated && (
            <button
              className="btn-primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Hủy' : '+ Viết đánh giá'}
            </button>
          )}
        </div>

        {showReviewForm && isAuthenticated && (
          <CreateReviewForm
            companyId={id}
            onSuccess={handleReviewCreated}
            onCancel={() => setShowReviewForm(false)}
          />
        )}

        <ReviewList reviews={reviews} onUpdate={loadCompanyData} />
      </div>
    </div>
  );
};

export default CompanyDetail;

