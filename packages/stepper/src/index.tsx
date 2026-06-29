import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export type StepStatus = "done" | "active" | "upcoming";

export interface Step {
  label: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperProps {
  steps: Step[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const CheckMark = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10.5l3.5 3.5L16 5.5" />
  </svg>
);

/** Stepper / timeline — horizontal or vertical, status-driven nodes + connectors. */
export function Stepper({ steps, orientation = "horizontal", className }: StepperProps) {
  return (
    <ol className={cx("rv-stepper", `rv-stepper--${orientation}`, className)}>
      {steps.map((s, i) => {
        const status = s.status ?? "upcoming";
        return (
          <li key={i} className={cx("rv-step", `rv-step--${status}`)}>
            <span className="rv-step-node">{status === "done" ? <span className="rv-step-check">{CheckMark}</span> : i + 1}</span>
            {i < steps.length - 1 ? <span className="rv-step-line" aria-hidden="true" /> : null}
            <span className="rv-step-body">
              <span className="rv-step-label">{s.label}</span>
              {s.description ? <span className="rv-step-desc">{s.description}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
