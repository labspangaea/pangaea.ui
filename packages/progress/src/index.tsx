import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface ProgressProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  label?: string;
  className?: string;
}

/** Determinate or indeterminate progress bar. */
export function Progress({ value = 0, max = 100, indeterminate, label, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cx("rv-progress", indeterminate && "rv-progress--indet", className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="rv-progress-bar" style={indeterminate ? undefined : { width: `${pct}%` }} />
    </div>
  );
}
