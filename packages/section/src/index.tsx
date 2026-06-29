import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const Container = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("rv-container", className)} {...p} />
);

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** "alt" = blue-tinted band; "tight" = shorter vertical rhythm. */
  variant?: "default" | "alt" | "tight";
}
export const Section = ({ variant = "default", className, ...p }: SectionProps) => (
  <section
    className={cx(
      "rv-section",
      variant === "alt" && "rv-section--alt",
      variant === "tight" && "rv-section--tight",
      className,
    )}
    {...p}
  />
);

export type GridCols = 2 | 3 | 4;
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
}
export const Grid = ({ cols = 3, className, ...p }: GridProps) => (
  <div className={cx("rv-grid", `rv-grid--${cols}`, className)} {...p} />
);

export const Kicker = ({ className, ...p }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cx("rv-kicker", className)} {...p} />
);

export const Lead = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cx("rv-lead", className)} {...p} />
);

export const H1 = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className={cx("rv-h1", className)} {...p} />
);
export const H2 = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cx("rv-h2", className)} {...p} />
);

/**
 * Wrap exactly one word of a hero title in the AA-safe accent blue
 * (--rv-accent-ink). One blue word per hero — the shared mechanism.
 */
export function heroAccent(title: string, word: string): React.ReactNode {
  const i = title.indexOf(word);
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="rv-hero-accent">{word}</span>
      {title.slice(i + word.length)}
    </>
  );
}

export interface SectionHeadProps {
  /** Optional index marker (e.g. "01"), shown above the kicker. */
  index?: string;
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /**
   * Tag for the title. Listing pages pass "h1" to keep exactly one <h1> per page.
   * The visual size stays rv-h2 either way — the tag is decoupled from the style.
   */
  as?: "h1" | "h2";
  center?: boolean;
  className?: string;
}
export function SectionHead({ index, kicker, title, lead, as: As = "h2", center, className }: SectionHeadProps) {
  return (
    <div className={cx("rv-section-head", center && "rv-center", className)}>
      {index ? <span className="rv-index">{index}</span> : null}
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <As className="rv-h2">{title}</As>
      {lead ? <Lead>{lead}</Lead> : null}
    </div>
  );
}
