import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

/** Inline citation link (superscript, opens in a new tab). */
export function Cite({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={cx("rv-cite", className)} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export interface ReferencesProps {
  /** Section heading (defaults "Sources"; pass a localized string for i18n). */
  heading?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function References({ heading = "Sources", children, className }: ReferencesProps) {
  return (
    <section className={cx("rv-refs", className)}>
      <p className="rv-refs-head">{heading}</p>
      <ol>{children}</ol>
    </section>
  );
}

export function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </li>
  );
}
