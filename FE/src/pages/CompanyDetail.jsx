import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCompany, useReviews, useFavoriteStatus, useFavoriteMutations } from '../hooks';
import ReviewList from '../components/ReviewList';
import CreateReviewForm from '../components/CreateReviewForm';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { 
    data: companyResponse, 
    isLoading: companyLoading, 
    error: companyError,
    refetch: refetchCompany 
  } = useCompany(id);

  const { 
    data: reviewsResponse, 
    isLoading: reviewsLoading,
    refetch: refetchReviews 
  } = useReviews(id);

  const { 
    data: favoriteStatusResponse,
    refetch: refetchFavoriteStatus 
  } = useFavoriteStatus(id, isAuthenticated);

  const { addFavoriteAsync, removeFavoriteAsync, isAdding, isRemoving } = useFavoriteMutations();

  let company = null;
  if (companyResponse) {
    if (companyResponse.data && typeof companyResponse.data === 'object' && companyResponse.data.id) {
      company = companyResponse.data;
    } else if (companyResponse.id) {
      company = companyResponse;
    }
  }
  
  let reviews = [];
  if (reviewsResponse) {
    if (Array.isArray(reviewsResponse.data)) {
      reviews = reviewsResponse.data;
    } else if (Array.isArray(reviewsResponse)) {
      reviews = reviewsResponse;
    }
  }
  
  const isFavorited = favoriteStatusResponse?.data?.is_favorited || false;
  const loading = companyLoading || reviewsLoading;
  const hasError = companyError || (companyResponse?.status && companyResponse?.status !== 'ok' && companyResponse?.status !== 'success');
  const error = hasError ? (companyError?.message || companyResponse?.message || 'Có lỗi xảy ra') : '';
  const favoriteLoading = isAdding || isRemoving;

  const handleReviewCreated = () => {
    setShowReviewForm(false);
    refetchReviews();
    refetchCompany();
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để yêu thích công ty');
      return;
    }

    try {
      if (isFavorited) {
        await removeFavoriteAsync(id);
      } else {
        await addFavoriteAsync(id);
      }
      refetchFavoriteStatus();
    } catch (err) {
      alert(err.message || 'Không thể cập nhật yêu thích');
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (hasError && error) {
    return (
      <div className="company-detail-container">
        <Link to="/" className="back-link">← Quay lại</Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!company && !loading && !companyLoading) {
    return (
      <div className="company-detail-container">
        <Link to="/" className="back-link">← Quay lại</Link>
        <div className="error">Không tìm thấy công ty</div>
      </div>
    );
  }

  if (!company || companyLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="company-detail-container">
      <Link to="/" className="back-link">← Quay lại</Link>
      
      <div className="company-header">
        <div className="company-title-section">
          <h1>{company?.name || 'N/A'}</h1>
          {isAuthenticated && (
            <button
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              title={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
              {isFavorited ? '❤️' : '🤍'} {isFavorited ? 'Đã yêu thích' : 'Yêu thích'}
            </button>
          )}
        </div>
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

        <ReviewList reviews={reviews} onUpdate={() => {
          refetchReviews();
          refetchCompany();
        }} companyId={id} />
      </div>
    </div>
  );
};

export default CompanyDetail;

