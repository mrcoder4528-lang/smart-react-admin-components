import { SmartTable, type SmartTableProps } from './SmartTable';
import { StatusBadge } from '../StatusBadge';
import { ActionMenu } from '../ActionMenu';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'rejected';
}

const sampleUsers: UserRecord[] = [
  { id: 1, name: 'Alice Freeman', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Vance', email: 'bob@example.com', role: 'Editor', status: 'pending' },
  { id: 3, name: 'Carol Danvers', email: 'carol@example.com', role: 'Viewer', status: 'active' },
  { id: 4, name: 'David Miller', email: 'david@example.com', role: 'Manager', status: 'rejected' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', role: 'Support', status: 'active' },
];

export default {
  title: 'Components/SmartTable',
  component: SmartTable,
};

export const Default = (args: Partial<SmartTableProps<UserRecord>>) => {
  return (
    <SmartTable<UserRecord>
      data={sampleUsers}
      rowKey="id"
      columns={[
        { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
        { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
        { key: 'role', title: 'Role', dataIndex: 'role' },
        {
          key: 'status',
          title: 'Status',
          render: (val, record) => <StatusBadge status={record.status} pulse={record.status === 'active'} />,
        },
        {
          key: 'actions',
          title: 'Actions',
          align: 'right',
          render: (_, record) => (
            <ActionMenu
              items={[
                { id: 'edit', label: 'Edit', onClick: () => alert(`Edit ${record.name}`) },
                { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => alert(`Delete ${record.name}`) },
              ]}
            />
          ),
        },
      ]}
      selectable
      searchable
      exportable
      pageSize={5}
      {...args}
    />
  );
};
