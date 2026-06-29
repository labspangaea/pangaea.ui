import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface TableProps {
  /** The <thead>/<tbody> markup. */
  children: React.ReactNode;
  className?: string;
}

/** Responsive hairline data table — scroll-wrapped so it never overflows on phones. */
export function Table({ children, className }: TableProps) {
  return (
    <div className={cx("rv-table-wrap", className)}>
      <table>{children}</table>
    </div>
  );
}
