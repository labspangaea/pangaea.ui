import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface PointProps {
  /** Index marker (e.g. "01"). */
  n?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Point({ n, title, children, className }: PointProps) {
  return (
    <div className={cx("rv-point", className)}>
      {n != null ? <span className="rv-point-n">{n}</span> : null}
      <h4>{title}</h4>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function Points({
  cols = 3,
  children,
  className,
}: {
  cols?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx("rv-points", `rv-points--${cols}`, className)}>{children}</div>;
}
