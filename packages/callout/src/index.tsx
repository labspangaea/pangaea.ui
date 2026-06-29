import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export type CalloutVariant = "note" | "tip" | "caveat" | "warning" | "rule";

const ICONS: Record<CalloutVariant, React.ReactNode> = {
  note: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  tip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  ),
  caveat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  rule: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  ),
};

/** Default heading per variant (mirrors the pangaea.id Callout labels). */
const DEFAULT_TITLE: Record<CalloutVariant, string> = {
  note: "Note",
  tip: "Tip",
  caveat: "Caveat",
  warning: "Watch out",
  rule: "Rule of thumb",
};

export interface CalloutProps {
  variant?: CalloutVariant;
  /** Heading; defaults to the variant label (Note / Tip / Caveat / Watch out / Rule of thumb). Pass `null` to hide. */
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Note / tip / caveat / warning / rule — icon + tinted panel (never a side-stripe). */
export function Callout({ variant = "note", title, icon, children, className }: CalloutProps) {
  const heading = title === undefined ? DEFAULT_TITLE[variant] : title;
  return (
    <div className={cx("rv-callout", `rv-callout--${variant}`, className)}>
      <span className="rv-callout-icon" aria-hidden="true">
        {icon ?? ICONS[variant]}
      </span>
      <div className="rv-callout-content">
        {heading ? <p className="rv-callout-title">{heading}</p> : null}
        {children}
      </div>
    </div>
  );
}
