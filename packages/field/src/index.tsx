import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface FieldProps {
  label?: React.ReactNode;
  optional?: boolean;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

/** Label + control + optional hint/error, vertically stacked. */
export function Field({ label, optional, error, hint, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cx("rv-field", className)}>
      {label ? (
        <label htmlFor={htmlFor}>
          {label}
          {optional ? <span className="rv-field-opt"> (optional)</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <span className="rv-field-hint">{hint}</span> : null}
      {error ? (
        <span className="rv-field-err" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** <input> — supports every type (text, email, password, number, date, search, …). */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = "text", ...p }, ref) {
    return <input ref={ref} type={type} className={cx("rv-input", className)} {...p} />;
  },
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...p }, ref) {
    return <textarea ref={ref} rows={rows} className={cx("rv-input rv-textarea", className)} {...p} />;
  },
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...p }, ref) {
    return (
      <select ref={ref} className={cx("rv-input rv-select", className)} {...p}>
        {children}
      </select>
    );
  },
);

export interface CheckProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckProps>(function Checkbox(
  { label, className, ...p },
  ref,
) {
  return (
    <label className={cx("rv-check", className)}>
      <input ref={ref} type="checkbox" {...p} />
      {label ? <span>{label}</span> : null}
    </label>
  );
});

export const Radio = React.forwardRef<HTMLInputElement, CheckProps>(function Radio(
  { label, className, ...p },
  ref,
) {
  return (
    <label className={cx("rv-check", className)}>
      <input ref={ref} type="radio" {...p} />
      {label ? <span>{label}</span> : null}
    </label>
  );
});
