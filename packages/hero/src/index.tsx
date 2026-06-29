import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface HeroProps {
  kicker?: React.ReactNode;
  /** Pass plain text, or heroAccent(title, word) from @pangaea/ds-section for one blue word. */
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** CTA buttons. */
  actions?: React.ReactNode;
  /** Right-column visual — an SVG diagram, image, etc. Omit for a centered typographic hero. */
  visual?: React.ReactNode;
  className?: string;
}

export function Hero({ kicker, title, lead, actions, visual, className }: HeroProps) {
  return (
    <section className={cx("rv-hero", !visual && "rv-hero--center", className)}>
      <div className={cx("rv-hero-grid", !!visual && "rv-hero-grid--split")}>
        <div className="rv-hero-copy">
          {kicker ? <span className="rv-hero-kicker">{kicker}</span> : null}
          <h1 className="rv-hero-h1">{title}</h1>
          {lead ? <p className="rv-hero-lead">{lead}</p> : null}
          {actions ? <div className="rv-hero-actions">{actions}</div> : null}
        </div>
        {visual ? <div className="rv-hero-visual">{visual}</div> : null}
      </div>
    </section>
  );
}
