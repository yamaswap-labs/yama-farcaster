'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const Tabs = TabsPrimitive.Root;

const tabsVariants = cva(
  ['py-[3px] px-1 inline-flex items-center justify-center text-muted-foreground'],
  {
    variants: {
      variant: {
        default: 'border-tabs',
        button:
          'bg-tab-background rounded-md [&_button]:rounded-sm [&_button]:py-[5px] [&_button]:text-sm',
      },
      size: {
        default: 'rounded-18px [&_button]:rounded-16px',
        sm: 'rounded-16px [&_button]:rounded-16px',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva([''], {
  variants: {
    size: {
      default: 'px-6 py-0.5 text-sm md:text-base',
      sm: 'px-3 py-0 text-xs',
      md: 'py-[5px] text-sm',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1 whitespace-nowrap bg-tab font-normal outline-none transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-tab-active data-[state=active]:font-medium data-[state=active]:text-foreground [&_svg]:size-4',
      tabsTriggerVariants({ size, className }),
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('mt-2', className)} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
