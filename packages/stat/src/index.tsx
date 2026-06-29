import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");
const clamp = (n: number) => Math.max(0, Math.min(100, n));

export interface StatProps {
  value: React.ReactNode;
  label: React.ReactNode;
  /** 0–100 → renders a progress bar (the metric variant). */
  pct?: number;
  /** Icon → renders the iconed metric variant. */
  icon?: React.ReactNode;
  className?: string;
}

/** Big-number stat. Plain `value + label`, or the metric variant when `pct`/`icon` is set. */
export function Stat({ value, label, pct, icon, className }: StatProps) {
  if (pct != null || icon != null) {
    return (
      <div className={cx("rv-metric", className)}>
        {icon ? (
          <span className="rv-metric-ico" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="rv-metric-v">{value}</span>
        <span className="rv-metric-k">{label}</span>
        {pct != null ? (
          <span className="rv-bar">
            <i style={{ width: `${clamp(pct)}%` }} />
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div className={cx("rv-stat", className)}>
      <div className="rv-stat-v">{value}</div>
      <div className="rv-stat-k">{label}</div>
    </div>
  );
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rv-stats", className)}>{children}</div>;
}
