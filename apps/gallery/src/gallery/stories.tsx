import React from "react";
import { Button } from "@labspangaea/ds-button";
import { Card } from "@labspangaea/ds-card";
import { Grid, heroAccent } from "@labspangaea/ds-section";
import { Chart } from "@labspangaea/ds-chart";
import { Navbar } from "@labspangaea/ds-navbar";
import { Badge } from "@labspangaea/ds-badge";
import { Callout } from "@labspangaea/ds-callout";
import { Quote } from "@labspangaea/ds-quote";
import { Field, Input, Textarea, Select, Checkbox, Radio } from "@labspangaea/ds-field";
import { Switch, LangToggle, ThemeToggle, type Lang } from "@labspangaea/ds-toggle";
import { Tabs } from "@labspangaea/ds-tabs";
import { Pagination, PaginationNav, LoadMore, PaginationDots } from "@labspangaea/ds-pagination";
import { Accordion, AccordionItem } from "@labspangaea/ds-accordion";
import { CodeBlock } from "@labspangaea/ds-code";
import { Tooltip } from "@labspangaea/ds-tooltip";
import { Modal } from "@labspangaea/ds-modal";
import { Progress } from "@labspangaea/ds-progress";
import { Avatar } from "@labspangaea/ds-avatar";
import { FileDropzone } from "@labspangaea/ds-filedropzone";
import { Hero } from "@labspangaea/ds-hero";
import { TestimonialCarousel } from "@labspangaea/ds-testimonial";
import { CtaBand } from "@labspangaea/ds-cta";
import { SocialIcons } from "@labspangaea/ds-social";
import { PricingTier } from "@labspangaea/ds-pricing";
import { Stepper } from "@labspangaea/ds-stepper";
import { TeamCard } from "@labspangaea/ds-teamcard";
import { LogoWall } from "@labspangaea/ds-logowall";
import { PluginCard } from "@labspangaea/ds-plugincard";
import { Stat, StatGrid } from "@labspangaea/ds-stat";
import { Pillar, PillarGrid } from "@labspangaea/ds-pillar";
import { Points, Point } from "@labspangaea/ds-points";
import { DoDont, Do, Dont } from "@labspangaea/ds-dodont";
import { Compare, Col } from "@labspangaea/ds-compare";
import { Checklist } from "@labspangaea/ds-checklist";
import { References, Ref, Cite } from "@labspangaea/ds-references";
import { Table } from "@labspangaea/ds-table";
import { ArchFlow } from "@labspangaea/ds-archflow";

export type Control =
  | { kind: "text"; label: string; def: string }
  | { kind: "textarea"; label: string; def: string }
  | { kind: "json"; label: string; def: unknown }
  | { kind: "select"; label: string; options: string[]; def: string }
  | { kind: "bool"; label: string; def: boolean }
  | { kind: "number"; label: string; def: number; min?: number; max?: number };

export interface Story {
  id: string;
  name: string;
  group: string;
  pkg: string;
  notes?: string;
  controls?: Record<string, Control>;
  render: (a: any, ctx: { theme: string; lang: "en" | "id" }) => React.ReactNode;
}

/* —— stateful / derived demo wrappers —— */

function ToggleDemo({ type, label, disabled }: { type: string; label: string; disabled: boolean }) {
  const [on, setOn] = React.useState(true);
  const [lang, setLang] = React.useState<Lang>("en");
  if (type === "lang") return <LangToggle value={lang} onChange={setLang} />;
  if (type === "theme") return <ThemeToggle />;
  return <Switch checked={on} onChange={setOn} label={label || (on ? "On" : "Off")} disabled={disabled} />;
}

function PaginationDemo({ type, pageCount, urls, newerLabel, olderLabel, siblingCount, total, loadMoreLabel, dotCount }: any) {
  const [page, setPage] = React.useState(Math.min(4, pageCount));
  const [loaded, setLoaded] = React.useState(20);
  const [dot, setDot] = React.useState(1);
  const dots = Math.max(1, dotCount);
  if (type === "newer-older")
    return (
      <PaginationNav
        page={page}
        pageCount={pageCount}
        newerLabel={newerLabel}
        olderLabel={olderLabel}
        onChange={urls ? undefined : setPage}
        hrefFor={urls ? (p) => `/article/page/${p}` : undefined}
      />
    );
  if (type === "load-more")
    return <LoadMore loaded={loaded} total={total} label={loadMoreLabel} onLoad={() => setLoaded((l) => Math.min(total, l + 20))} />;
  if (type === "dots") return <PaginationDots count={dots} active={Math.min(dot, dots - 1)} onChange={setDot} />;
  return <Pagination page={page} pageCount={pageCount} onChange={setPage} siblingCount={siblingCount} />;
}

function ModalDemo({ title, body, footer }: { title: string; body: string; footer: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        footer={
          footer ? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          ) : undefined
        }
      >
        <p>{body}</p>
      </Modal>
    </>
  );
}

function StepperDemo({ steps, orientation, active }: { steps: Array<{ label: string; description?: string }>; orientation: any; active: number }) {
  const withStatus = steps.map((s, i) => ({
    ...s,
    status: (i + 1 < active ? "done" : i + 1 === active ? "active" : "upcoming") as "done" | "active" | "upcoming",
  }));
  return (
    <div style={{ width: "100%", maxWidth: orientation === "vertical" ? 360 : 720 }}>
      <Stepper steps={withStatus} orientation={orientation} />
    </div>
  );
}

