import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterCategory {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface SmartFilterProps {
  filters: FilterCategory[];
  value?: Record<string, (string | number)[]>;
  onChange: (value: Record<string, (string | number)[]>) => void;
  onClear?: () => void;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SmartFilter: React.FC<SmartFilterProps> = ({
  filters,
  value = {},
  onChange,
  onClear,
  label = 'Filters',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  // Count active filters
  const activeCount = Object.values(value).reduce(
    (acc, currentList) => acc + (currentList?.length || 0),
    0,
  );

  const toggleOption = (categoryKey: string, optionValue: string | number) => {
    const currentCategoryValues = value[categoryKey] || [];
    let updatedCategoryValues: (string | number)[];

    if (currentCategoryValues.includes(optionValue)) {
      updatedCategoryValues = currentCategoryValues.filter(v => v !== optionValue);
    } else {
      updatedCategoryValues = [...currentCategoryValues, optionValue];
    }

    const updated = {
      ...value,
      [categoryKey]: updatedCategoryValues,
    };

    // Remove empty keys
    if (updatedCategoryValues.length === 0) {
      delete updated[categoryKey];
    }

    onChange(updated);
  };

  const handleClearAll = () => {
    onChange({});
    onClear?.();
  };

  const removeSpecificTag = (categoryKey: string, optionValue: string | number) => {
    toggleOption(categoryKey, optionValue);
  };

  return (
    <div
      className={`sra-filter-container ${className}`}
      style={style}
      ref={containerRef}
    >
      <button
        type="button"
        className="sra-btn sra-btn--secondary sra-btn--sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span>{label}</span>
        {activeCount > 0 && (
          <span
            className="sra-badge sra-badge--primary sra-badge--sm"
            style={{ padding: '0 5px', minWidth: '18px', height: '18px', justifyContent: 'center' }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* Active Filter Tags */}
      {filters.map(category => {
        const selectedInCategory = value[category.key] || [];
        return selectedInCategory.map(val => {
          const optionObj = category.options.find(o => o.value === val);
          return (
            <span key={`${category.key}-${val}`} className="sra-filter-tag">
              <span>
                {category.label}: {optionObj?.label || val}
              </span>
              <button
                type="button"
                className="sra-filter-tag__remove"
                onClick={() => removeSpecificTag(category.key, val)}
                aria-label={`Remove filter ${category.label}: ${optionObj?.label || val}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          );
        });
      })}

      {activeCount > 0 && (
        <button
          type="button"
          className="sra-btn sra-btn--ghost sra-btn--sm"
          onClick={handleClearAll}
          style={{ fontSize: '0.75rem' }}
        >
          Clear all
        </button>
      )}

      {/* Popover */}
      {isOpen && (
        <div className="sra-filter-popover" role="dialog" aria-label="Filter Options">
          {filters.map(category => (
            <div key={category.key} style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--sra-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.35rem',
                }}
              >
                {category.label}
              </div>
              <div>
                {category.options.map(option => {
                  const isChecked = (value[category.key] || []).includes(option.value);
                  return (
                    <label key={String(option.value)} className="sra-filter-option">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOption(category.key, option.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
