import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

export const ButtonsGroup = React.forwardRef<HTMLDivElement, ButtonsGroupProps>(
  ({ className, orientation = 'horizontal', role, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={role ?? 'group'}
        className={cn(
          'nx-btn-group',
          orientation === 'vertical' && 'nx-btn-group--vertical',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ButtonsGroup.displayName = 'ButtonsGroup';
