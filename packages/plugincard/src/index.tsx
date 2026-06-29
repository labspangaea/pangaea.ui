import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface PluginCardProps {
  name: string;
  description: string;
  /** Icon slot — an inline SVG or emoji; falls back to the name initial. */
  icon?: React.ReactNode;
  badge?: string;
  href?: string;
  className?: string;
}

export function PluginCard({ name, description, icon, badge, href, className }: PluginCardProps) {
  const body = (
    <>
      <div className="rv-plugincard-head">
        <span className="rv-plugincard-icon" aria-hidden="true">
          {icon ?? name.charAt(0).toUpperCase()}
        </span>
        <span className="rv-plugincard-name">{name}</span>
        {badge ? <span className="rv-plugincard-badge">{badge}</span> : null}
      </div>
      <p className="rv-plugincard-desc">{description}</p>
    </>
  );
  return href ? (
    <a className={cx("rv-plugincard", className)} href={href}>
      {body}
    </a>
  ) : (
    <div className={cx("rv-plugincard", className)}>{body}</div>
  );
}
