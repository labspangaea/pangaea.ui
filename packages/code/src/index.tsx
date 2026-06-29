import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface CodeBlockProps {
  code: string;
  lang?: string;
  /** Pre-highlighted HTML (e.g. from rehype-highlight, .hljs-* spans). Overrides `code`. */
  html?: string;
  className?: string;
}

/**
 * Styled code panel + copy button. Pass plain `code`, or pass `html` already
 * highlighted into `.hljs-*` spans (build-time highlighting) — the brand theme
 * is shipped in the package CSS.
 */
export function CodeBlock({ code, lang, html, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <div className={cx("rv-code", className)}>
      <div className="rv-code-bar">
        <span className="rv-code-lang">{lang ?? "code"}</span>
        <button
          className="rv-code-copy"
          onClick={copy}
          type="button"
          aria-label="Copy code"
          aria-live="polite"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        {html ? (
          <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}
