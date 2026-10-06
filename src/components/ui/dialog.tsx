'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  drawer = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  drawer?: boolean;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="overlay" />
        <DialogPrimitive.Content
          className={drawer ? 'drawer' : 'dialog'}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          <div className="dialog-header">
            <DialogPrimitive.Title asChild>
              <h2>{title}</h2>
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="btn btn-ghost btn-icon" aria-label="Close dialog">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>
          {description && (
            <DialogPrimitive.Description id="modal-description" className="dialog-description">
              {description}
            </DialogPrimitive.Description>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
