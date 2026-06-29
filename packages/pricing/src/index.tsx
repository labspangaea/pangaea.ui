import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface PricingTierProps {
  /** Mono-uppercase tier eyebrow (e.g. "ADOPT"). */
  name: string;
  price?: string;
  /** Period suffix after the price (e.g. "/ pilot"), shown muted. */
  period?: string;
  /** The "who it's for" line under the price. */
  tagline?: string;
  features: string[];
  cta?: React.ReactNode;
  featured?: boolean;
  featuredLabel?: string;
  className?: string;
}

/** Pricing tier card — matches pangaea.id `.rv-tier` exactly (eyebrow / price / for / ticks / CTA). */
export function PricingTier({
  name,
  price,
  period,
  tagline,
  features,
  cta,
  featured,
  featuredLabel = "Most adopted",
  className,
}: PricingTierProps) {
  return (
    <div className={cx("rv-tier", featured && "featured", className)}>
      {featured && featuredLabel ? <span className="rv-tier-feat-tag">{featuredLabel}</span> : null}
      <span className="rv-tier-name">{name}</span>
      {price ? (
        <div className="rv-tier-price">
          {price}
          {period ? <span> {period}</span> : null}
        </div>
      ) : null}
      {tagline ? <p className="rv-tier-for">{tagline}</p> : null}
      <ul>
        {features.map((f, i) => (
          <li key={i}>
            <span className="rv-tick" aria-hidden="true">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      {cta ?? null}
    </div>
  );
}

export interface PricingLadderProps {
  children: React.ReactNode;
  className?: string;
}

/** 2-up tier grid (the pangaea.id `.rv-tiers` wrapper). */
export function PricingLadder({ children, className }: PricingLadderProps) {
  return <div className={cx("rv-tiers", className)}>{children}</div>;
}
