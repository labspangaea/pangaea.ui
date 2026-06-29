import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface AccordionItemProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Group name → native single-open accordion (only one item open at a time). */
  name?: string;
}

export function AccordionItem({ summary, children, defaultOpen, name }: AccordionItemProps) {
  return (
    <details className="rv-acc-item" open={defaultOpen} name={name}>
      <summary>
        <span>{summary}</span>
        <span className="rv-acc-plus" aria-hidden="true" />
      </summary>
      <div className="rv-acc-a">{children}</div>
    </details>
  );
}

export interface AccordionProps {
  children: React.ReactNode;
  /** Tight variant — items butt together with no gap (e.g. under a section head). */
  inline?: boolean;
  className?: string;
}

export function Accordion({ children, inline, className }: AccordionProps) {
  return <div className={cx("rv-acc", inline && "rv-acc--inline", className)}>{children}</div>;
}

export interface AccordionCategoryProps {
  /** Optional leading icon (e.g. an inline SVG). */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Mono kicker label above a group of items. */
export function AccordionCategory({ icon, children, className }: AccordionCategoryProps) {
  return (
    <p className={cx("rv-acc-cat", className)}>
      {icon}
      {children}
    </p>
  );
}
