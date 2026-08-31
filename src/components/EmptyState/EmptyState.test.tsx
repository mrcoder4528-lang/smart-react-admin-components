import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState component', () => {
  test('renders default title and description', () => {
    render(<EmptyState />);
    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    expect(screen.getByText(/there are no items to display/i)).toBeInTheDocument();
  });

  test('renders custom content and action button', () => {
    render(
      <EmptyState
        title="No Orders"
        description="Create your first order to get started."
        action={<button>Create Order</button>}
      />,
    );
    expect(screen.getByText('No Orders')).toBeInTheDocument();
    expect(screen.getByText('Create your first order to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create order/i })).toBeInTheDocument();
  });
});
