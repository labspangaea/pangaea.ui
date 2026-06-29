import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultId?: string;
  className?: string;
}

/** Accessible tablist + panels (uncontrolled). */
export function Tabs({ items, defaultId, className }: TabsProps) {
  const first = defaultId ?? items[0]?.id ?? "";
  const [active, setActive] = React.useState(first);
  return (
    <div className={cx("rv-tabs", className)}>
      <div className="rv-tablist" role="tablist">
        {items.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            className={cx("rv-tab", active === t.id && "is-active")}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="rv-tabpanel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
