export interface ExportCSVColumn<T = any> {
  key: keyof T | string;
  label: string;
  format?: (value: any, record: T) => string;
}

export interface ExportCSVOptions<T = any> {
  filename?: string;
  columns?: ExportCSVColumn<T>[];
  delimiter?: string;
}

/**
 * Format a value to be safely inserted into CSV format
 */
export function formatCSVCell(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  // If string contains comma, quote, or newline, escape double quotes and wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Convert an array of objects to CSV string format
 */
export function generateCSVString<T extends Record<string, any>>(
  data: T[],
  options?: ExportCSVOptions<T>,
): string {
  if (!data || data.length === 0) {
    return '';
  }

  const delimiter = options?.delimiter || ',';
  let columns = options?.columns;

  if (!columns || columns.length === 0) {
    // Auto-detect keys from first record
    const keys = Object.keys(data[0]);
    columns = keys.map(key => ({ key, label: key }));
  }

  // Header row
  const headerRow = columns.map(c => formatCSVCell(c.label)).join(delimiter);

  // Data rows
  const dataRows = data.map(record => {
    return columns!
      .map(col => {
        const rawValue = (record as any)[col.key];
        const formatted = col.format ? col.format(rawValue, record) : rawValue;
        return formatCSVCell(formatted);
      })
      .join(delimiter);
  });

  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Export data as a CSV file in browser or return generated string
 */
export function exportCSV<T extends Record<string, any>>(
  data: T[],
  options?: ExportCSVOptions<T>,
): string {
  const csvContent = generateCSVString(data, options);
  const filename = options?.filename || 'export.csv';

  // If running in browser environment with URL.createObjectURL support, trigger download
  if (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function'
  ) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  }

  return csvContent;
}
