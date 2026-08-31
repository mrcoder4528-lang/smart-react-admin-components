import { render, screen, fireEvent } from '@testing-library/react';
import { SmartSearch } from './SmartSearch';

describe('SmartSearch component', () => {
  test('renders search input with placeholder', () => {
    render(<SmartSearch placeholder="Search users..." />);
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
  });

  test('calls onChange when text is entered', () => {
    const handleChange = jest.fn();
    render(<SmartSearch onChange={handleChange} />);
    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(handleChange).toHaveBeenCalledWith('Alice');
  });

  test('shows clear button and clears value on click', () => {
    const handleChange = jest.fn();
    render(<SmartSearch value="test" onChange={handleChange} />);

    const clearBtn = screen.getByLabelText(/clear search/i);
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith('');
  });
});
