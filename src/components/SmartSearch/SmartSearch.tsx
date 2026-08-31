import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export interface SmartSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  shortcutKey?: string; // e.g. '/' or 'k'
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 0,
  shortcutKey = '/',
  loading = false,
  className = '',
  style,
  autoFocus = false,
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState<string>(controlledValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const debouncedValue = useDebounce(currentValue, debounceMs);

  // Sync internal state if controlled value updates
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Handle debounced search trigger
  useEffect(() => {
    if (debounceMs > 0 && onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, debounceMs, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
    if (debounceMs === 0) {
      onSearch?.(val);
    }
  };

  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onChange?.('');
    onSearch?.('');
    inputRef.current?.focus();
  }, [controlledValue, onChange, onSearch]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!shortcutKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input/textarea/editable
      const target = e.target as HTMLElement;
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) ||
        target?.isContentEditable
      ) {
        return;
      }

      if (
        (shortcutKey === '/' && e.key === '/') ||
        (shortcutKey.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey]);

  return (
    <div className={`sra-search ${className}`} style={style}>
      <span className="sra-search__icon-left" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        ref={inputRef}
        type="text"
        role="searchbox"
        aria-label={placeholder}
        className="sra-search__input"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        autoFocus={autoFocus}
        disabled={disabled}
      />

      <div className="sra-search__icon-right">
        {loading && (
          <span className="sra-search__spinner" aria-label="Loading...">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
        )}

        {currentValue && !loading && (
          <button
            type="button"
            className="sra-search__clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {shortcutKey && !currentValue && !loading && (
          <kbd className="sra-search__shortcut">{shortcutKey === '/' ? '/' : '⌘K'}</kbd>
        )}
      </div>
    </div>
  );
};
