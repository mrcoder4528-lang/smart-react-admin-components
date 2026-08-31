import React from 'react';

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  hasCheckbox?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  hasCheckbox = false,
}) => {
  const rowList = Array.from({ length: rows }, (_, i) => i);
  const colList = Array.from({ length: columns }, (_, i) => i);

  return (
    <tbody className={`sra-tbody sra-skeleton-tbody ${className}`} data-testid="table-skeleton">
      {rowList.map(rowIndex => (
        <tr key={rowIndex} className="sra-tr sra-skeleton-tr">
          {hasCheckbox && (
            <td className="sra-td" style={{ width: '40px' }}>
              <div
                className="sra-skeleton"
                style={{ width: '16px', height: '16px', borderRadius: '4px' }}
              />
            </td>
          )}
          {colList.map(colIndex => (
            <td key={colIndex} className="sra-td">
              <div
                className="sra-skeleton"
                style={{
                  height: '16px',
                  width: `${60 + ((colIndex * 17) % 35)}%`,
                  borderRadius: '4px',
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
