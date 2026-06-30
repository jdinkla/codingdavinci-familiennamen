import { useState, type ReactNode } from 'react';

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

export function CollapsiblePanel({ title, defaultOpen = false, actions, children }: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mt-6 border-t border-gray-200 pt-4">
      <button
        type="button"
        className="flex items-center gap-2 text-lg font-medium text-gray-900"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className="inline-block w-4">
          {open ? '−' : '+'}
        </span>
        {title}
      </button>
      {open && (
        <div className="mt-3">
          {actions && <div className="mb-3 flex flex-wrap gap-2">{actions}</div>}
          {children}
        </div>
      )}
    </section>
  );
}
