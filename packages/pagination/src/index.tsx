import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

/** Page numbers to show, with "ellipsis" gaps, windowed around the current page. */
function pageList(page: number, pageCount: number, sibling: number): Array<number | "ellipsis"> {
  const total = Math.max(1, pageCount);
  if (total <= 1) return [1];
  const out: Array<number | "ellipsis"> = [1];
  const left = Math.max(2, page - sibling);
  const right = Math.min(total - 1, page + sibling);
  if (left > 2) out.push("ellipsis");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < total - 1) out.push("ellipsis");
  out.push(total);
  return out;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  /** Pages shown either side of the current page before truncating with "…". */
  siblingCount?: number;
  className?: string;
}

/** Numbered pager with prev/next + ellipsis windowing for large page counts. */
export function Pagination({ page, pageCount, onChange, siblingCount = 1, className }: PaginationProps) {
  const items = pageList(page, pageCount, siblingCount);
  return (
    <nav className={cx("rv-pagination", className)} aria-label="Pagination">
      <button type="button" className="rv-page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        ‹
      </button>
      {items.map((it, i) =>
        it === "ellipsis" ? (
          <span key={`e${i}`} className="rv-page-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            className={cx("rv-page-btn", it === page && "is-active")}
            aria-current={it === page ? "page" : undefined}
            onClick={() => onChange(it)}
          >
            {it}
          </button>
        ),
      )}
      <button type="button" className="rv-page-btn" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
        ›
      </button>
    </nav>
  );
}

export interface PaginationNavProps {
  page: number;
  pageCount: number;
  /** If given, renders real <a> links (for SSG URL routes like /article/page/2). */
  hrefFor?: (page: number) => string;
  /** Used when hrefFor is absent (client-side). */
  onChange?: (page: number) => void;
  newerLabel?: string;
  olderLabel?: string;
  className?: string;
}

/**
 * Compact "Newer ‹ · Page X of Y · › Older" pager. Page 1 = newest; Older = higher
 * page numbers (the /article diary convention). Renders links when `hrefFor` is set.
 */
export function PaginationNav({
  page,
  pageCount,
  hrefFor,
  onChange,
  newerLabel = "Newer",
  olderLabel = "Older",
  className,
}: PaginationNavProps) {
  const Item = ({ to, enabled, rel, children }: { to: number; enabled: boolean; rel: string; children: React.ReactNode }) => {
    if (!enabled)
      return (
        <span className="rv-pnav-btn is-disabled" aria-disabled="true">
          {children}
        </span>
      );
    if (hrefFor)
      return (
        <a className="rv-pnav-btn" href={hrefFor(to)} rel={rel}>
          {children}
        </a>
      );
    return (
      <button type="button" className="rv-pnav-btn" onClick={() => onChange?.(to)}>
        {children}
      </button>
    );
  };
  return (
    <nav className={cx("rv-pnav", className)} aria-label="Pagination">
      <Item to={page - 1} enabled={page > 1} rel="prev">
        ‹ {newerLabel}
      </Item>
      <span className="rv-pnav-status">
        Page {page} of {pageCount}
      </span>
      <Item to={page + 1} enabled={page < pageCount} rel="next">
        {olderLabel} ›
      </Item>
    </nav>
  );
}

export interface LoadMoreProps {
  loaded: number;
  total: number;
  onLoad: () => void;
  label?: string;
  className?: string;
}

/** "Showing N of M" + a Load more button (infinite-list style). */
export function LoadMore({ loaded, total, onLoad, label = "Load more", className }: LoadMoreProps) {
  const done = loaded >= total;
  return (
    <div className={cx("rv-loadmore", className)}>
      <span className="rv-loadmore-count">
        Showing {Math.min(loaded, total)} of {total}
      </span>
      <button type="button" className="rv-loadmore-btn" onClick={onLoad} disabled={done}>
        {done ? "All loaded" : label}
      </button>
    </div>
  );
}

export interface PaginationDotsProps {
  count: number;
  active: number;
  onChange: (i: number) => void;
  className?: string;
}

/** Dot pagination (carousel / onboarding style). */
export function PaginationDots({ count, active, onChange, className }: PaginationDotsProps) {
  return (
    <div className={cx("rv-pdots", className)} role="tablist" aria-label="Pages">
      {Array.from({ length: Math.max(0, count) }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`Page ${i + 1}`}
          className={cx("rv-pdot", i === active && "is-active")}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}