const SWATCHES: Array<[string, string]> = [
  ["--rv-brand", "navy / brand"],
  ["--rv-accent", "electric blue"],
  ["--rv-accent-ink", "accent ink · AA"],
  ["--rv-ink", "ink"],
  ["--rv-ink-2", "ink-2 · body"],
  ["--rv-ink-3", "ink-3 · muted"],
  ["--rv-bg-alt", "bg alt"],
  ["--rv-accent-soft", "accent soft"],
];

const DOUGHNUT_COLORS = ["#203150", "#3fa9f5", "#1568b4", "#7cc4fa", "#46566f", "#5f6e88"];
const chartData = (type: string, values: number[], labels: string[]) => {
  const v = values.length ? values : [4, 7, 5, 9, 6];
  const fallback = type === "doughnut" ? "Seg" : type === "line" ? "W" : "#";
  const lbls = v.map((_, i) => labels[i] ?? `${fallback}${i + 1}`);
  if (type === "doughnut")
    return { labels: lbls, datasets: [{ data: v, backgroundColor: DOUGHNUT_COLORS.slice(0, v.length) }] };
  if (type === "line")
    return { labels: lbls, datasets: [{ label: "series", data: v, borderColor: "#1568b4", backgroundColor: "rgba(63,169,245,0.15)", fill: true, tension: 0.35 }] };
  return { labels: lbls, datasets: [{ label: "series", data: v, backgroundColor: "#3fa9f5", borderRadius: 6 }] };
};

const cardTitle: React.CSSProperties = { fontFamily: "var(--rv-display)", color: "var(--rv-ink)", margin: "0 0 6px", fontSize: "1.1rem" };

