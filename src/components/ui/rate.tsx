'use client';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { ComponentProps, forwardRef, ReactNode, useMemo } from 'react';

const rateVariants = cva(['text-sm font-medium']);

export interface RateProps extends ComponentProps<'span'>, VariantProps<typeof rateVariants> {
  suffix?: ReactNode;
}

const Rate = forwardRef<HTMLSpanElement, RateProps>(
  ({ className, children, suffix = '%', prefix = '', ...props }, ref) => {
    const base = useMemo<string>(() => {
      if (typeof children === 'number' || typeof children === 'string') {
        return Number(children) >= 0 ? 'text-number-positive' : 'text-number-negative';
      }

      return '';
    }, [children]);

    const formatted = useMemo<string>(() => {
      if (typeof children === 'number' || typeof children === 'string') {
        return Number(children) >= 0
          ? `+${prefix}${children}${suffix}`
          : `${prefix}${children}${suffix}`;
      }

      return '';
    }, [children, prefix, suffix]);

    return (
      <span ref={ref} className={cn(rateVariants({ className: cn(base, className) }))} {...props}>
        {formatted}
      </span>
    );
  },
);
Rate.displayName = 'rate';

export { Rate };
