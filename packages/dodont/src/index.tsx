import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

const CheckMark = (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 5.5" />
  </svg>
);
const CrossMark = (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);

export function DoDont({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rv-dodont", className)}>{children}</div>;
}

export function Do({ title = "Do", children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rv-dd", "rv-dd--do", className)}>
      <p className="rv-dd-head">
        {CheckMark} {title}
      </p>
      <div className="rv-dd-body">{children}</div>
    </div>
  );
}

export function Dont({ title = "Don't", children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("rv-dd", "rv-dd--dont", className)}>
      <p className="rv-dd-head">
        {CrossMark} {title}
      </p>
      <div className="rv-dd-body">{children}</div>
    </div>
  );
}
