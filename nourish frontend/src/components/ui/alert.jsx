import React from 'react';
import { cn } from '@/lib/utils';

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-background text-foreground border border-border',
    destructive: 'bg-red-50 text-red-900 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border border-yellow-200',
    success: 'bg-green-50 text-green-900 border border-green-200',
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg p-4',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Alert.displayName = 'Alert';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription };
