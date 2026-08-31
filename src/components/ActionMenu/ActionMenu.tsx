import React, { useState, useRef, useEffect } from 'react';
import type { ActionMenuItem } from '../../types';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  trigger,
  align = 'right',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false), isOpen);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleItemClick = (item: ActionMenuItem) => {
    if (item.disabled) return;
    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={`sra-action-menu ${className}`} style={style} ref={menuRef}>
      <button
        type="button"
        className="sra-btn sra-btn--ghost sra-btn--sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Actions"
      >
        {trigger || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="sra-action-menu__dropdown"
          style={{ [align === 'left' ? 'left' : 'right']: 0 }}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map(item => {
            if (item.divider) {
              return <div key={item.id} className="sra-action-menu__divider" role="separator" />;
            }

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`sra-action-menu__item ${
                  item.variant === 'danger' ? 'sra-action-menu__item--danger' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.icon && <span className="sra-action-menu__icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
