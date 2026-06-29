import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/** Accessible on/off switch (a styled `role="switch"` checkbox). */
export function Switch({ checked, onChange, label, id, disabled, className }: SwitchProps) {
  return (
    <label className={cx("rv-switch", disabled && "is-disabled", className)}>
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="rv-switch-track">
        <span className="rv-switch-thumb" />
      </span>
      {label ? <span className="rv-switch-label">{label}</span> : null}
    </label>
  );
}

export type Lang = "en" | "id";

/** EN | ID segmented language toggle. */
export function LangToggle({
  value,
  onChange,
  className,
}: {
  value: Lang;
  onChange: (l: Lang) => void;
  className?: string;
}) {
  return (
    <div className={cx("rv-seg", className)} role="group" aria-label="Language">
      {(["en", "id"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          className={cx("rv-seg-opt", value === l && "is-active")}
          aria-pressed={value === l}
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const Sun = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

/**
 * Light/dark theme toggle. Self-managed: flips `data-rv-theme` on <html> and
 * persists to localStorage('pg_theme') (mirrors pangaea.id). Optional onChange.
 */
export function ThemeToggle({
  onChange,
  className,
}: {
  onChange?: (theme: "light" | "dark") => void;
  className?: string;
}) {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    setDark(document.documentElement.getAttribute("data-rv-theme") === "dark");
  }, []);
  const toggle = () =>
    setDark((d) => {
      const next = !d;
      const el = document.documentElement;
      if (next) el.setAttribute("data-rv-theme", "dark");
      else el.removeAttribute("data-rv-theme");
      try {
        localStorage.setItem("pg_theme", next ? "dark" : "light");
      } catch {
        /* ignore */
      }
      onChange?.(next ? "dark" : "light");
      return next;
    });
  return (
    <button
      type="button"
      className={cx("rv-themetoggle", className)}
      onClick={toggle}
      aria-label="Toggle color theme"
      aria-pressed={dark}
    >
      {dark ? Sun : Moon}
    </button>
  );
}
