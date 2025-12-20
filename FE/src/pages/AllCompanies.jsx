import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../services/companyService';
import './AllCompanies.css';

const AllCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 20;

  useEffect(() => {
    loadCompanies();
  }, [page]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await companyService.getCompanies(null, { page, perPage });
      
      if (response.status === 'ok' || response.status === 'success') {
        setCompanies(response.data || []);
        // If backend returns pagination info
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages || 1);
          setTotalCount(response.pagination.total_count || response.data?.length || 0);
        } else {
          // Fallback: estimate based on data length
          setTotalCount(response.data?.length || 0);
        }
      } else {
        setError(response.message || 'Không thể tải danh sách công ty');
      }
    } catch (err) {
      setError(err.message || err.error || 'Không thể tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && companies.length === 0) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error && companies.length === 0) {
    return (
      <div className="error">
        <p>{error}</p>
        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="all-companies-container">
      <div className="page-header">
        <Link to="/" className="back-link">← Quay lại trang chủ</Link>
        <h1>Tất cả công ty</h1>
        <p className="page-subtitle">Tổng cộng {totalCount} công ty</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="companies-grid">
        {companies.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có công ty nào</p>
          </div>
        ) : (
          companies.map((company) => (
            <Link
              key={company.id}
              to={`/companies/${company.id}`}
              className="company-card"
            >
              <div className="company-header">
                <h3>{company.name}</h3>
                <div className="company-score">
                  <span>⭐</span>
                  <span>{company.avg_score?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <div className="company-info">
                <p className="company-owner">
                  <span className="icon">👤</span>
                  <span>{company.owner}</span>
                </p>
                <p className="company-reviews">
                  <span className="icon">📝</span>
                  <span>{company.total_reviews || 0} đánh giá</span>
                </p>
                {company.main_office && (
                  <p className="company-location">
                    <span className="icon">📍</span>
                    <span>{company.main_office}</span>
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ‹ Trước
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-page ${page === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Sau ›
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCompanies;

