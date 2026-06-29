import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface CtaBandProps {
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** CTA button(s) — use the ghost/blue variants for contrast on the navy band. */
  actions?: React.ReactNode;
  className?: string;
}

/** Full-bleed navy-gradient call-to-action band (white text, inverted buttons). */
export function CtaBand({ title, lead, actions, className }: CtaBandProps) {
  return (
    <div className={cx("rv-cta-band", className)}>
      <h2>{title}</h2>
      {lead ? <p className="rv-cta-lead">{lead}</p> : null}
      {actions ? <div className="rv-cta-actions">{actions}</div> : null}
    </div>
  );
}
