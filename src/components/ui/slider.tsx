'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      showValue = false,
      formatValue,
      id,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      ...props
    },
    ref,
  ) => {
    const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [internalValue, setInternalValue] = React.useState<number>(
      value !== undefined ? Number(value) : defaultValue !== undefined ? Number(defaultValue) : min,
    );

    const isControlled = value !== undefined;
    const current = isControlled ? Number(value) : internalValue;

    const displayValue = formatValue ? formatValue(current) : String(current);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (!isControlled) setInternalValue(next);
      onChange?.(e);
    };

    return (
      <div className={cn('nx-slider-wrap', className)}>
        {(label || showValue) && (
          <div className="nx-slider-header">
            {label && (
              <label htmlFor={sliderId} className="nx-label">
                {label}
              </label>
            )}
            {showValue && <span className="nx-slider-value">{displayValue}</span>}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={isControlled ? value : internalValue}
          onChange={handleChange}
          className="nx-slider"
          {...props}
        />
      </div>
    );
  },
);
Slider.displayName = 'Slider';
