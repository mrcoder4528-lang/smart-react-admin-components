import React, { useMemo } from 'react';
import type { SmartTableColumn, SortDirection } from '../../types';
import { useSmartTable } from '../../hooks/useSmartTable';
import { SmartPagination } from '../SmartPagination';
import { SmartSearch } from '../SmartSearch';
import { TableSkeleton } from '../../skeletons/TableSkeleton';
import { EmptyState } from '../EmptyState';
import { exportCSV } from '../../utils/exportCSV';

export interface SmartTableProps<T extends Record<string, any> = any> {
  data: T[];
  columns: SmartTableColumn<T>[];
  rowKey: keyof T | ((record: T) => string | number);
  loading?: boolean;
  loadingRows?: number;
  selectable?: boolean;
  selectedRowKeys?: Array<string | number>;
  onSelectChange?: (selectedKeys: Array<string | number>, selectedRows: T[]) => void;
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSortChange?: (columnKey: string, direction: SortDirection) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  paginated?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  serverSide?: boolean;
  exportable?: boolean;
  exportFilename?: string;
  striped?: boolean;
  dense?: boolean;
  stickyHeader?: boolean;
  emptyState?: React.ReactNode;
  batchActions?: (selectedKeys: Array<string | number>, selectedRows: T[]) => React.ReactNode;
  headerToolbar?: React.ReactNode;
  onRowClick?: (record: T, index: number, event: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  renderExpandedRow?: (record: T, index: number) => React.ReactNode;
}

export function SmartTable<T extends Record<string, any> = any>({
  data: inputData = [],
  columns,
  rowKey,
  loading = false,
  loadingRows = 5,
  selectable = false,
  selectedRowKeys: controlledSelectedKeys,
  onSelectChange,
  sortable = true,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSortChange,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchValue: controlledSearchValue,
  onSearchChange,
  paginated = true,
  currentPage: controlledCurrentPage,
  pageSize: controlledPageSize = 10,
  totalItems: controlledTotalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  serverSide = false,
  exportable = true,
  exportFilename = 'table-data.csv',
  striped = false,
  dense = false,
  stickyHeader = false,
  emptyState,
  batchActions,
  headerToolbar,
  onRowClick,
  className = '',
  style,
  renderExpandedRow,
}: SmartTableProps<T>) {
  // Use smart table hook for internal handling when uncontrolled
  const tableState = useSmartTable<T>({
    data: inputData,
    columns,
    rowKey,
    initialPageSize: controlledPageSize,
    initialSortColumn: controlledSortColumn,
    initialSortDirection: controlledSortDirection,
    serverSide,
    totalItems: controlledTotalItems,
  });

  // Determine effective values (controlled vs uncontrolled)
  const effectiveCurrentPage = controlledCurrentPage ?? tableState.currentPage;
  const effectivePageSize = controlledPageSize ?? tableState.pageSize;
  const effectiveSortColumn = controlledSortColumn ?? tableState.sortColumn;
  const effectiveSortDirection = controlledSortDirection ?? tableState.sortDirection;
  const effectiveSearchValue = controlledSearchValue ?? tableState.searchQuery;
  const effectiveSelectedKeys = controlledSelectedKeys ?? tableState.selectedRowKeys;

  const effectiveTotalItems = serverSide
    ? controlledTotalItems ?? inputData.length
    : tableState.totalCount;

  const displayData = serverSide ? inputData : tableState.data;

  // Visible columns
  const visibleColumns = useMemo(() => columns.filter(col => !col.hidden), [columns]);

  const handleSort = (colKey: string, isColSortable: boolean | undefined) => {
    if (!sortable || isColSortable === false) return;

    if (onSortChange) {
      const nextDir: SortDirection =
        effectiveSortColumn === colKey
          ? effectiveSortDirection === 'asc'
            ? 'desc'
            : effectiveSortDirection === 'desc'
            ? null
            : 'asc'
          : 'asc';
      onSortChange(colKey, nextDir);
    } else {
      tableState.toggleSort(colKey);
    }
  };

  const handleSearch = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      tableState.setSearchQuery(val);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      tableState.setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      tableState.setPageSize(size);
      tableState.setCurrentPage(1);
    }
  };

  const handleSelectRow = (key: string | number) => {
    let nextKeys: Array<string | number>;
    if (effectiveSelectedKeys.includes(key)) {
      nextKeys = effectiveSelectedKeys.filter(k => k !== key);
    } else {
      nextKeys = [...effectiveSelectedKeys, key];
    }

    if (onSelectChange) {
      const selectedRows = inputData.filter(item => nextKeys.includes(tableState.getRowKey(item)));
      onSelectChange(nextKeys, selectedRows);
    } else {
      tableState.setSelectedRowKeys(nextKeys);
    }
  };

  const currentDisplayKeys = useMemo(
    () => displayData.map(item => tableState.getRowKey(item)),
    [displayData, tableState],
  );

  const isAllCurrentSelected =
    currentDisplayKeys.length > 0 &&
    currentDisplayKeys.every(k => effectiveSelectedKeys.includes(k));

  const isSomeCurrentSelected =
    currentDisplayKeys.some(k => effectiveSelectedKeys.includes(k)) && !isAllCurrentSelected;

  const handleSelectAll = () => {
    let nextKeys: Array<string | number>;
    if (isAllCurrentSelected) {
      nextKeys = effectiveSelectedKeys.filter(k => !currentDisplayKeys.includes(k));
    } else {
      nextKeys = Array.from(new Set([...effectiveSelectedKeys, ...currentDisplayKeys]));
    }

    if (onSelectChange) {
      const selectedRows = inputData.filter(item => nextKeys.includes(tableState.getRowKey(item)));
      onSelectChange(nextKeys, selectedRows);
    } else {
      tableState.setSelectedRowKeys(nextKeys);
    }
  };

  const handleExportCSV = () => {
    const csvCols = visibleColumns.map(col => ({
      key: (col.dataIndex as string) || col.key,
      label: typeof col.title === 'string' ? col.title : col.key,
    }));
    exportCSV(inputData, {
      filename: exportFilename,
      columns: csvCols,
    });
  };

  const selectedRowsList = useMemo(() => {
    return inputData.filter(item => effectiveSelectedKeys.includes(tableState.getRowKey(item)));
  }, [inputData, effectiveSelectedKeys, tableState]);

  return (
    <div
      className={`sra-root sra-table-card ${dense ? 'sra-table--dense' : ''} ${className}`}
      style={style}
    >
      {/* Header Toolbar */}
      {(searchable || exportable || headerToolbar) && (
        <div className="sra-table-header-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {searchable && (
              <SmartSearch
                value={effectiveSearchValue}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
              />
            )}
            {headerToolbar}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {exportable && (
              <button
                type="button"
                className="sra-btn sra-btn--secondary sra-btn--sm"
                onClick={handleExportCSV}
                title="Export as CSV"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Batch Selection Bar */}
      {selectable && effectiveSelectedKeys.length > 0 && (
        <div className="sra-table-selection-bar">
          <div>
            <span>
              <strong>{effectiveSelectedKeys.length}</strong> row(s) selected
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {batchActions ? (
              batchActions(effectiveSelectedKeys, selectedRowsList)
            ) : (
              <button
                type="button"
                className="sra-btn sra-btn--ghost sra-btn--sm"
                onClick={() => {
                  if (onSelectChange) onSelectChange([], []);
                  else tableState.clearSelection();
                }}
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="sra-table-wrapper">
        <table className="sra-table">
          <thead className={`sra-thead ${stickyHeader ? 'sra-thead--sticky' : ''}`}>
            <tr className="sra-tr">
              {selectable && (
                <th className="sra-th" style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    ref={el => {
                      if (el) el.indeterminate = isSomeCurrentSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    style={{ cursor: 'pointer' }}
                  />
                </th>
              )}

              {visibleColumns.map(col => {
                const isColSortable = sortable && col.sortable !== false;
                const isSorted = effectiveSortColumn === col.key;

                return (
                  <th
                    key={col.key}
                    className={`sra-th ${isColSortable ? 'sra-th--sortable' : ''} ${
                      col.headerClassName || ''
                    }`}
                    style={{
                      width: col.width,
                      textAlign: col.align || 'left',
                    }}
                    onClick={() => handleSort(col.key, col.sortable)}
                    role={isColSortable ? 'button' : undefined}
                    aria-sort={
                      isSorted
                        ? effectiveSortDirection === 'asc'
                          ? 'ascending'
                          : effectiveSortDirection === 'desc'
                          ? 'descending'
                          : 'none'
                        : undefined
                    }
                  >
                    <span className="sra-th-content">
                      <span>{col.title}</span>
                      {isColSortable && (
                        <span
                          style={{
                            display: 'inline-flex',
                            opacity: isSorted ? 1 : 0.35,
                            transition: 'opacity 0.15s ease',
                          }}
                        >
                          {isSorted && effectiveSortDirection === 'desc' ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          ) : isSorted && effectiveSortDirection === 'asc' ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="18 15 12 9 6 15" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton
              rows={loadingRows}
              columns={visibleColumns.length}
              hasCheckbox={selectable}
            />
          ) : displayData.length > 0 ? (
            <tbody className="sra-tbody">
              {displayData.map((record, index) => {
                const key = tableState.getRowKey(record);
                const isSelected = effectiveSelectedKeys.includes(key);

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={`sra-tr ${striped ? 'sra-tr--striped' : ''} ${
                        isSelected ? 'sra-tr--selected' : ''
                      }`}
                      onClick={e => onRowClick?.(record, index, e)}
                      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                    >
                      {selectable && (
                        <td className="sra-td" style={{ width: '40px' }} onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(key)}
                            aria-label={`Select row ${index + 1}`}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      )}

                      {visibleColumns.map(col => {
                        const rawValue = col.dataIndex ? (record as any)[col.dataIndex] : (record as any)[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`sra-td ${col.className || ''}`}
                            style={{ textAlign: col.align || 'left' }}
                          >
                            {col.render ? col.render(rawValue, record, index) : (rawValue ?? '-')}
                          </td>
                        );
                      })}
                    </tr>
                    {renderExpandedRow && (
                      <tr className="sra-tr sra-tr--expanded">
                        <td colSpan={visibleColumns.length + (selectable ? 1 : 0)}>
                          {renderExpandedRow(record, index)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          ) : null}
        </table>

        {/* Empty state container */}
        {!loading && displayData.length === 0 && (
          <div className="sra-table-empty">
            {emptyState || <EmptyState />}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {paginated && (
        <SmartPagination
          currentPage={effectiveCurrentPage}
          pageSize={effectivePageSize}
          totalItems={effectiveTotalItems}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
