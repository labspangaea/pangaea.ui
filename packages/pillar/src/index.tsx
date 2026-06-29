import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface PillarProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Optional link slot (e.g. a "Learn more →"). */
  link?: React.ReactNode;
  className?: string;
}

/** Icon + heading + body + link, for a feature trio. Wrap in <PillarGrid>. */
export function Pillar({ icon, title, children, link, className }: PillarProps) {
  return (
    <div className={cx("rv-pillar", className)}>
      {icon ? (
        <span className="rv-pillar-ico" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {link}
    </div>
  );
}

export function PillarGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rv-pillars", className)}>{children}</div>;
}
