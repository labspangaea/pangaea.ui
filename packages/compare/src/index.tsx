import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export function Compare({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rv-compare", className)}>{children}</div>;
}

export interface ColProps {
  label: React.ReactNode;
  /** "good" highlights the column blue (e.g. the recommended option). */
  tone?: "good";
  children: React.ReactNode;
  className?: string;
}

export function Col({ label, tone, children, className }: ColProps) {
  return (
    <div className={cx("rv-compare-col", tone && `rv-compare-col--${tone}`, className)}>
      <p className="rv-compare-head">{label}</p>
      <div className="rv-compare-body">{children}</div>
    </div>
  );
}
