'use client';

import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, indeterminate, ...props }, ref) => {
    const checkId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const innerRef = React.useRef<HTMLInputElement>(null);

    const setRef = React.useCallback(
      (el: HTMLInputElement | null) => {
        (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [ref]
    );

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    return (
      <label htmlFor={checkId} className={cn('nx-checkbox-field', className)}>
        <div className="nx-checkbox-control">
          <input type="checkbox" id={checkId} ref={setRef} {...props} />
          <div className="nx-checkbox-box">
            {indeterminate ? (
              <Minus size={10} className="nx-checkbox-icon" />
            ) : (
              <Check size={10} className="nx-checkbox-icon" />
            )}
          </div>
        </div>
        {(label || description) && (
          <div>
            {label && (
              <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
            )}
            {description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
