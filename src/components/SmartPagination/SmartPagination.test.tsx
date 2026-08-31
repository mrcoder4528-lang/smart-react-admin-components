import { render, screen, fireEvent } from '@testing-library/react';
import { SmartPagination } from './SmartPagination';

describe('SmartPagination component', () => {
  test('renders pagination with page numbers and item summary', () => {
    const handlePageChange = jest.fn();
    render(
      <SmartPagination
        currentPage={1}
        totalItems={50}
        pageSize={10}
        onPageChange={handlePageChange}
      />,
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  test('calls onPageChange when clicking next or a page button', () => {
    const handlePageChange = jest.fn();
    render(
      <SmartPagination
        currentPage={2}
        totalItems={100}
        pageSize={10}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next Page' }));
    expect(handlePageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  test('calls onPageSizeChange when selecting different page size', () => {
    const handlePageSizeChange = jest.fn();
    render(
      <SmartPagination
        currentPage={1}
        totalItems={100}
        pageSize={10}
        onPageChange={() => {}}
        onPageSizeChange={handlePageSizeChange}
      />,
    );

    const select = screen.getByLabelText(/rows per page/i);
    fireEvent.change(select, { target: { value: '25' } });
    expect(handlePageSizeChange).toHaveBeenCalledWith(25);
  });
});
