import React from 'react';

/**
 * Sorting direction
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort state for tables
 */
export interface SortState {
  columnKey: string;
  direction: SortDirection;
}

/**
 * Definition for a table column
 */
export interface SmartTableColumn<T = any> {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  hidden?: boolean;
}

/**
 * Filter item state
 */
export interface FilterItem {
  id: string;
  label: string;
  value: any;
  options?: Array<{ label: string; value: any }>;
}

/**
 * Status Badge variant
 */
export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary';

/**
 * Size variants
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Action menu item definition
 */
export interface ActionMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  divider?: boolean;
}
