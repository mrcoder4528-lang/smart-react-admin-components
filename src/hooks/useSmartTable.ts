import { useState, useMemo, useCallback } from 'react';
import type { SortDirection, SmartTableColumn } from '../types';

export interface UseSmartTableOptions<T> {
  data: T[];
  columns: SmartTableColumn<T>[];
  rowKey: keyof T | ((record: T) => string | number);
  initialPageSize?: number;
  initialSortColumn?: string;
  initialSortDirection?: SortDirection;
  serverSide?: boolean;
  totalItems?: number; // Needed when serverSide is true
}

export function useSmartTable<T extends Record<string, any>>({
  data = [],
  columns,
  rowKey,
  initialPageSize = 10,
  initialSortColumn,
  initialSortDirection = null,
  serverSide = false,
  totalItems,
}: UseSmartTableOptions<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [sortColumn, setSortColumn] = useState<string | undefined>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string | number>>([]);

  const getRowKey = useCallback(
    (record: T): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey];
    },
    [rowKey],
  );

  // Sorting Handler
  const toggleSort = useCallback((columnKey: string) => {
    setSortColumn(prevCol => {
      if (prevCol === columnKey) {
        setSortDirection(prevDir => {
          if (prevDir === 'asc') return 'desc';
          if (prevDir === 'desc') return null;
          return 'asc';
        });
        return prevCol;
      }
      setSortDirection('asc');
      return columnKey;
    });
  }, []);

  // Filtered Data (Client-side)
  const filteredData = useMemo(() => {
    if (serverSide || !searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter(item => {
      return Object.values(item).some(val => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, serverSide]);

  // Sorted Data (Client-side)
  const sortedData = useMemo(() => {
    if (serverSide || !sortColumn || !sortDirection) return filteredData;

    const targetColumn = columns.find(c => c.key === sortColumn);
    const dataIndex = targetColumn?.dataIndex || sortColumn;

    return [...filteredData].sort((a, b) => {
      const valA = (a as any)[dataIndex];
      const valB = (b as any)[dataIndex];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      const comparison = valA < valB ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection, columns, serverSide]);

  // Paginated Data (Client-side)
  const paginatedData = useMemo(() => {
    if (serverSide) return data;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, data, currentPage, pageSize, serverSide]);

  const effectiveTotal = serverSide ? totalItems ?? data.length : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));

  // Selection helpers
  const currentKeys = useMemo(
    () => paginatedData.map(item => getRowKey(item)),
    [paginatedData, getRowKey],
  );

  const isAllSelected = currentKeys.length > 0 && currentKeys.every(k => selectedRowKeys.includes(k));
  const isSomeSelected =
    currentKeys.some(k => selectedRowKeys.includes(k)) && !isAllSelected;

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedRowKeys(prev => prev.filter(k => !currentKeys.includes(k)));
    } else {
      setSelectedRowKeys(prev => Array.from(new Set([...prev, ...currentKeys])));
    }
  }, [isAllSelected, currentKeys]);

  const toggleSelectRow = useCallback((key: string | number) => {
    setSelectedRowKeys(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortColumn,
    sortDirection,
    toggleSort,
    searchQuery,
    setSearchQuery,
    selectedRowKeys,
    setSelectedRowKeys,
    toggleSelectRow,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    isSomeSelected,
    data: paginatedData,
    totalCount: effectiveTotal,
    totalPages,
    getRowKey,
  };
}
