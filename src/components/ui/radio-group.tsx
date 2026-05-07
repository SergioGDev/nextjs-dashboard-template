'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  items: RadioItem[];
  disabled?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  items,
  disabled = false,
  className,
  orientation = 'vertical',
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  const handleChange = (itemValue: string) => {
    if (!isControlled) setInternalValue(itemValue);
    onChange?.(itemValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabledItems = items.filter((item) => !item.disabled && !disabled);
    const currentIndex = enabledItems.findIndex((item) => item.value === current);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % enabledItems.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    }

    if (nextIndex !== currentIndex) {
      handleChange(enabledItems[nextIndex].value);
    }
  };

  return (
    <div
      role="radiogroup"
      onKeyDown={handleKeyDown}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4',
        className,
      )}
    >
      {items.map((item) => {
        const isDisabled = disabled || item.disabled;
        const isChecked = current === item.value;
        const itemId = `${name}-${item.value}`;

        return (
          <label key={item.value} htmlFor={itemId} className="nx-radio-field">
            <div className="nx-radio-control">
              <input
                type="radio"
                id={itemId}
                name={name}
                value={item.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => handleChange(item.value)}
                tabIndex={isChecked || (current === '' && item === items[0]) ? 0 : -1}
              />
              <div className="nx-radio-box">
                <div className="nx-radio-dot" />
              </div>
            </div>
            {(item.label || item.description) && (
              <div>
                {item.label && (
                  <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                )}
                {item.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.description}</p>
                )}
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}
