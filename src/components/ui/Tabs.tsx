import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ items, defaultTab, onChange, className }: TabsProps) {
  const generatedId = useId();
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex gap-1 overflow-x-auto border-b border-[var(--border-color)]"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${generatedId}-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`${generatedId}-panel-${item.id}`}
              onClick={() => handleChange(item.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2 px-5 py-3.5 font-heading text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                isActive
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              {item.icon}
              {item.label}
              {item.count !== undefined && (
                <span className="text-[10px] text-[var(--text-muted)]">({item.count})</span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--color-noir-gold)]" />
              )}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${generatedId}-panel-${item.id}`}
          aria-labelledby={`${generatedId}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-6 focus-visible:outline-none"
        >
          {item.id === active && item.content}
        </div>
      ))}
    </div>
  );
}
