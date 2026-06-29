import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add an accent border ring for a featured/highlighted card. */
  featured?: boolean;
  /** "View all"/more tile — accent-soft fill, borderless until hover. */
  more?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { featured, more, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("rv-card", featured && "rv-card--featured", more && "rv-card--more", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface CardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  featured?: boolean;
  more?: boolean;
}

/** Interactive card rendered as an <a> — answers hover lift + press shrink. */
export const CardLink = React.forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { featured, more, className, children, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cx("rv-card", featured && "rv-card--featured", more && "rv-card--more", className)}
      {...rest}
    >
      {children}
    </a>
  );
});
