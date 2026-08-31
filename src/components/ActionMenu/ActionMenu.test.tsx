import { render, screen, fireEvent } from '@testing-library/react';
import { ActionMenu } from './ActionMenu';

describe('ActionMenu component', () => {
  const mockEdit = jest.fn();
  const mockDelete = jest.fn();

  const items = [
    { id: 'edit', label: 'Edit Row', onClick: mockEdit },
    { id: 'div-1', label: '', onClick: () => {}, divider: true },
    { id: 'delete', label: 'Delete Row', onClick: mockDelete, variant: 'danger' as const },
  ];

  test('opens menu when trigger button is clicked', () => {
    render(<ActionMenu items={items} />);
    const trigger = screen.getByRole('button', { name: /actions/i });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit Row' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete Row' })).toBeInTheDocument();
  });

  test('executes action callback and closes menu on item click', () => {
    render(<ActionMenu items={items} />);
    const trigger = screen.getByRole('button', { name: /actions/i });
    fireEvent.click(trigger);

    const editItem = screen.getByRole('menuitem', { name: 'Edit Row' });
    fireEvent.click(editItem);

    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
