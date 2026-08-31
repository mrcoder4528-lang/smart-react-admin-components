import React from 'react';
import { usePagination, DOTS } from '../../hooks/usePagination';

export interface SmartPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  siblingCount?: number;
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode);
  showPageSizeSelect?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SmartPagination: React.FC<SmartPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  siblingCount = 1,
  showTotal = true,
  showPageSizeSelect = true,
  className = '',
  style,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount: totalItems,
    siblingCount,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // If there are no items or only 1 page and total is 0
  if (totalItems === 0) {
    return null;
  }

  const startRange = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endRange = Math.min(currentPage * pageSize, totalItems);

  const renderTotal = () => {
    if (!showTotal) return null;
    if (typeof showTotal === 'function') {
      return showTotal(totalItems, [startRange, endRange]);
    }
    return (
      <span className="sra-pagination__info">
        Showing <span className="sra-pagination__count">{startRange}</span> -{' '}
        <span className="sra-pagination__count">{endRange}</span> of{' '}
        <span className="sra-pagination__count">{totalItems}</span> items
      </span>
    );
  };

  return (
    <nav
      className={`sra-pagination ${className}`}
      style={style}
      aria-label="Pagination Navigation"
    >
      <div className="sra-pagination__left">
        {renderTotal()}
      </div>

      <div className="sra-pagination__controls">
        {showPageSizeSelect && onPageSizeChange && (
          <select
            className="sra-pagination__select"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option} / page
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          className="sra-pagination__btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span key={`dots-${index}`} className="sra-pagination__ellipsis">
                &#8230;
              </span>
            );
          }

          const isCurrent = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              type="button"
              className={`sra-pagination__btn ${isCurrent ? 'sra-pagination__btn--active' : ''}`}
              onClick={() => onPageChange(pageNumber as number)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          className="sra-pagination__btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </nav>
  );
};