export const STORIES: Story[] = [
  // ───────── Foundations ─────────
  {
    id: "tokens",
    name: "Tokens",
    group: "Foundations",
    pkg: "@labspangaea/ds-tokens",
    notes: "Two brand hex only; everything else is a tint/luminance/alpha. Dual-theme. Display only.",
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, width: "100%", maxWidth: 720 }}>
        {SWATCHES.map(([t, label]) => (
          <div key={t} style={{ border: "1px solid var(--rv-line)", borderRadius: "var(--rv-r-sm)", overflow: "hidden", background: "var(--rv-bg)" }}>
            <div style={{ height: 56, background: `var(${t})` }} />
            <div style={{ padding: "8px 10px", fontFamily: "var(--rv-mono)", fontSize: "0.66rem", color: "var(--rv-ink-3)" }}>
              {t}
              <br />
              {label}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "typography",
    name: "Typography",
    group: "Foundations",
    pkg: "@labspangaea/ds-section · ds-tokens",
    controls: {
      sample: { kind: "text", label: "display sample", def: "Engineered, not shouted" },
      headline: { kind: "text", label: "section headline", def: "Section headline" },
      body: { kind: "text", label: "body", def: "Geist body — the calm adult in a hype-drunk category." },
      kicker: { kind: "text", label: "kicker", def: "Geist Mono · kicker" },
    },
    render: (a) => (
      <div style={{ display: "grid", gap: 14, width: "100%", maxWidth: 720 }}>
        <div style={{ fontFamily: "var(--rv-display)", fontWeight: 600, fontSize: "2.6rem", letterSpacing: "-0.02em", color: "var(--rv-ink)" }}>{a.sample}</div>
        <div style={{ fontFamily: "var(--rv-display)", fontWeight: 600, fontSize: "1.9rem", letterSpacing: "-0.015em", color: "var(--rv-ink)" }}>{a.headline}</div>
        <p style={{ fontFamily: "var(--rv-body)", color: "var(--rv-ink-2)", maxWidth: "65ch" }}>{a.body}</p>
        <div style={{ fontFamily: "var(--rv-mono)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--rv-accent-ink)", fontSize: "0.74rem" }}>{a.kicker}</div>
        <div style={{ display: "grid", gap: 4, marginTop: 8 }}>
          {([[300, "Light"], [400, "Normal"], [500, "Medium"], [600, "Semibold"]] as Array<[number, string]>).map(([w, n]) => (
            <div key={w} style={{ fontWeight: w, fontFamily: "var(--rv-body)", color: "var(--rv-ink)", fontSize: "1.3rem" }}>
              {n} {w} — No AI ships on vibes.
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ───────── Actions ─────────
  {
    id: "button",
    name: "Button",
    group: "Actions",
    pkg: "@labspangaea/ds-button",
    controls: {
      variant: { kind: "select", label: "variant", options: ["primary", "ghost", "blue"], def: "primary" },
      label: { kind: "text", label: "label", def: "Book an audit" },
      arrow: { kind: "bool", label: "arrow", def: true },
      type: { kind: "select", label: "type", options: ["button", "submit", "reset"], def: "button" },
      disabled: { kind: "bool", label: "disabled", def: false },
    },
    render: (a) => (
      <Button variant={a.variant} arrow={a.arrow} type={a.type} disabled={a.disabled}>
        {a.label}
      </Button>
    ),
  },
  {
    id: "toggle",
    name: "Toggle",
    group: "Actions",
    pkg: "@labspangaea/ds-toggle",
    notes: "Pick a type: switch · lang (EN/ID) · theme (light/dark). label/disabled apply to the switch.",
    controls: {
      type: { kind: "select", label: "type", options: ["switch", "lang", "theme"], def: "switch" },
      label: { kind: "text", label: "switch label", def: "" },
      disabled: { kind: "bool", label: "switch disabled", def: false },
    },
    render: (a) => <ToggleDemo type={a.type} label={a.label} disabled={a.disabled} />,
  },
  {
    id: "pagination",
    name: "Pagination",
    group: "Actions",
    pkg: "@labspangaea/ds-pagination",
    notes: "Pick a type: numbered (windowed) · Newer/Older URL pager · Load more · Dots.",
    controls: {
      type: { kind: "select", label: "type", options: ["numbered", "newer-older", "load-more", "dots"], def: "numbered" },
      pageCount: { kind: "number", label: "pageCount", def: 12, min: 2, max: 40 },
      siblingCount: { kind: "number", label: "siblingCount", def: 1, min: 0, max: 3 },
      urls: { kind: "bool", label: "url links (hrefFor)", def: false },
      newerLabel: { kind: "text", label: "newerLabel", def: "Newer" },
      olderLabel: { kind: "text", label: "olderLabel", def: "Older" },
      total: { kind: "number", label: "total (LoadMore)", def: 142, min: 1, max: 500 },
      loadMoreLabel: { kind: "text", label: "loadMoreLabel", def: "Load more" },
      dotCount: { kind: "number", label: "dotCount (Dots)", def: 5, min: 1, max: 10 },
    },
    render: (a) => (
      <PaginationDemo
        type={a.type}
        pageCount={a.pageCount}
        siblingCount={a.siblingCount}
        urls={a.urls}
        newerLabel={a.newerLabel}
        olderLabel={a.olderLabel}
        total={a.total}
        loadMoreLabel={a.loadMoreLabel}
        dotCount={a.dotCount}
      />
    ),
  },

  // ───────── Inputs ─────────
  {
    id: "field",
    name: "Form field",
    group: "Inputs",
    pkg: "@labspangaea/ds-field",
    controls: {
      type: { kind: "select", label: "type", options: ["text", "email", "password", "number", "search", "tel", "url", "date"], def: "email" },
      label: { kind: "text", label: "label", def: "Email" },
      placeholder: { kind: "text", label: "placeholder", def: "you@company.com" },
      optional: { kind: "bool", label: "optional", def: false },
      required: { kind: "bool", label: "required", def: false },
      disabled: { kind: "bool", label: "disabled", def: false },
      readOnly: { kind: "bool", label: "readOnly", def: false },
      hint: { kind: "text", label: "hint", def: "" },
      error: { kind: "text", label: "error", def: "" },
    },
    render: (a) => (
      <div style={{ display: "grid", gap: 14, width: "100%", maxWidth: 420 }}>
        <Field label={a.label} htmlFor="sb-f" optional={a.optional} hint={a.hint || undefined} error={a.error || undefined}>
          <Input
            id="sb-f"
            type={a.type}
            placeholder={a.placeholder}
            required={a.required}
            disabled={a.disabled}
            readOnly={a.readOnly}
            aria-invalid={a.error ? "true" : undefined}
          />
        </Field>
        <Field label="Message" htmlFor="sb-t">
          <Textarea id="sb-t" placeholder="What are you building?" disabled={a.disabled} readOnly={a.readOnly} />
        </Field>
        <Field label="Engagement" htmlFor="sb-s">
          <Select id="sb-s" defaultValue="adopt" disabled={a.disabled}>
            <option value="adopt">Adopt</option>
            <option value="amplify">Amplify</option>
            <option value="autonomize">Autonomize</option>
          </Select>
        </Field>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Checkbox label="Self-hosted" defaultChecked disabled={a.disabled} />
          <Radio name="sb-r" label="EN" defaultChecked disabled={a.disabled} />
          <Radio name="sb-r" label="ID" disabled={a.disabled} />
        </div>
      </div>
    ),
  },
  {
    id: "filedropzone",
    name: "File dropzone",
    group: "Inputs",
    pkg: "@labspangaea/ds-filedropzone",
    controls: {
      hint: { kind: "text", label: "hint", def: "PNG, SVG, PDF — up to 10MB" },
      accept: { kind: "text", label: "accept", def: "image/*,.pdf" },
      multiple: { kind: "bool", label: "multiple", def: true },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 440 }}>
        <FileDropzone hint={a.hint} accept={a.accept} multiple={a.multiple} />
      </div>
    ),
  },

  // ───────── Data display ─────────
  {
    id: "badge",
    name: "Badge",
    group: "Data display",
    pkg: "@labspangaea/ds-badge",
    controls: {
      variant: { kind: "select", label: "variant", options: ["accent", "solid", "soon", "red", "free", "claude"], def: "accent" },
      label: { kind: "text", label: "label", def: "Eval-gated" },
    },
    render: (a) => <Badge variant={a.variant}>{a.label}</Badge>,
  },
  {
    id: "avatar",
    name: "Avatar",
    group: "Data display",
    pkg: "@labspangaea/ds-avatar",
    controls: {
      name: { kind: "text", label: "name", def: "Harry Osmar" },
      size: { kind: "select", label: "size", options: ["sm", "md", "lg"], def: "md" },
      status: { kind: "select", label: "status", options: ["none", "online", "offline"], def: "online" },
      src: { kind: "text", label: "src (url)", def: "" },
    },
    render: (a) => <Avatar name={a.name} size={a.size} src={a.src || undefined} status={a.status === "none" ? undefined : a.status} />,
  },
  {
    id: "card",
    name: "Card",
    group: "Data display",
    pkg: "@labspangaea/ds-card",
    controls: {
      featured: { kind: "bool", label: "featured", def: false },
      title: { kind: "text", label: "title", def: "Eval-gated" },
      body: { kind: "text", label: "body", def: "Nothing ships on vibes — every release is eval-gated." },
    },
    render: (a) => (
      <div style={{ maxWidth: 340 }}>
        <Card featured={a.featured}>
          <h3 style={cardTitle}>{a.title}</h3>
          <p>{a.body}</p>
        </Card>
      </div>
    ),
  },
  {
    id: "progress",
    name: "Progress",
    group: "Data display",
    pkg: "@labspangaea/ds-progress",
    controls: {
      value: { kind: "number", label: "value", def: 64, min: 0, max: 100 },
      max: { kind: "number", label: "max", def: 100, min: 1, max: 200 },
      indeterminate: { kind: "bool", label: "indeterminate", def: false },
      label: { kind: "text", label: "label", def: "Building" },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Progress value={a.value} max={a.max} indeterminate={a.indeterminate} label={a.label} />
      </div>
    ),
  },
  {
    id: "social",
    name: "Social icons",
    group: "Data display",
    pkg: "@labspangaea/ds-social",
    notes: "links: JSON array of { platform, href } — the real pangaea.id footer URLs by default. Platforms: github / linkedin / youtube / instagram / tiktok.",
    controls: {
      size: { kind: "select", label: "size", options: ["sm", "md", "lg"], def: "md" },
      links: {
        kind: "json",
        label: "links",
        def: [
          { platform: "linkedin", href: "https://www.linkedin.com/company/pangaealabs" },
          { platform: "instagram", href: "https://www.instagram.com/pangaeadigitallabs" },
          { platform: "youtube", href: "https://www.youtube.com/@labspangaealabs" },
          { platform: "tiktok", href: "https://www.tiktok.com/@labspangaea.labs" },
        ],
      },
    },
    render: (a) => <SocialIcons size={a.size} links={Array.isArray(a.links) ? a.links : []} />,
  },
  {
    id: "plugincard",
    name: "Plugin card",
    group: "Data display",
    pkg: "@labspangaea/ds-plugincard",
    controls: {
      name: { kind: "text", label: "name", def: "Slack" },
      description: { kind: "text", label: "description", def: "Pipe eval alerts + lead notifications into a channel." },
      icon: { kind: "bool", label: "icon", def: false },
      badge: { kind: "text", label: "badge", def: "Official" },
      href: { kind: "bool", label: "href (renders <a>)", def: false },
    },
    render: (a) => (
      <div style={{ maxWidth: 340 }}>
        <PluginCard
          name={a.name}
          description={a.description}
          badge={a.badge || undefined}
          icon={
            a.icon ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            ) : undefined
          }
          href={a.href ? "#" : undefined}
        />
      </div>
    ),
  },
  {
    id: "quote",
    name: "Quote",
    group: "Data display",
    pkg: "@labspangaea/ds-quote",
    controls: {
      pull: { kind: "bool", label: "pull", def: true },
      text: { kind: "text", label: "text", def: "Finally, people who treat this like engineering." },
      cite: { kind: "text", label: "cite", def: "Head of Engineering, fintech" },
    },
    render: (a) => (
      <div style={{ maxWidth: 560 }}>
        <Quote pull={a.pull} cite={a.cite || undefined}>
          {a.text}
        </Quote>
      </div>
    ),
  },
  {
    id: "code",
    name: "Code block",
    group: "Data display",
    pkg: "@labspangaea/ds-code",
    controls: {
      lang: { kind: "text", label: "lang", def: "bash" },
      code: { kind: "text", label: "code", def: "npm run build:pkgs" },
      html: { kind: "bool", label: "html (pre-highlighted)", def: false },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 560 }}>
        <CodeBlock
          lang={a.lang}
          code={a.code}
          html={a.html ? '<span class="hljs-keyword">const</span> <span class="hljs-variable">build</span> = <span class="hljs-string">"eval-gated"</span>;' : undefined}
        />
      </div>
    ),
  },
  {
    id: "chart",
    name: "Chart",
    group: "Data display",
    pkg: "@labspangaea/ds-chart",
    notes: "data is a Chart.js dataset; labels + values are JSON arrays.",
    controls: {
      type: { kind: "select", label: "type", options: ["bar", "line", "doughnut"], def: "bar" },
      labels: { kind: "json", label: "labels", def: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      values: { kind: "json", label: "values", def: [4, 7, 5, 9, 6] },
      height: { kind: "number", label: "height", def: 260, min: 160, max: 420 },
    },
    render: (a, ctx) => {
      const values = Array.isArray(a.values) ? a.values : [];
      const labels = Array.isArray(a.labels) ? a.labels : [];
      return (
        <div style={{ width: "100%", maxWidth: 480 }}>
          <Chart type={a.type} data={chartData(a.type, values, labels)} themeKey={`${ctx.theme}-${a.type}`} height={a.height} />
        </div>
      );
    },
  },

  // ───────── Feedback ─────────
  {
    id: "callout",
    name: "Callout",
    group: "Feedback",
    pkg: "@labspangaea/ds-callout",
    controls: {
      variant: { kind: "select", label: "variant", options: ["note", "tip", "caveat", "warning", "rule"], def: "note" },
      title: { kind: "text", label: "title", def: "Note" },
      showIcon: { kind: "bool", label: "custom icon", def: false },
      body: { kind: "text", label: "body", def: "Drive every colour off the tokens so both themes work." },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 600 }}>
        <Callout variant={a.variant} title={a.title || undefined} icon={a.showIcon ? <span aria-hidden="true">★</span> : undefined}>
          <p>{a.body}</p>
        </Callout>
      </div>
    ),
  },
  {
    id: "tooltip",
    name: "Tooltip",
    group: "Feedback",
    pkg: "@labspangaea/ds-tooltip",
    controls: {
      placement: { kind: "select", label: "placement", options: ["top", "bottom", "left", "right"], def: "top" },
      label: { kind: "text", label: "label", def: "Eval-gated" },
      trigger: { kind: "text", label: "trigger", def: "Hover or focus me" },
    },
    render: (a) => (
      <Tooltip label={a.label} placement={a.placement}>
        <Button variant="ghost">{a.trigger}</Button>
      </Tooltip>
    ),
  },
  {
    id: "modal",
    name: "Modal",
    group: "Feedback",
    pkg: "@labspangaea/ds-modal",
    controls: {
      title: { kind: "text", label: "title", def: "Book an Adopt Assessment" },
      body: { kind: "text", label: "body", def: "Native <dialog> — Esc closes, backdrop click dismisses, focus trapped." },
      footer: { kind: "bool", label: "footer", def: true },
    },
    render: (a) => <ModalDemo title={a.title} body={a.body} footer={a.footer} />,
  },

  // ───────── Navigation ─────────
  {
    id: "navbar",
    name: "Navbar",
    group: "Navigation",
    pkg: "@labspangaea/ds-navbar",
    notes: "links: JSON array of labels; activeIndex marks which one is current (0-based).",
    controls: {
      brand: { kind: "text", label: "brand", def: "PangaeaLabs" },
      links: { kind: "json", label: "links", def: ["AI", "Dev", "Marketing"] },
      activeIndex: { kind: "number", label: "activeIndex", def: 0, min: 0, max: 9 },
      actions: { kind: "bool", label: "actions", def: true },
    },
    render: (a) => {
      const labels: string[] = (Array.isArray(a.links) ? a.links : []).map((l: unknown) => String(l));
      return (
        <div style={{ width: "100%", border: "1px solid var(--rv-line)", borderRadius: "var(--rv-r)", overflow: "hidden" }}>
          <Navbar
            brand={a.brand}
            links={labels.map((l: string, i: number) => ({ label: l, href: "#", active: i === a.activeIndex }))}
            actions={a.actions ? <Button variant="primary">Book an audit</Button> : undefined}
          />
        </div>
      );
    },
  },
  {
    id: "tabs",
    name: "Tabs",
    group: "Navigation",
    pkg: "@labspangaea/ds-tabs",
    notes: "items: JSON array of { label, content }; id is slugged from the label. defaultIndex selects the open tab.",
    controls: {
      items: {
        kind: "json",
        label: "items",
        def: [
          { label: "Adopt", content: "A fast pilot with clear payback." },
          { label: "Amplify", content: "Scale the pattern across the org." },
          { label: "Autonomize", content: "Agentic systems, eval-gated." },
        ],
      },
      defaultIndex: { kind: "number", label: "defaultIndex", def: 0, min: 0, max: 9 },
    },
    render: (a) => {
      const slug = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      const items = (Array.isArray(a.items) ? a.items : []).map((it: any) => ({
        id: slug(String(it.label ?? "")),
        label: String(it.label ?? ""),
        content: <p>{String(it.content ?? "")}</p>,
      }));
      const idx = Math.max(0, Math.min(a.defaultIndex, items.length - 1));
      return (
        <div style={{ width: "100%", maxWidth: 560 }}>
          <Tabs defaultId={items[idx]?.id} items={items} />
        </div>
      );
    },
  },
  {
    id: "accordion",
    name: "Accordion",
    group: "Navigation",
    pkg: "@labspangaea/ds-accordion",
    notes: "items: JSON array of { question, answer }.",
    controls: {
      single: { kind: "bool", label: "single-open", def: true },
      firstOpen: { kind: "bool", label: "first open", def: true },
      items: {
        kind: "json",
        label: "items",
        def: [
          { question: "Do you own the code?", answer: "Yes — everything is handed to your team, owned, no lock-in." },
          { question: "Is it eval-gated?", answer: "Every release is eval-gated and red-teamed before it ships." },
          { question: "Self-hosted or managed?", answer: "Across the cost spectrum — self-hosted, hybrid, or fully managed." },
        ],
      },
    },
    render: (a) => {
      const items = Array.isArray(a.items) ? a.items : [];
      return (
        <div style={{ width: "100%", maxWidth: 560 }}>
          <Accordion>
            {items.map((it: any, i: number) => (
              <AccordionItem
                key={i}
                summary={String(it.question ?? "")}
                name={a.single ? "sb-faq" : undefined}
                defaultOpen={a.firstOpen && i === 0}
              >
                {String(it.answer ?? "")}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    },
  },
  {
    id: "stepper",
    name: "Stepper / timeline",
    group: "Navigation",
    pkg: "@labspangaea/ds-stepper",
    notes: 'The /dev "How we guarantee quality" pattern. steps: JSON array of { label, description? }; status derives from "active step".',
    controls: {
      orientation: { kind: "select", label: "orientation", options: ["horizontal", "vertical"], def: "horizontal" },
      active: { kind: "number", label: "active step", def: 2, min: 1, max: 8 },
      steps: {
        kind: "json",
        label: "steps",
        def: [
          { label: "Scope", description: "Audit the stack" },
          { label: "Build", description: "Eval-gated" },
          { label: "Red-team", description: "OWASP LLM Top 10" },
          { label: "Ship", description: "Owned by your team" },
        ],
      },
    },
    render: (a) => <StepperDemo steps={Array.isArray(a.steps) ? a.steps : []} orientation={a.orientation} active={a.active} />,
  },

  // ───────── Sections ─────────
  {
    id: "hero",
    name: "Hero",
    group: "Sections",
    pkg: "@labspangaea/ds-hero",
    notes: "Toggle EN/ID in the toolbar — the action labels localize.",
    controls: {
      kicker: { kind: "text", label: "kicker", def: "BUILD track" },
      title: { kind: "text", label: "title", def: "AI, implemented." },
      accent: { kind: "text", label: "accent word", def: "implemented." },
      lead: { kind: "text", label: "lead", def: "From strategy to production — then proven." },
      actions: { kind: "bool", label: "actions", def: true },
      visual: { kind: "bool", label: "visual", def: false },
    },
    render: (a, { lang }) => (
      <div style={{ width: "100%", border: "1px solid var(--rv-line)", borderRadius: "var(--rv-r)", overflow: "hidden" }}>
        <Hero
          kicker={a.kicker || undefined}
          title={heroAccent(a.title, a.accent)}
          lead={a.lead || undefined}
          actions={
            a.actions ? (
              <>
                <Button variant="primary" arrow>
                  {lang === "id" ? "Pesan audit" : "Book an audit"}
                </Button>
                <Button variant="ghost">{lang === "id" ? "Lihat harga" : "See pricing"}</Button>
              </>
            ) : undefined
          }
          visual={
            a.visual ? (
              <svg viewBox="0 0 320 200" role="img" aria-label="RAG pipeline diagram" style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--rv-r-sm)", border: "1px solid var(--rv-line)", background: "var(--rv-bg-alt)" }}>
                <rect x="16" y="78" width="72" height="44" rx="8" fill="var(--rv-bg)" stroke="var(--rv-accent)" strokeWidth="2" />
                <rect x="124" y="78" width="72" height="44" rx="8" fill="var(--rv-bg)" stroke="var(--rv-accent)" strokeWidth="2" />
                <rect x="232" y="78" width="72" height="44" rx="8" fill="var(--rv-brand)" />
                <line x1="88" y1="100" x2="124" y2="100" stroke="var(--rv-accent)" strokeWidth="2" />
                <line x1="196" y1="100" x2="232" y2="100" stroke="var(--rv-accent)" strokeWidth="2" />
              </svg>
            ) : undefined
          }
        />
      </div>
    ),
  },
  {
    id: "cta",
    name: "CTA Band",
    group: "Sections",
    pkg: "@labspangaea/ds-cta",
    notes: "Toggle EN/ID in the toolbar — the action labels localize.",
    controls: {
      title: { kind: "text", label: "title", def: "Ready to see it work?" },
      lead: { kind: "text", label: "lead", def: "Book an Adopt Assessment — we'll audit your stack and scope a pilot." },
      actions: { kind: "bool", label: "actions", def: true },
    },
    render: (a, { lang }) => (
      <div style={{ width: "100%" }}>
        <CtaBand
          title={a.title}
          lead={a.lead || undefined}
          actions={
            a.actions ? (
              <>
                <Button variant="blue" arrow>
                  {lang === "id" ? "Pesan audit" : "Book an audit"}
                </Button>
                <Button variant="ghost">{lang === "id" ? "Lihat harga" : "See pricing"}</Button>
              </>
            ) : undefined
          }
        />
      </div>
    ),
  },
  {
    id: "pricing",
    name: "Pricing tier",
    group: "Sections",
    pkg: "@labspangaea/ds-pricing",
    controls: {
      name: { kind: "text", label: "name", def: "Adopt" },
      price: { kind: "text", label: "price", def: "from $12k" },
      period: { kind: "text", label: "period", def: "/ pilot" },
      tagline: { kind: "text", label: "tagline", def: "A fast pilot with clear payback." },
      featured: { kind: "bool", label: "featured", def: true },
      featuredLabel: { kind: "text", label: "featuredLabel", def: "Most adopted" },
      cta: { kind: "bool", label: "cta", def: true },
      features: {
        kind: "json",
        label: "features",
        def: ["Eval-gated delivery", "Red-team pass (OWASP LLM Top 10)", "You own the code", "Self-hosted / hybrid / managed"],
      },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 320 }}>
        <PricingTier
          name={a.name}
          price={a.price || undefined}
          period={a.period || undefined}
          tagline={a.tagline || undefined}
          featured={a.featured}
          featuredLabel={a.featuredLabel}
          features={(Array.isArray(a.features) ? a.features : []).map((f: unknown) => String(f))}
          cta={a.cta ? <Button variant="primary" arrow>Book an audit</Button> : undefined}
        />
      </div>
    ),
  },
  {
    id: "teamcard",
    name: "Team card",
    group: "Sections",
    pkg: "@labspangaea/ds-teamcard",
    controls: {
      name: { kind: "text", label: "name", def: "Harry Osmar" },
      role: { kind: "text", label: "role", def: "Founder · Engineering" },
      bio: { kind: "text", label: "bio", def: "10+ yrs shipping AI to production." },
      avatarSrc: { kind: "text", label: "avatarSrc (url)", def: "" },
      socials: { kind: "bool", label: "socials", def: true },
      href: { kind: "bool", label: "href (link card)", def: false },
    },
    render: (a) => (
      <div style={{ maxWidth: 300 }}>
        <TeamCard
          name={a.name}
          role={a.role}
          bio={a.bio || undefined}
          avatarSrc={a.avatarSrc || undefined}
          href={a.href ? "#profile" : undefined}
          socials={a.socials ? <SocialIcons size="sm" links={[{ platform: "linkedin", href: "#" }, { platform: "github", href: "#" }]} /> : undefined}
        />
      </div>
    ),
  },
  {
    id: "logowall",
    name: "Logo wall",
    group: "Sections",
    pkg: "@labspangaea/ds-logowall",
    notes: "logos: JSON array of { name, src? } (src = optional logo image URL).",
    controls: {
      label: { kind: "text", label: "label", def: "Trusted by teams shipping to production" },
      logos: {
        kind: "json",
        label: "logos",
        def: [{ name: "Acme" }, { name: "Northwind" }, { name: "Globex" }, { name: "Initech" }, { name: "Umbrella" }],
      },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 720 }}>
        <LogoWall
          label={a.label || undefined}
          logos={(Array.isArray(a.logos) ? a.logos : []).map((l: any) => ({ name: String(l.name ?? ""), src: l.src || undefined, href: "#" }))}
        />
      </div>
    ),
  },
  {
    id: "testimonial",
    name: "Testimonial",
    group: "Sections",
    pkg: "@labspangaea/ds-testimonial",
    notes: "items: JSON array of { quote, author, role? }.",
    controls: {
      interval: { kind: "number", label: "interval (ms)", def: 6000, min: 0, max: 12000 },
      items: {
        kind: "json",
        label: "items",
        def: [
          { quote: "Finally, people who treat this like engineering.", author: "Head of Engineering", role: "fintech" },
          { quote: "Shipped to prod in weeks, owned by our team.", author: "Ops Lead", role: "mid-size co" },
          { quote: "Auditable, sovereign, no black box.", author: "IT Procurement", role: "BUMN" },
        ],
      },
    },
    render: (a) => {
      const raw = Array.isArray(a.items) ? a.items : [];
      const items = raw.length ? raw : [{ quote: "Add items as { quote, author, role }.", author: "—" }];
      return (
        <div style={{ width: "100%", padding: "10px 0" }}>
          <TestimonialCarousel interval={a.interval} items={items} />
        </div>
      );
    },
  },
  {
    id: "layout",
    name: "Layout grid",
    group: "Sections",
    pkg: "@labspangaea/ds-section",
    controls: { cols: { kind: "select", label: "cols", options: ["2", "3", "4"], def: "4" } },
    render: (a) => (
      <div style={{ width: "100%" }}>
        <Grid cols={Number(a.cols) as 2 | 3 | 4}>
          {["01", "02", "03", "04"].map((n) => (
            <Card key={n}>
              <div style={{ fontFamily: "var(--rv-mono)", fontSize: "1.4rem", color: "var(--rv-accent-ink)" }}>{n}</div>
            </Card>
          ))}
        </Grid>
      </div>
    ),
  },

  // ───────── Content blocks (ported faithfully from the live site) ─────────
  {
    id: "stat",
    name: "Stat",
    group: "Data display",
    pkg: "@labspangaea/ds-stat",
    notes: "Big-number stat; pct adds a progress bar (the metric variant); icon adds a chip. stats: JSON array of { value, label, pct }.",
    controls: {
      stats: {
        kind: "json",
        label: "stats",
        def: [
          { value: "0.94", label: "Faithfulness (RAGAS)", pct: 94 },
          { value: "12+", label: "Production systems", pct: 80 },
          { value: "100%", label: "Code you own", pct: 100 },
        ],
      },
      bar: { kind: "bool", label: "progress bar", def: true },
      icon: { kind: "bool", label: "icon", def: false },
    },
    render: (a) => {
      const ico = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 3 3 5-6" />
        </svg>
      );
      const stats = Array.isArray(a.stats) ? a.stats : [];
      return (
        <StatGrid>
          {stats.map((it: any, i: number) => (
            <Stat
              key={i}
              value={String(it.value ?? "")}
              label={String(it.label ?? "")}
              pct={a.bar ? Number(it.pct ?? 0) : undefined}
              icon={a.icon ? ico : undefined}
            />
          ))}
        </StatGrid>
      );
    },
  },
  {
    id: "checklist",
    name: "Checklist",
    group: "Data display",
    pkg: "@labspangaea/ds-checklist",
    controls: {
      items: {
        kind: "json",
        label: "items",
        def: ["Permissions & least privilege", "Eval-gated releases (RAGAS)", "Observability + cost controls", "You own the code"],
      },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 460 }}>
        <Checklist items={Array.isArray(a.items) ? a.items : []} />
      </div>
    ),
  },
  {
    id: "table",
    name: "Table",
    group: "Data display",
    pkg: "@labspangaea/ds-table",
    notes: "Responsive hairline table (scroll-wrapped). headers + rows are JSON.",
    controls: {
      headers: { kind: "json", label: "headers", def: ["Engagement", "Outcome", "Owned"] },
      rows: {
        kind: "json",
        label: "rows",
        def: [
          ["Adopt", "Fast pilot", "Yes"],
          ["Amplify", "Scaled pattern", "Yes"],
          ["Autonomize", "Agentic system", "Yes"],
        ],
      },
    },
    render: (a) => {
      const headers = Array.isArray(a.headers) ? a.headers : [];
      const rows = Array.isArray(a.rows) ? a.rows : [];
      return (
        <div style={{ width: "100%", maxWidth: 640 }}>
          <Table>
            <thead>
              <tr>
                {headers.map((h: unknown, i: number) => (
                  <th key={i}>{String(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: unknown, i: number) => (
                <tr key={i}>
                  {(Array.isArray(r) ? r : []).map((c: unknown, j: number) => (
                    <td key={j}>{String(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    },
  },
  {
    id: "pillar",
    name: "Pillar",
    group: "Sections",
    pkg: "@labspangaea/ds-pillar",
    notes: "pillars: JSON array of { title, body }. icon/link inject the example icon + 'Learn more →' link.",
    controls: {
      pillars: {
        kind: "json",
        label: "pillars",
        def: [
          { title: "AI Implementation", body: "RAG pipelines, LLM apps, agentic systems — eval-gated to production." },
          { title: "Development", body: "Senior engineers, owned code, no lock-in." },
          { title: "Marketing", body: "GEO + first-party data that gets you cited." },
        ],
      },
      icon: { kind: "bool", label: "icon", def: true },
      link: { kind: "bool", label: "link", def: true },
    },
    render: (a) => {
      const ico = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" />
        </svg>
      );
      const link = (
        <a className="rv-link" href="#">
          Learn more →
        </a>
      );
      const pillars = Array.isArray(a.pillars) ? a.pillars : [];
      return (
        <PillarGrid>
          {pillars.map((it: any, i: number) => (
            <Pillar key={i} title={String(it.title ?? "")} icon={a.icon ? ico : undefined} link={a.link ? link : undefined}>
              {String(it.body ?? "")}
            </Pillar>
          ))}
        </PillarGrid>
      );
    },
  },
  {
    id: "points",
    name: "Points",
    group: "Sections",
    pkg: "@labspangaea/ds-points",
    notes: "items: JSON array of { n, title, desc }. n is the optional index marker.",
    controls: {
      cols: { kind: "select", label: "cols", options: ["2", "3"], def: "3" },
      items: {
        kind: "json",
        label: "items",
        def: [
          { n: "01", title: "Permissions", desc: "Scoped access, least privilege." },
          { n: "02", title: "Evaluation", desc: "RAGAS scores gate every release." },
          { n: "03", title: "Observability", desc: "Traces, cost controls, failure handling." },
        ],
      },
    },
    render: (a) => {
      const items = Array.isArray(a.items) ? a.items : [];
      return (
        <Points cols={Number(a.cols) as 2 | 3}>
          {items.map((it: any, i: number) => (
            <Point key={i} n={it.n != null && String(it.n) !== "" ? String(it.n) : undefined} title={String(it.title ?? "")}>
              {String(it.desc ?? "")}
            </Point>
          ))}
        </Points>
      );
    },
  },
  {
    id: "dodont",
    name: "Do / Don't",
    group: "Content",
    pkg: "@labspangaea/ds-dodont",
    controls: {
      doTitle: { kind: "text", label: "do title", def: "Do" },
      doText: { kind: "text", label: "do text", def: "Eval-gate every release with named metrics." },
      dontTitle: { kind: "text", label: "don't title", def: "Don't" },
      dontText: { kind: "text", label: "don't text", def: "Ship on vibes and hope it holds in prod." },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 640 }}>
        <DoDont>
          <Do title={a.doTitle}>
            <p>{a.doText}</p>
          </Do>
          <Dont title={a.dontTitle}>
            <p>{a.dontText}</p>
          </Dont>
        </DoDont>
      </div>
    ),
  },
  {
    id: "compare",
    name: "Compare",
    group: "Content",
    pkg: "@labspangaea/ds-compare",
    notes: "cols: JSON array of { label, body, good? }. good:true highlights that column blue (tone='good').",
    controls: {
      cols: {
        kind: "json",
        label: "cols",
        def: [
          { label: "A demo", body: "Works in the happy path. No evals, no guardrails." },
          { label: "A production system", body: "Eval-gated, red-teamed, observable, owned.", good: true },
        ],
      },
    },
    render: (a) => {
      const cols = Array.isArray(a.cols) ? a.cols : [];
      return (
        <div style={{ width: "100%", maxWidth: 640 }}>
          <Compare>
            {cols.map((it: any, i: number) => (
              <Col key={i} label={String(it.label ?? "")} tone={it.good ? "good" : undefined}>
                <p>{String(it.body ?? "")}</p>
              </Col>
            ))}
          </Compare>
        </div>
      );
    },
  },
  {
    id: "references",
    name: "References",
    group: "Content",
    pkg: "@labspangaea/ds-references",
    notes: "intro = lead sentence; cites = inline <Cite> links after it; refs = the numbered <Ref> Sources list. cites + refs are { text, href } JSON arrays.",
    controls: {
      heading: { kind: "text", label: "heading", def: "Sources" },
      intro: { kind: "text", label: "intro", def: "Backed by standards and frameworks:" },
      cites: {
        kind: "json",
        label: "inline cites",
        def: [
          { text: "OWASP LLM Top 10", href: "#" },
          { text: "NIST AI RMF", href: "#" },
        ],
      },
      refs: {
        kind: "json",
        label: "refs",
        def: [
          { text: "OWASP Top 10 for LLM Applications", href: "#" },
          { text: "NIST AI Risk Management Framework", href: "#" },
          { text: "RAGAS — RAG evaluation", href: "#" },
        ],
      },
    },
    render: (a) => {
      const cites = Array.isArray(a.cites) ? a.cites : [];
      const refs = Array.isArray(a.refs) ? a.refs : [];
      return (
        <div style={{ width: "100%", maxWidth: 560 }}>
          <p style={{ color: "var(--rv-ink-2)" }}>
            {a.intro ? `${a.intro} ` : null}
            {cites.map((c: any, i: number) => (
              <React.Fragment key={i}>
                <Cite href={String(c?.href ?? "#")}>{String(c?.text ?? "")}</Cite>
                {i < cites.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </p>
          <References heading={a.heading}>
            {refs.map((r: any, i: number) => (
              <Ref key={i} href={String(r?.href ?? "#")}>
                {String(r?.text ?? "")}
              </Ref>
            ))}
          </References>
        </div>
      );
    },
  },
  {
    id: "archflow",
    name: "Arch flow",
    group: "Content",
    pkg: "@labspangaea/ds-archflow",
    controls: {
      steps: { kind: "json", label: "steps", def: ["Query", "Retrieve", "Rerank", "Generate", "Eval gate"] },
      caption: { kind: "text", label: "caption", def: "The RAG pipeline — eval-gated before it answers." },
    },
    render: (a) => (
      <div style={{ width: "100%", maxWidth: 640 }}>
        <ArchFlow steps={(Array.isArray(a.steps) ? a.steps : []).map((s: unknown) => String(s))} caption={a.caption || undefined} />
      </div>
    ),
  },
];

export const GROUPS = Array.from(new Set(STORIES.map((s) => s.group)));
