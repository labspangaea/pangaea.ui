import * as React from "react";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export interface Testimonial {
  quote: React.ReactNode;
  author: string;
  role?: string;
}

export interface TestimonialCarouselProps {
  items: Testimonial[];
  /** Auto-advance interval (ms). 0 disables auto-play. */
  interval?: number;
  className?: string;
}

export function TestimonialCarousel({ items, interval = 6000, className }: TestimonialCarouselProps) {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (items.length <= 1 || interval <= 0 || paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval, paused]);

  const t = items[i];
  if (!t) return null;

  return (
    <div
      className={cx("rv-tcar", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <figure className="rv-tcar-fig" key={i}>
        <blockquote>{t.quote}</blockquote>
        <figcaption>
          <strong>{t.author}</strong>
          {t.role ? <span className="rv-tcar-role"> · {t.role}</span> : null}
        </figcaption>
      </figure>
      {items.length > 1 ? (
        <div className="rv-tcar-dots" role="tablist" aria-label="Choose testimonial">
          {items.map((_, n) => (
            <button
              key={n}
              type="button"
              role="tab"
              className={cx("rv-tcar-dot", n === i && "is-active")}
              aria-selected={n === i}
              aria-label={`Testimonial ${n + 1}`}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
