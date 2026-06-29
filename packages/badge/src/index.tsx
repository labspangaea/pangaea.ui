import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export type BadgeVariant = "accent" | "solid" | "soon" | "red" | "free" | "claude";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Mono uppercase pill. `accent` (pale-blue, default) · `solid` (electric blue) · `soon` (amber) ·
 * `red` (alert) · `free` (green) · `claude` (pale-blue, leading mark). Variants mirror the live
 * site's `.rv-chip--*`. Status hues pair with text, not colour alone.
 */
export const Badge = ({ variant = "accent", className, ...p }: BadgeProps) => (
  <span className={cx("rv-chip", variant !== "accent" && `rv-chip--${variant}`, className)} {...p} />
);
