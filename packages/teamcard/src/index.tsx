import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export interface TeamCardProps {
  name: string;
  role: string;
  avatarSrc?: string;
  bio?: string;
  /** Optional social links slot (e.g. <SocialIcons size="sm" … />). */
  socials?: React.ReactNode;
  /** Links the card to a profile (e.g. /team/:slug). */
  href?: string;
  className?: string;
}

/** Team member card — matches pangaea.id `.rv-member` (navy avatar, name, role, bio). */
export function TeamCard({ name, role, avatarSrc, bio, socials, href, className }: TeamCardProps) {
  const body = (
    <>
      <span className="rv-avatar">{avatarSrc ? <img src={avatarSrc} alt={name} /> : initials(name)}</span>
      <h4>{name}</h4>
      <span className="rv-member-role">{role}</span>
      {bio ? <p>{bio}</p> : null}
      {socials ? <span className="rv-member-socials">{socials}</span> : null}
    </>
  );
  return href ? (
    <a className={cx("rv-member", className)} href={href}>
      {body}
    </a>
  ) : (
    <div className={cx("rv-member", className)}>{body}</div>
  );
}
