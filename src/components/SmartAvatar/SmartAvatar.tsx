import React, { useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export type AvatarShape = 'circle' | 'square' | 'rounded';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface SmartAvatarProps {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  bordered?: boolean;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  preview?: boolean;
}

const sizeMap: Record<string, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const getInitials = (name?: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name?: string): string => {
  if (!name) return '#6366f1';
  const colors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#0ea5e9', // Sky
    '#14b8a6', // Teal
    '#f43f5e', // Rose
    '#84cc16', // Lime
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const SmartAvatar: React.FC<SmartAvatarProps> = ({
  src,
  name,
  alt,
  size = 'md',
  shape = 'circle',
  status,
  bordered = false,
  borderColor,
  className = '',
  style,
  onClick,
  preview = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const dimension = typeof size === 'number' ? size : sizeMap[size] || 40;
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  const borderRadius =
    shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0px';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preview && src && !imgError) {
      setShowPreviewModal(true);
    }
    onClick?.(e);
  };

  return (
    <>
      <div
        className={`sra-avatar sra-avatar--${typeof size === 'string' ? size : 'custom'} ${
          bordered ? 'sra-avatar--bordered' : ''
        } ${className}`}
        style={{
          width: `${dimension}px`,
          height: `${dimension}px`,
          minWidth: `${dimension}px`,
          borderRadius,
          backgroundColor: src && !imgError ? 'transparent' : bgColor,
          borderColor: borderColor || undefined,
          cursor: onClick || preview ? 'pointer' : 'default',
          ...style,
        }}
        onClick={handleClick}
        role={onClick || preview ? 'button' : undefined}
        tabIndex={onClick || preview ? 0 : undefined}
        aria-label={alt || name || 'Avatar'}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="sra-avatar__img"
            style={{ borderRadius }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="sra-avatar__initials"
            style={{ fontSize: `${Math.max(10, Math.floor(dimension * 0.4))}px` }}
          >
            {initials || (
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </span>
        )}

        {status && (
          <span
            className={`sra-avatar__status sra-avatar__status--${status}`}
            style={{
              width: `${Math.max(6, Math.floor(dimension * 0.26))}px`,
              height: `${Math.max(6, Math.floor(dimension * 0.26))}px`,
            }}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>

      {/* Enlarged Lightbox Preview Modal */}
      {showPreviewModal && src && !imgError && (
        <div
          className="sra-dialog-backdrop"
          onClick={() => setShowPreviewModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Avatar preview"
          style={{ zIndex: 9999 }}
        >
          <div
            className="sra-avatar-preview-card"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--sra-surface)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: 'var(--sra-shadow-xl)',
              maxWidth: '320px',
              width: '90%',
            }}
          >
            <img
              src={src}
              alt={alt || name || 'Avatar Preview'}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem',
                border: '3px solid var(--sra-border)',
              }}
            />
            {name && (
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{name}</h3>
            )}
            <button
              type="button"
              className="sra-btn sra-btn--secondary sra-btn--sm"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export interface SmartAvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  spacing?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SmartAvatarGroup: React.FC<SmartAvatarGroupProps> = ({
  children,
  max,
  size = 'md',
  spacing = -8,
  className = '',
  style,
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalCount = childrenArray.length;
  const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = max && totalCount > max ? totalCount - max : 0;
  const dimension = typeof size === 'number' ? size : sizeMap[size] || 40;

  return (
    <div
      className={`sra-avatar-group ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', ...style }}
      role="group"
      aria-label="Avatar group"
    >
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : `${spacing}px`,
            zIndex: visibleAvatars.length - index,
          }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                size: (child.props as any).size || size,
                bordered: true,
              })
            : child}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className="sra-avatar sra-avatar--overflow"
          style={{
            marginLeft: `${spacing}px`,
            width: `${dimension}px`,
            height: `${dimension}px`,
            minWidth: `${dimension}px`,
            borderRadius: '50%',
            backgroundColor: 'var(--sra-bg-subtle)',
            color: 'var(--sra-text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.max(10, Math.floor(dimension * 0.36))}px`,
            fontWeight: 600,
            border: '2px solid var(--sra-surface)',
            zIndex: 0,
          }}
          aria-label={`${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
