import React from 'react';
import type { ComponentSize, StatusBadgeVariant } from '../../types';

export interface StatusBadgeProps {
  status: string;
  variant?: StatusBadgeVariant;
  label?: React.ReactNode;
  dot?: boolean;
  pulse?: boolean;
  size?: ComponentSize;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

const statusToVariantMap: Record<string, StatusBadgeVariant> = {
  active: 'success',
  approved: 'success',
  completed: 'success',
  published: 'success',
  paid: 'success',
  success: 'success',

  pending: 'warning',
  processing: 'warning',
  in_progress: 'warning',
  draft: 'warning',
  warning: 'warning',

  rejected: 'danger',
  failed: 'danger',
  error: 'danger',
  danger: 'danger',
  cancelled: 'danger',
  deleted: 'danger',

  info: 'info',
  new: 'info',
  scheduled: 'info',

  neutral: 'neutral',
  archived: 'neutral',
  inactive: 'neutral',
  closed: 'neutral',

  primary: 'primary',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  label,
  dot = true,
  pulse = false,
  size = 'md',
  className = '',
  style,
  icon,
}) => {
  const normalizedStatus = (status || '').toLowerCase().trim();
  const effectiveVariant = variant || statusToVariantMap[normalizedStatus] || 'neutral';
  const displayLabel = label ?? status;

  return (
    <span
      className={`sra-badge sra-badge--${effectiveVariant} sra-badge--${size} ${className}`}
      style={style}
      role="status"
      aria-label={typeof displayLabel === 'string' ? displayLabel : status}
    >
      {icon && <span className="sra-badge__icon">{icon}</span>}
      {dot && (
        <span
          className={`sra-badge__dot ${pulse ? 'sra-badge__pulse' : ''}`}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
