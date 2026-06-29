import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

const Check = (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 5.5" />
  </svg>
);

export interface ChecklistProps {
  items: React.ReactNode[];
  className?: string;
}

/** Ticked feature/benefit list (accent check + text per row). */
export function Checklist({ items, className }: ChecklistProps) {
  return (
    <ul className={cx("rv-checklist", className)}>
      {items.map((it, i) => (
        <li key={i}>
          {Check}
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
