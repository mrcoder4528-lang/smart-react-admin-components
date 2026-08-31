import { render, screen, fireEvent } from '@testing-library/react';
import { SmartMedia, detectMediaType, formatEmbedUrl } from './SmartMedia';

describe('SmartMedia component', () => {
  test('detects media types correctly from URL', () => {
    expect(detectMediaType('https://example.com/photo.jpg')).toBe('image');
    expect(detectMediaType('https://example.com/video.mp4')).toBe('video');
    expect(detectMediaType('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('iframe');
    expect(detectMediaType('https://example.com/audio.mp3')).toBe('audio');
    expect(detectMediaType('https://example.com/document.pdf')).toBe('file');
  });

  test('formats YouTube URLs for iframe embed correctly', () => {
    expect(formatEmbedUrl('https://www.youtube.com/watch?v=12345')).toBe(
      'https://www.youtube.com/embed/12345',
    );
    expect(formatEmbedUrl('https://youtu.be/12345')).toBe(
      'https://www.youtube.com/embed/12345',
    );
  });

  test('renders image element and opens lightbox on click', () => {
    render(
      <SmartMedia
        src="https://images.unsplash.com/photo-1"
        type="image"
        alt="Mountain view"
        preview={true}
      />,
    );

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();

    const mediaContainer = img.closest('.sra-media');
    if (mediaContainer) {
      fireEvent.click(mediaContainer);
      expect(screen.getByRole('dialog', { name: /media lightbox/i })).toBeInTheDocument();
    }
  });

  test('renders video element when type is video', () => {
    const { container } = render(
      <SmartMedia src="https://example.com/demo.mp4" type="video" />,
    );
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  test('renders iframe element for youtube embed', () => {
    render(
      <SmartMedia
        src="https://www.youtube.com/watch?v=test"
        type="iframe"
        title="Test video"
      />,
    );
    expect(screen.getByTitle('Test video')).toBeInTheDocument();
  });
});
