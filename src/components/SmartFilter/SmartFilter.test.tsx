import { render, screen, fireEvent } from '@testing-library/react';
import { SmartFilter } from './SmartFilter';

describe('SmartFilter component', () => {
  const filters = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ];

  test('opens filter popover when button is clicked', () => {
    render(<SmartFilter filters={filters} onChange={() => {}} />);
    const trigger = screen.getByRole('button', { name: /filters/i });

    fireEvent.click(trigger);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
  });

  test('calls onChange when an option is selected', () => {
    const handleChange = jest.fn();
    render(<SmartFilter filters={filters} value={{}} onChange={handleChange} />);

    fireEvent.click(screen.getByRole('button', { name: /filters/i }));

    const adminCheckbox = screen.getByRole('checkbox', { name: /admin/i });
    fireEvent.click(adminCheckbox);

    expect(handleChange).toHaveBeenCalledWith({
      role: ['admin'],
    });
  });

  test('renders active filter tag and allows removal', () => {
    const handleChange = jest.fn();
    render(
      <SmartFilter
        filters={filters}
        value={{ role: ['admin'] }}
        onChange={handleChange}
      />,
    );

    expect(screen.getByText('Role: Admin')).toBeInTheDocument();

    const removeBtn = screen.getByLabelText(/remove filter role: admin/i);
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith({});
  });
});
