import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog component', () => {
  test('renders dialog when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );

    expect(screen.getByText('Delete User')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this user?')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Delete User"
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    );

    expect(screen.queryByText('Delete User')).not.toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    const handleConfirm = jest.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete User"
        onClose={() => {}}
        onConfirm={handleConfirm}
      />,
    );

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  test('calls onClose when cancel button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete User"
        onClose={handleClose}
        onConfirm={() => {}}
      />,
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
