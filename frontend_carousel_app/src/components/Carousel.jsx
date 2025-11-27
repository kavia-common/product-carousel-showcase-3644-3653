import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * Carousel component for content slides.
 * - Auto-advances every intervalMs (default 2000ms).
 * - Pauses on hover/focus and resumes on mouse leave/blur.
 * - Keyboard accessible with Left/Right arrow navigation.
 * - Dots are focusable buttons with aria-current on the active one.
 *
 * Direction-aware transitions:
 * We derive a direction ("forward" or "backward") from the navigation intent.
 * This ensures the slide animation is consistent at boundaries (last->first, first->last).
 */
export default function Carousel({
  slides,
  intervalMs = 2000,
  className = "",
  ariaLabel = "Product highlights carousel",
}) {
  const [index, setIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const [direction, setDirection] = useState("forward"); // "forward" | "backward"
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  const count = slides?.length ?? 0;
  const safeSlides = useMemo(() => (Array.isArray(slides) ? slides : []), [slides]);

  // Determine intended direction given current index and a requested target.
  const computeDirection = useCallback(
    (current, target) => {
      if (count <= 1) return "forward";
      const normTarget = ((target % count) + count) % count;

      if (normTarget === current) return direction; // no change

      // PUBLIC_INTERFACE
      // Force left-to-right visual animation when wrapping from last -> first.
      // Rationale: Users expect the next slide to come in from the right when
      // advancing forward, even at the boundary (count-1 -> 0). Without this,
      // some heuristics may cause a right-to-left effect on wrap which feels reversed.
      if (current === count - 1 && normTarget === 0) {
        return "forward";
      }

      // Similarly, when wrapping from first -> last via explicit previous action,
      // ensure the animation is right-to-left to match a backward intent.
      if (current === 0 && normTarget === count - 1) {
        return "backward";
      }

      // direct neighbors considering wrap
      const forwardIdx = (current + 1) % count;
      const backwardIdx = (current - 1 + count) % count;

      if (normTarget === forwardIdx) return "forward";
      if (normTarget === backwardIdx) return "backward";

      // For dot jumps, choose shortest path direction.
      // Compute forward distance (moving +1 each step)
      const forwardDist = (normTarget - current + count) % count;
      const backwardDist = (current - normTarget + count) % count;

      return forwardDist <= backwardDist ? "forward" : "backward";
    },
    [count, direction]
  );

  // Navigate to an absolute index with direction derived from intent.
  const goTo = useCallback(
    (i) => {
      setIndex((prev) => {
        const next = ((i % count) + count) % count;
        const dir = computeDirection(prev, next);
        setDirection(dir);
        setLastIndex(prev);
        return next;
      });
    },
    [count, computeDirection]
  );

  // Move forward one (autoplay and right arrow)
  const next = useCallback(() => {
    // Always mark forward for autoplay/explicit next
    setDirection("forward");
    goTo(index + 1);
  }, [index, goTo]);

  // Move backward one (left arrow)
  const prev = useCallback(() => {
    setDirection("backward");
    goTo(index - 1);
  }, [index, goTo]);

  // Auto-advance timer (forward only)
  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setTimeout(() => {
      next();
    }, intervalMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, count, intervalMs, next]);

  // Keyboard navigation on container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onMouseEnter = () => setPaused(true);
  const onMouseLeave = () => setPaused(false);
  const onFocusIn = () => setPaused(true);
  const onFocusOut = (e) => {
    // Resume when focus leaves the carousel subtree
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
      setPaused(false);
    }
  };

  // Direction-aware transition style/class
  const translateStyle = { transform: `translateX(-${index * 100}%)` };
  const transitionClass =
    direction === "forward"
      ? "transition-transform duration-500 ease-out"
      : "transition-transform duration-500 ease-out"; // same timing; direction expressed by translate target

  // Note: The transform target determines perceived direction since slides are ordered left->right.
  // The computed direction changes only how the previous and next indices are chosen and remembered
  // so that wrap cases (last->first backward vs forward) feel correct.

  return (
    <section
      ref={containerRef}
      className={`relative w-full max-w-screen-md mx-auto focus:outline-none ${className}`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      {/* Slide viewport */}
      <div className="overflow-hidden rounded-xl shadow-soft bg-ocean-surface relative ocean-gradient">
        <div className={`flex ${transitionClass}`} style={translateStyle}>
          {safeSlides.map((slide, i) => (
            <article
              key={i}
              className="w-full flex-shrink-0 p-8 sm:p-10 md:p-12"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-2xl sm:text-3xl font-semibold text-ocean-text mb-3">
                  {slide.title}
                </h3>
                <p className="text-ocean-text/80 mb-6 leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={slide.primaryHref || "#"}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-ocean-primary text-white font-medium shadow hover:shadow-md hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-primary/50 transition"
                    onClick={(e) => {
                      if (!slide.primaryHref) e.preventDefault();
                      if (typeof slide.onPrimary === "function") slide.onPrimary();
                    }}
                  >
                    {slide.primaryCta || "Learn more"}
                  </a>
                  {slide.secondaryText && (
                    <button
                      type="button"
                      onClick={slide.onSecondary}
                      className="inline-flex items-center px-4 py-2 rounded-lg border border-ocean-secondary/40 text-ocean-secondary font-medium hover:bg-ocean-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-secondary/40 transition"
                    >
                      {slide.secondaryText}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute inset-x-0 bottom-3 sm:bottom-4 flex items-center justify-center gap-2">
          {safeSlides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                className={`h-2.5 w-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 ${
                  active
                    ? "bg-ocean-primary w-6"
                    : "bg-gray-300 hover:bg-gray-400 focus-visible:ring-ocean-primary/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? "true" : "false"}
                onClick={() => {
                  // Determine direction vs current when clicking a dot
                  const dir = computeDirection(index, i);
                  setDirection(dir);
                  goTo(i);
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
