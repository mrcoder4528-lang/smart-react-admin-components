import React from 'react';

export interface EmptyStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DefaultEmptyIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  description = 'There are no items to display at this moment.',
  icon,
  action,
  className = '',
  style,
}) => {
  return (
    <div className={`sra-empty-state ${className}`} style={style} role="region" aria-label="Empty state">
      <div className="sra-empty-state__icon-wrap">
        {icon || <DefaultEmptyIcon />}
      </div>
      {title && <h3 className="sra-empty-state__title">{title}</h3>}
      {description && <p className="sra-empty-state__desc">{description}</p>}
      {action && <div className="sra-empty-state__action">{action}</div>}
    </div>
  );
};
