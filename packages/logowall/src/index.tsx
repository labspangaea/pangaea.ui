import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface LogoItem {
  name: string;
  src?: string;
  href?: string;
}

export interface LogoWallProps {
  logos: LogoItem[];
  label?: string;
  className?: string;
}

/** Trusted / partner logo strip — matches pangaea.id `.rv-trusted` (grayscale → colour on hover). */
export function LogoWall({ logos, label, className }: LogoWallProps) {
  return (
    <div className={cx("rv-trusted", className)}>
      {label ? <div className="rv-trusted-label">{label}</div> : null}
      <div className="rv-trusted-row">
        {logos.map((l, i) => {
          const mark = l.src ? <img src={l.src} alt={l.name} /> : <span className="rv-trusted-name">{l.name}</span>;
          return l.href ? (
            <a key={i} href={l.href} aria-label={l.name} rel="noopener noreferrer" target="_blank">
              {mark}
            </a>
          ) : (
            <span key={i}>{mark}</span>
          );
        })}
      </div>
    </div>
  );
}
