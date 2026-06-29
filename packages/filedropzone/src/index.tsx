import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface FileDropzoneProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  hint?: React.ReactNode;
  className?: string;
}

/** Drag-and-drop upload area (also click-to-browse, keyboard-activatable). */
export function FileDropzone({ onFiles, accept, multiple, hint, className }: FileDropzoneProps) {
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const emit = (files: FileList | null) => {
    if (files && files.length && onFiles) onFiles(Array.from(files));
  };
  return (
    <div
      className={cx("rv-dropzone", over && "is-over", className)}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        emit(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => emit(e.target.files)}
      />
      <span className="rv-dropzone-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
        </svg>
      </span>
      <span className="rv-dropzone-text">
        Drop files here or <span className="rv-dropzone-link">browse</span>
      </span>
      {hint ? <span className="rv-dropzone-hint">{hint}</span> : null}
    </div>
  );
}
