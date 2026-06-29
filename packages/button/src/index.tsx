import * as React from "react";

export type ButtonVariant = "primary" | "ghost" | "blue";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

/** The class string for a button-styled element, if you need it on your own markup. */
export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cx("rv-btn", `rv-btn--${variant}`, className);
}

type Common = { variant?: ButtonVariant; arrow?: boolean; children?: React.ReactNode };

const Inner = ({ children, arrow }: { children?: React.ReactNode; arrow?: boolean }) => (
  <>
    {children}
    {arrow ? (
      <span className="rv-arrow" aria-hidden="true">
        →
      </span>
    ) : null}
  </>
);

export interface ButtonProps extends Common, React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", arrow, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
});

export interface ButtonLinkProps extends Common, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/** Same look as <Button>, rendered as an <a> for navigation/CTAs. */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant = "primary", arrow, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={buttonClass(variant, className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  );
});
