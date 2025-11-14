import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { CircleXIcon } from 'lucide-react';
import { ReactNode, useMemo } from 'react';

const inputVariants = cva(
  [
    'text-sm placeholder-white/40',
    'ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        filled: 'bg-input-background',
        outlined: 'bg-input-background border border-input',
        borderless: 'bg-transparent focus-visible:ring-0',
      },
      size: {
        sm: '', // TODO
        md: 'h-9 px-3',
        lg: 'h-12 px-4',
      },
      rounded: { true: 'rounded-18px', false: 'rounded-md' },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      rounded: false,
    },
  },
);
export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  prefix?: ReactNode;
  suffix?: ReactNode;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, onClear, rounded, size, variant, ...props }, ref) => {
    const showClear = useMemo(
      () => typeof onClear === 'function' && props.value,
      [onClear, props.value],
    );

    return (
      <label className="relative block">
        {!!prefix && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white [&_svg]:size-5 [&_svg]:text-white/40">
            {prefix}
          </span>
        )}
        <input
          type={type}
          onWheel={(e) => e.currentTarget.blur()}
          className={cn(
            'flex w-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-sm',
            inputVariants({ size, rounded, variant, className }),
            prefix ? 'pl-[42px]' : '',
            suffix ? 'pr-[42px]' : '',
          )}
          ref={ref}
          {...props}
        />
        {showClear && (
          <button
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-white/40 [&_svg]:size-5"
            onClick={() => {
              onClear?.();
            }}
          >
            <CircleXIcon />
          </button>
        )}
        {!!suffix && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-white [&_svg]:size-5 [&_svg]:text-white/40">
            {suffix}
          </span>
        )}
      </label>
    );
  },
);
Input.displayName = 'Input';

export { Input };
