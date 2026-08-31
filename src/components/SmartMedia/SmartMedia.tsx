import React, { useState } from 'react';

export type MediaType = 'image' | 'video' | 'iframe' | 'audio' | 'file' | 'auto';
export type MediaAspectRatio = '16/9' | '4/3' | '1/1' | '21/9' | 'auto' | string;
export type MediaObjectFit = 'cover' | 'contain' | 'fill' | 'none';

export interface SmartMediaProps {
  src: string;
  type?: MediaType;
  alt?: string;
  title?: string;
  poster?: string;
  aspectRatio?: MediaAspectRatio;
  width?: string | number;
  height?: string | number;
  fit?: MediaObjectFit;
  preview?: boolean;
  caption?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  fileSize?: string;
  onPreviewOpen?: () => void;
  onPreviewClose?: () => void;
}

/**
 * Automatically detect media type from URL extension or domain
 */
export function detectMediaType(url: string): 'image' | 'video' | 'audio' | 'iframe' | 'file' {
  if (!url) return 'image';
  const cleanUrl = url.split('?')[0].toLowerCase();

  if (
    cleanUrl.includes('youtube.com') ||
    cleanUrl.includes('youtu.be') ||
    cleanUrl.includes('vimeo.com') ||
    cleanUrl.includes('loom.com') ||
    cleanUrl.endsWith('.html') ||
    cleanUrl.endsWith('.htm')
  ) {
    return 'iframe';
  }

  if (cleanUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/)) {
    return 'video';
  }

  if (cleanUrl.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/)) {
    return 'audio';
  }

  if (cleanUrl.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|tar|gz|csv)$/)) {
    return 'file';
  }

  return 'image';
}

/**
 * Format embed URL for YouTube / Vimeo iframes
 */
export function formatEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${id}`;
  }
  return url;
}

export const SmartMedia: React.FC<SmartMediaProps> = ({
  src,
  type = 'auto',
  alt,
  title,
  poster,
  aspectRatio = 'auto',
  width,
  height,
  fit = 'cover',
  preview = true,
  caption,
  badge,
  className = '',
  style,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  fileSize,
  onPreviewOpen,
  onPreviewClose,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const effectiveType = type === 'auto' ? detectMediaType(src) : type;

  const aspectRatioValue =
    aspectRatio === '16/9'
      ? '16 / 9'
      : aspectRatio === '4/3'
      ? '4 / 3'
      : aspectRatio === '1/1'
      ? '1 / 1'
      : aspectRatio === '21/9'
      ? '21 / 9'
      : aspectRatio !== 'auto'
      ? aspectRatio
      : undefined;

  const handleOpenLightbox = () => {
    if (preview) {
      setIsLightboxOpen(true);
      setZoomLevel(1);
      onPreviewOpen?.();
    }
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
    onPreviewClose?.();
  };

  const renderMediaContent = () => {
    if (hasError) {
      return (
        <div className="sra-media-fallback" role="img" aria-label="Media failed to load">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span>Media unavailable</span>
        </div>
      );
    }

    switch (effectiveType) {
      case 'image':
        return (
          <img
            src={src}
            alt={alt || title || 'Media'}
            className="sra-media__element sra-media__img"
            style={{ objectFit: fit }}
            onError={() => setHasError(true)}
          />
        );

      case 'video':
        return (
          <video
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            className="sra-media__element sra-media__video"
            style={{ objectFit: fit }}
            onError={() => setHasError(true)}
          />
        );

      case 'iframe':
        return (
          <iframe
            src={formatEmbedUrl(src)}
            title={title || alt || 'Embedded media'}
            className="sra-media__element sra-media__iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        );

      case 'audio':
        return (
          <div className="sra-media__audio-wrap">
            <audio src={src} controls={controls} className="sra-media__audio" />
          </div>
        );

      case 'file':
        return (
          <div className="sra-media__file-card">
            <div className="sra-media__file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="sra-media__file-info">
              <span className="sra-media__file-title">{title || alt || src.split('/').pop()}</span>
              {fileSize && <span className="sra-media__file-size">{fileSize}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`sra-media sra-media--${effectiveType} ${preview ? 'sra-media--clickable' : ''} ${className}`}
        style={{
          width: width || (aspectRatioValue ? '100%' : undefined),
          height: height || undefined,
          aspectRatio: aspectRatioValue,
          ...style,
        }}
        onClick={effectiveType !== 'video' && effectiveType !== 'iframe' && preview ? handleOpenLightbox : undefined}
      >
        {renderMediaContent()}

        {/* Badge Overlay (e.g. Type indicator or status) */}
        {badge && <div className="sra-media__badge-wrap">{badge}</div>}

        {/* Hover Zoom / Expand Indicator */}
        {preview && effectiveType === 'image' && !hasError && (
          <div className="sra-media__hover-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
        )}

        {caption && <div className="sra-media__caption">{caption}</div>}
      </div>

      {/* Full-Screen Interactive Lightbox Preview */}
      {isLightboxOpen && (
        <div
          className="sra-lightbox-backdrop"
          onClick={handleCloseLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Media Lightbox"
        >
          <div className="sra-lightbox-toolbar" onClick={e => e.stopPropagation()}>
            {title && <span className="sra-lightbox-title">{title}</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              {effectiveType === 'image' && (
                <>
                  <button
                    type="button"
                    className="sra-lightbox-btn"
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                    title="Zoom in"
                    aria-label="Zoom in"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="sra-lightbox-btn"
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                </>
              )}
              <button
                type="button"
                className="sra-lightbox-btn sra-lightbox-btn--close"
                onClick={handleCloseLightbox}
                title="Close Lightbox"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="sra-lightbox-content"
            onClick={e => e.stopPropagation()}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {effectiveType === 'image' && (
              <img
                src={src}
                alt={alt || title || 'Full view'}
                className="sra-lightbox-image"
              />
            )}
            {effectiveType === 'video' && (
              <video
                src={src}
                controls
                autoPlay
                className="sra-lightbox-video"
              />
            )}
            {effectiveType === 'iframe' && (
              <iframe
                src={formatEmbedUrl(src)}
                title={title || 'Full embed view'}
                className="sra-lightbox-iframe"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
