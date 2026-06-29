import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface QuoteProps {
  children: React.ReactNode;
  /** Attribution line (name, role). */
  cite?: React.ReactNode;
  /** Larger, lead-style pull quote. */
  pull?: boolean;
  className?: string;
}

export function Quote({ children, cite, pull, className }: QuoteProps) {
  return (
    <figure className={cx("rv-quote", pull && "rv-quote--pull", className)}>
      <blockquote>{children}</blockquote>
      {cite ? <figcaption>{cite}</figcaption> : null}
    </figure>
  );
}
