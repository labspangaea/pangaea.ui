import React from "react";
import { Switch, LangToggle, ThemeToggle, type Lang } from "@pangaea/ds-toggle";
import { CodeBlock } from "@pangaea/ds-code";
import { STORIES, GROUPS, type Story, type Control } from "./stories";

const TAG: Record<string, string> = {
  button: "Button", badge: "Badge", callout: "Callout", quote: "Quote", field: "Input",
  toggle: "Switch", pagination: "Pagination", accordion: "Accordion", code: "CodeBlock",
  tooltip: "Tooltip", modal: "Modal", progress: "Progress", avatar: "Avatar",
  filedropzone: "FileDropzone", navbar: "Navbar", tabs: "Tabs", hero: "Hero",
  testimonial: "TestimonialCarousel", cta: "CtaBand", card: "Card", layout: "Grid",
  chart: "Chart", typography: "H1", tokens: "/* tokens.css */",
  social: "SocialIcons", pricing: "PricingTier", stepper: "Stepper", teamcard: "TeamCard",
  logowall: "LogoWall", plugincard: "PluginCard",
  stat: "Stat", pillar: "Pillar", points: "Points", dodont: "DoDont", compare: "Compare",
  checklist: "Checklist", references: "References", table: "Table", archflow: "ArchFlow",
};

function usageOf(story: Story, args: Record<string, unknown>): string {
  if (story.id === "tokens") return 'import "@pangaea/ds-tokens/tokens.css";';
  const tag = TAG[story.id] ?? story.name.replace(/\s+/g, "");
  const props = Object.entries(args)
    .map(([k, v]) => {
      if (typeof v === "boolean") return v ? k : null;
      if (typeof v === "number") return `${k}={${v}}`;
      if (v === "" || v === "none") return null;
      if (v && typeof v === "object") return `${k}={${JSON.stringify(v)}}`;
      return `${k}="${v}"`;
    })
    .filter(Boolean) as string[];
  const open = props.length > 2 ? `<${tag}\n  ${props.join("\n  ")}\n/>` : `<${tag}${props.length ? " " + props.join(" ") : ""} />`;
  return open;
}

