import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  status?: "online" | "offline";
  className?: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Image or initials avatar with optional status dot. */
export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  return (
    <span className={cx("rv-avatar", `rv-avatar--${size}`, className)} title={name}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span className="rv-avatar-initials" aria-label={name}>
          {initials(name)}
        </span>
      )}
      {status ? <span className={cx("rv-avatar-dot", `rv-avatar-dot--${status}`)} aria-hidden="true" /> : null}
    </span>
  );
}
