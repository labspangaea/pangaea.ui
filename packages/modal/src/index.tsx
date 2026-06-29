import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Footer actions (buttons). */
  footer?: React.ReactNode;
  className?: string;
}

/** Native <dialog> modal — escapes any stacking context, gets ::backdrop + Esc for free. */
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("rv-modal", className)}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="rv-modal-card">
        {title ? (
          <div className="rv-modal-head">
            <h3>{title}</h3>
            <button className="rv-modal-x" onClick={onClose} type="button" aria-label="Close">
              ×
            </button>
          </div>
        ) : null}
        <div className="rv-modal-body">{children}</div>
        {footer ? <div className="rv-modal-foot">{footer}</div> : null}
      </div>
    </dialog>
  );
}
