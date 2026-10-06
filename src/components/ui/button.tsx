import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
export function Button({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'dark' | 'ghost' | 'danger';
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={cn('btn', variant !== 'default' && `btn-${variant}`, className)}
      {...props}
    />
  );
}
