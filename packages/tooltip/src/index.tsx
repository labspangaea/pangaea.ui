import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  label: React.ReactNode;
  placement?: TooltipPlacement;
  children: React.ReactNode;
  className?: string;
}

/** CSS hover/focus tooltip. Wrap the trigger; shows `label` on hover or keyboard focus. */
export function Tooltip({ label, placement = "top", children, className }: TooltipProps) {
  const id = React.useId();
  return (
    <span
      className={cx("rv-tooltip", `rv-tooltip--${placement}`, className)}
      tabIndex={0}
      aria-describedby={id}
    >
      {children}
      <span className="rv-tooltip-pop" role="tooltip" id={id}>
        {label}
      </span>
    </span>
  );
}
