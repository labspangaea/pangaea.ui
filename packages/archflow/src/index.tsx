import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface ArchFlowProps {
  steps: string[];
  caption?: string;
  className?: string;
}

/** Horizontal pill-node flow with arrows; the terminal node gets the accent. */
export function ArchFlow({ steps, caption, className }: ArchFlowProps) {
  return (
    <figure className={cx("rv-archflow", className)}>
      <div className="rv-archflow-row">
        {steps.map((s, i) => (
          <span className="rv-archflow-step" key={i}>
            <span className={cx("rv-archflow-node", i === steps.length - 1 && "is-last")}>{s}</span>
            {i < steps.length - 1 ? (
              <span className="rv-archflow-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </span>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
