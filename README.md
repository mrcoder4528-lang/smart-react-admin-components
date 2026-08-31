# smart-react-admin-components ⚡

> Lightweight, accessible, TypeScript-first React components designed for rapidly building high-performance admin dashboards and data grids.

[![npm version](https://img.shields.io/npm/v/smart-react-admin-components.svg?style=flat-square&color=6366f1)](https://www.npmjs.com/package/smart-react-admin-components)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-react-admin-components?style=flat-square&color=10b981)](https://bundlephobia.com/package/smart-react-admin-components)
[![license](https://img.shields.io/npm/l/smart-react-admin-components.svg?style=flat-square)](https://github.com/vijay/smart-react-admin-components/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/github/actions/workflow/status/vijay/smart-react-admin-components/ci.yml?branch=main&style=flat-square)](https://github.com/vijay/smart-react-admin-components/actions)

---

## ✨ Features

- 🏎️ **Ultra-fast & Tree-Shakeable**: Dual ESM/CJS build with `"use client";` banner compatibility for Next.js App Router.
- 🎨 **Modern Design System**: Sleek aesthetics with built-in dark/light mode CSS tokens and zero runtime CSS overhead.
- ♿ **WAI-ARIA Compliant**: Accessible keyboard navigation, dialogs, status badges, and menus out of the box.
- 📦 **All-in-One Admin Toolkit**:
  - `SmartTable`: Sortable, searchable, selectable, paginated data grid with CSV export.
  - `SmartPagination`: Accessible page numbers, page size switcher, and item counts.
  - `SmartSearch`: Debounced input with keyboard shortcuts (`/` or `⌘K`) and clear button.
  - `SmartFilter`: Multi-category faceted filter popover with active filter tags.
  - `StatusBadge`: Semantic status pills with optional pulsing live activity indicators.
  - `ActionMenu`: Accessible dropdown for row-level and batch actions.
  - `ConfirmDialog`: Modal confirmation for dangerous or critical operations.
  - `EmptyState`: Visually balanced empty states with call-to-action support.
  - `exportCSV`: Universal client-side data exporter with quote-escaping and custom formatting.

---

## 📦 Installation

```bash
# npm
npm install smart-react-admin-components

# yarn
yarn add smart-react-admin-components

# pnpm
pnpm add smart-react-admin-components
```

### Import Styles

Import the CSS stylesheet once at the root of your application (e.g. `main.tsx`, `App.tsx`, or Next.js `layout.tsx`):

```tsx
import 'smart-react-admin-components/styles.css';
```

---

## 🚀 Quick Start

```tsx
import React from 'react';
import { SmartTable, StatusBadge, ActionMenu, type SmartTableColumn } from 'smart-react-admin-components';
import 'smart-react-admin-components/styles.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'rejected';
}

const users: User[] = [
  { id: 1, name: 'Alex Morgan', email: 'alex@example.com', role: 'Administrator', status: 'active' },
  { id: 2, name: 'Jordan Hayes', email: 'jordan@example.com', role: 'Editor', status: 'pending' },
  { id: 3, name: 'Taylor Reed', email: 'taylor@example.com', role: 'Viewer', status: 'rejected' },
];

const columns: SmartTableColumn<User>[] = [
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
          { id: 'edit', label: 'Edit', onClick: () => console.log('Edit', record.id) },
          { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => console.log('Delete', record.id) },
        ]}
      />
    ),
  },
];

export function UsersDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Users Management</h1>
      <SmartTable
        data={users}
        columns={columns}
        rowKey="id"
        selectable
        searchable
        exportable
        exportFilename="users-export.csv"
        pageSize={10}
        onSelectChange={(keys, rows) => console.log('Selected:', keys, rows)}
      />
    </div>
  );
}
```

---

## 🛠️ Component API Reference

### `<SmartTable />`
The primary data grid component. Supports client-side or server-side workflows.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `T[]` | `[]` | Array of records to display |
| `columns` | `SmartTableColumn<T>[]` | `[]` | Column configurations |
| `rowKey` | `keyof T \| ((r: T) => string \| number)` | **required** | Unique identifier for rows |
| `selectable` | `boolean` | `false` | Enables row selection checkboxes and batch bar |
| `searchable` | `boolean` | `true` | Enables built-in search input |
| `paginated` | `boolean` | `true` | Enables pagination controls |
| `pageSize` | `number` | `10` | Rows per page |
| `loading` | `boolean` | `false` | Shows animated loading skeleton rows |
| `exportable` | `boolean` | `true` | Renders "Export CSV" button |
| `exportFilename` | `string` | `'table-data.csv'` | Filename for CSV downloads |
| `striped` | `boolean` | `false` | Alternating row background colors |
| `dense` | `boolean` | `false` | Compact cell padding |
| `stickyHeader` | `boolean` | `false` | Fixes header during vertical scroll |
| `serverSide` | `boolean` | `false` | Disables client sorting/filtering/paging for API control |
| `totalItems` | `number` | `undefined` | Total record count for server-side pagination |
| `batchActions` | `(keys, rows) => ReactNode` | `undefined` | Custom action buttons on selection |
| `renderExpandedRow` | `(record, index) => ReactNode` | `undefined` | Accordion row expansion |

---

### `<StatusBadge />`
Displays semantic status pills with automatic palette mapping.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | **required** | Status text (e.g., `'active'`, `'pending'`, `'rejected'`, `'paid'`) |
| `variant` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral' \| 'primary'` | auto | Color variant override |
| `dot` | `boolean` | `true` | Shows indicator dot |
| `pulse` | `boolean` | `false` | Enables radiating pulse animation |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |

---

### `<SmartSearch />`
Search input with debouncing, clear button, and keyboard shortcuts.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | `undefined` | Controlled value |
| `onChange` | `(val: string) => void` | `undefined` | Instant input change callback |
| `onSearch` | `(val: string) => void` | `undefined` | Debounced search trigger |
| `debounceMs` | `number` | `0` | Debounce delay in milliseconds |
| `shortcutKey` | `string` | `'/'` | Global shortcut key (`'/'` or `'k'` for ⌘K) |

---

### `<SmartFilter />`
Faceted multi-category filter dropdown with active tag management.

```tsx
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

<SmartFilter
  filters={filters}
  value={selectedFilters}
  onChange={setSelectedFilters}
/>
```

---

### `<ActionMenu />`
Accessible action dropdown for table rows or cards.

```tsx
<ActionMenu
  items={[
    { id: 'view', label: 'View Profile', onClick: () => {} },
    { id: 'edit', label: 'Edit Account', onClick: () => {} },
    { id: 'sep', label: '', divider: true, onClick: () => {} },
    { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => {} },
  ]}
/>
```

---

### `<ConfirmDialog />`
Accessible confirmation modal dialog with async confirmation states.

```tsx
<ConfirmDialog
  isOpen={isModalOpen}
  title="Delete Project"
  message="Are you sure you want to delete this project? All associated resources will be permanently removed."
  variant="danger"
  confirmText="Delete"
  onClose={() => setModalOpen(false)}
  onConfirm={async () => {
    await deleteProject(id);
    setModalOpen(false);
  }}
/>
```

---

### `exportCSV(data, options)`
Utility function to export JavaScript objects to formatted CSV files.

```tsx
import { exportCSV } from 'smart-react-admin-components';

exportCSV(data, {
  filename: 'sales-report.csv',
  columns: [
    { key: 'orderId', label: 'Order ID' },
    { key: 'total', label: 'Total Amount', format: val => `$${val.toFixed(2)}` },
  ],
});
```

---

## 🎨 Theming & Customization

The design system uses standard CSS custom properties. You can customize the look and feel or switch to dark mode by setting attributes:

```html
<!-- Dark Mode -->
<body data-theme="dark">
  <!-- or <body class="dark"> -->
</body>
```

### Overriding CSS Variables

```css
:root {
  --sra-primary: #8b5cf6; /* Change accent to Purple */
  --sra-primary-hover: #7c3aed;
  --sra-radius-md: 10px; /* Custom rounded corners */
}
```

---

## 🏗️ Development & Publishing

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Versioning with Changesets
```bash
# Add a changeset for your changes
npx changeset

# Bump versions and generate changelog
npx changeset version

# Publish to npm
npm run release
```

---

## 📄 License

MIT © [Vijay](https://github.com/vijay)