function ControlInput({ id, ctrl, value, onChange }: { id: string; ctrl: Control; value: unknown; onChange: (v: unknown) => void }) {
  if (ctrl.kind === "bool") return <Switch id={id} checked={Boolean(value)} onChange={onChange} />;
  if (ctrl.kind === "select")
    return (
      <select id={id} className="sb-input" value={String(value)} onChange={(e) => onChange(e.target.value)}>
        {ctrl.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  if (ctrl.kind === "number")
    return (
      <input
        id={id}
        type="number"
        className="sb-input"
        value={Number(value)}
        min={ctrl.min}
        max={ctrl.max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  if (ctrl.kind === "json") return <JsonControl id={id} value={value} onChange={onChange} />;
  if (ctrl.kind === "textarea")
    return <textarea id={id} className="sb-input sb-textarea" rows={6} value={String(value)} onChange={(e) => onChange(e.target.value)} />;
  return <input id={id} className="sb-input" value={String(value)} onChange={(e) => onChange(e.target.value)} />;
}

/** Storybook-style `object` control: a JSON editor. Parses on every keystroke;
    keeps the last valid value when the text is mid-edit / invalid. */
function JsonControl({ id, value, onChange }: { id: string; value: unknown; onChange: (v: unknown) => void }) {
  const [txt, setTxt] = React.useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = React.useState(false);
  return (
    <>
      <textarea
        id={id}
        className={"sb-input sb-textarea" + (err ? " sb-input--err" : "")}
        rows={8}
        spellCheck={false}
        aria-invalid={err}
        aria-describedby={err ? id + "-err" : undefined}
        value={txt}
        onChange={(e) => {
          const t = e.target.value;
          setTxt(t);
          try {
            onChange(JSON.parse(t));
            setErr(false);
          } catch {
            setErr(true);
          }
        }}
      />
      {err ? <span id={id + "-err"} className="sb-err" role="alert">Invalid JSON — keeping last valid value</span> : null}
    </>
  );
}

function defaultsFor(story: Story): Record<string, unknown> {
  const init: Record<string, unknown> = {};
  if (story.controls) for (const [k, c] of Object.entries(story.controls)) init[k] = c.def;
  return init;
}

/** id + its default args, always consistent (avoids a render where args lag the story). */
function storyState(id: string): { id: string; args: Record<string, unknown> } {
  const s = STORIES.find((st) => st.id === id) ?? STORIES[0]!;
  return { id: s.id, args: defaultsFor(s) };
}

export function Gallery() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [lang, setLang] = React.useState<Lang>("en");
  const [st, setSt] = React.useState(() => storyState(STORIES[0]!.id));

  // deep-link via hash (+ initial theme); also respond to back/forward + manual hash edits
  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-rv-theme") === "dark" ? "dark" : "light");
    const apply = () => {
      const h = location.hash.slice(1);
      if (h && STORIES.some((s) => s.id === h)) setSt(storyState(h));
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const select = (id: string) => {
    setSt(storyState(id));
    history.replaceState(null, "", `#${id}`);
  };

  const story = STORIES.find((s) => s.id === st.id)!;
  const args = st.args;
  const set = (k: string, v: unknown) => setSt((p) => ({ ...p, args: { ...p.args, [k]: v } }));

  return (
    <div className="rv-page">
      <a className="sb-skip" href="#sb-controls">Skip to controls</a>
      <div className="sb">
        {/* —— left: component menu —— */}
        <nav className="sb-menu" aria-label="Components">
          <h1 className="sb-brand">
            Pangaea<b>UI</b>
          </h1>
          {GROUPS.map((g) => (
            <div key={g} className="sb-group" role="group" aria-label={g}>
              <div className="sb-group-head">{g}</div>
              {STORIES.filter((s) => s.group === g).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={"sb-item" + (s.id === story.id ? " is-active" : "")}
                  aria-current={s.id === story.id ? "true" : undefined}
                  onClick={() => select(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* —— center: canvas —— */}
        <main className="sb-center">
          <div className="sb-toolbar">
            <h2 className="sb-toolbar-title">{story.name}</h2>
            <div className="sb-toolbar-actions">
              <LangToggle value={lang} onChange={setLang} />
              <ThemeToggle onChange={setTheme} />
            </div>
          </div>
          <div className="sb-canvas">
            <div className="sb-stage">{story.render(args, { theme, lang })}</div>
          </div>
        </main>

        {/* —— right: controls + usage + info —— */}
        <aside className="sb-panel" aria-label="Controls and usage">
          <div className="sb-panel-sec" id="sb-controls">
            <h3 className="sb-panel-head">Controls</h3>
            {story.controls ? (
              <div className="sb-controls">
                {Object.entries(story.controls).map(([k, c]) => {
                  const cid = "ctl-" + story.id + "-" + k;
                  return (
                    <div className="sb-control" key={story.id + ":" + k}>
                      <label className="sb-control-label" htmlFor={cid}>{c.label}</label>
                      <ControlInput id={cid} ctrl={c} value={args[k]} onChange={(v) => set(k, v)} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="sb-muted">No props — display only.</p>
            )}
          </div>

          <div className="sb-panel-sec">
            <h3 className="sb-panel-head">Usage</h3>
            <CodeBlock lang="tsx" code={usageOf(story, args)} />
          </div>

          <div className="sb-panel-sec">
            <h3 className="sb-panel-head">Info</h3>
            <p className="sb-muted">
              <code className="sb-pkg">{story.pkg}</code>
            </p>
            {story.notes ? <p className="sb-muted">{story.notes}</p> : null}
            <p className="sb-muted">Token-driven · dark-aware · renders inside <code>.rv-page</code>.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
