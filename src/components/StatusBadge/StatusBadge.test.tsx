import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge component', () => {
  test('renders status text correctly', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText(/approved/i)).toBeInTheDocument();
  });

  test('applies success variant for active status', () => {
    const { container } = render(<StatusBadge status="active" />);
    const badge = container.querySelector('.sra-badge--success');
    expect(badge).toBeInTheDocument();
  });

  test('applies custom variant override', () => {
    const { container } = render(<StatusBadge status="custom" variant="danger" />);
    const badge = container.querySelector('.sra-badge--danger');
    expect(badge).toBeInTheDocument();
  });

  test('supports custom label and pulse', () => {
    const { container } = render(
      <StatusBadge status="active" label="Live Now" pulse={true} dot={true} />,
    );
    expect(screen.getByText('Live Now')).toBeInTheDocument();
    expect(container.querySelector('.sra-badge__pulse')).toBeInTheDocument();
  });

  test('renders without dot if dot=false', () => {
    const { container } = render(<StatusBadge status="active" dot={false} />);
    expect(container.querySelector('.sra-badge__dot')).not.toBeInTheDocument();
  });
});
