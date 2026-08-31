import { render, screen, fireEvent } from '@testing-library/react';
import { SmartTable } from './SmartTable';

interface TestUser {
  id: number;
  name: string;
  role: string;
  status: string;
}

const mockData: TestUser[] = [
  { id: 1, name: 'Alice Smith', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Jones', role: 'Editor', status: 'Pending' },
  { id: 3, name: 'Charlie Brown', role: 'Viewer', status: 'Inactive' },
];

const mockColumns = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
  { key: 'status', title: 'Status', dataIndex: 'status' },
];

describe('SmartTable component', () => {
  test('renders table with columns and data', () => {
    render(
      <SmartTable<TestUser>
        data={mockData}
        columns={mockColumns}
        rowKey="id"
      />,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
  });

  test('filters rows based on search query', () => {
    render(
      <SmartTable<TestUser>
        data={mockData}
        columns={mockColumns}
        rowKey="id"
      />,
    );

    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie Brown')).not.toBeInTheDocument();
  });

  test('handles row selection when selectable is true', () => {
    const handleSelectChange = jest.fn();
    render(
      <SmartTable<TestUser>
        data={mockData}
        columns={mockColumns}
        rowKey="id"
        selectable={true}
        onSelectChange={handleSelectChange}
      />,
    );

    const selectRowCheckboxes = screen.getAllByRole('checkbox');
    // First checkbox is select all, second is row 1
    fireEvent.click(selectRowCheckboxes[1]);

    expect(handleSelectChange).toHaveBeenCalledWith(
      [1],
      [expect.objectContaining({ id: 1, name: 'Alice Smith' })],
    );
  });

  test('displays loading skeleton when loading is true', () => {
    render(
      <SmartTable<TestUser>
        data={[]}
        columns={mockColumns}
        rowKey="id"
        loading={true}
      />,
    );

    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });

  test('displays empty state when data is empty', () => {
    render(
      <SmartTable<TestUser>
        data={[]}
        columns={mockColumns}
        rowKey="id"
        loading={false}
      />,
    );

    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
  });
});
