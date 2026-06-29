import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface NavLink {
  label: React.ReactNode;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  brand?: React.ReactNode;
  links?: NavLink[];
  /** Right-aligned slot — CTA button, theme toggle, lang toggle, etc. */
  actions?: React.ReactNode;
  className?: string;
}

/** Sticky top site nav with a mobile sheet (hamburger ≤1100px). The hairline +
 *  shadow fade in once the page is scrolled (the `scrolled` class). */
export function Navbar({ brand, links = [], actions, className }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={cx("rv-nav", scrolled && "scrolled", open && "open", className)}>
      <div className="rv-nav-inner">
        <span className="rv-brand">{brand}</span>
        <button
          type="button"
          className="rv-nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={cx("rv-nav-links", open && "open")}>
          {links.map((l, i) => (
            <a key={i} href={l.href} className={cx("rv-nav-item", l.active && "active")}>
              {l.label}
            </a>
          ))}
          {actions ? <span className="rv-nav-actions">{actions}</span> : null}
        </div>
      </div>
    </nav>
  );
}
