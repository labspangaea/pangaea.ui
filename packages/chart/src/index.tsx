import * as React from "react";
import {
  Chart as ChartJS,
  type ChartConfiguration,
  type ChartType,
  registerables,
} from "chart.js";

ChartJS.register(...registerables);

/** Reads brand colors from the live --rv-* CSS variables (so charts follow the theme). */
export function brandColors() {
  const root = typeof document !== "undefined" ? document.documentElement : null;
  const v = (name: string, fallback: string) =>
    (root ? getComputedStyle(root).getPropertyValue(name).trim() : "") || fallback;
  return {
    accent: v("--rv-accent", "#3fa9f5"),
    accentInk: v("--rv-accent-ink", "#1568b4"),
    soft: v("--rv-accent-soft", "#e7f2fe"),
    ink: v("--rv-ink", "#203150"),
    muted: v("--rv-ink-3", "#5f6e88"),
    grid: v("--rv-line", "rgba(32,49,80,0.1)"),
    font: v("--rv-body", "Geist, system-ui, sans-serif"),
  };
}

export interface ChartProps {
  type: ChartType;
  data: ChartConfiguration["data"];
  options?: ChartConfiguration["options"];
  height?: number;
  className?: string;
  /**
   * Accessible text alternative for the chart (WCAG 1.1.1 Non-text Content).
   * Rendered as the canvas `aria-label`. Falls back to `"{type} chart"`.
   */
  ariaLabel?: string;
  /**
   * Change this (e.g. pass the current theme) to force a re-create so the chart
   * re-reads the brand colors — Chart.js bakes colors at construction time.
   */
  themeKey?: string | number;
}

/**
 * Thin Chart.js wrapper. Re-creates on `type`/`themeKey` change, updates in place
 * on `data`/`options`. Brand defaults (font, grid, tick color) applied from tokens.
 * Use as a client component (it touches the DOM): requires `chart.js` (peer dep).
 */
export function Chart({
  type,
  data,
  options,
  height = 260,
  className,
  ariaLabel,
  themeKey,
}: ChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const chartRef = React.useRef<ChartJS | null>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const c = brandColors();
    ChartJS.defaults.font.family = c.font;
    ChartJS.defaults.color = c.muted;

    const merged: ChartConfiguration = {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true } } },
        scales:
          type === "bar" || type === "line"
            ? {
                x: { grid: { display: false }, ticks: { color: c.muted } },
                y: { grid: { color: c.grid }, ticks: { color: c.muted }, border: { display: false } },
              }
            : undefined,
        ...options,
      },
    };

    chartRef.current = new ChartJS(canvasRef.current, merged);

    // Belt-and-suspenders re-fit: Chart.js watches the container via its own
    // ResizeObserver, but an explicit resize() on window resize guarantees the
    // canvas shrinks back down (classic "stuck wide on resize-down" overflow).
    const onResize = () => chartRef.current?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chartRef.current?.destroy();
    };
    // Re-create only when type/theme changes; data/options handled below.
  }, [type, themeKey]);

  React.useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data = data;
    if (options) chart.options = { ...chart.options, ...options };
    chart.update();
  }, [data, options]);

  // WCAG 1.1.1: give the canvas a text alternative. Default to "{type} chart".
  const label = ariaLabel ?? `${type} chart`;

  return (
    // position:relative + width:100% lets Chart.js measure and shrink the canvas
    // to the container; max-width:100% keeps it from overflowing the parent.
    <div
      className={className}
      style={{ position: "relative", width: "100%", maxWidth: "100%", height }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        style={{ display: "block", boxSizing: "border-box", maxWidth: "100%" }}
      />
    </div>
  );
}
