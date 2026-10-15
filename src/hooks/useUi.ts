import { useEffect, useState, type RefObject } from 'react';

/** Tracks a CSS media query reactively. */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(media.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/** True when the user has asked the OS to reduce motion. */
export const useReducedMotion = (): boolean => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Locks body scroll while an overlay is open. */
export const useScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previous;
      document.body.style.paddingRight = '';
    };
  }, [locked]);
};

/** Calls the handler when Escape is pressed while active. */
export const useEscapeKey = (active: boolean, handler: () => void): void => {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, handler]);
};

/** Closes a popover when the user clicks outside the referenced element. */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  handler: () => void
): void => {
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [ref, active, handler]);
};

/** Debounces a rapidly-changing value (used by search inputs). */
export const useDebounce = <T,>(value: T, delay = 250): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

/** Traps focus inside a container while it is open (for dialogs and drawers). */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  active: boolean
): void => {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(selector));
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [ref, active]);
};

/** Tracks scroll position; used by the sticky header and back-to-top button. */
export const useScrollPosition = (): { x: number; y: number; direction: 'up' | 'down' } => {
  const [state, setState] = useState({ x: 0, y: 0, direction: 'up' as 'up' | 'down' });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setState({
          x: window.scrollX,
          y,
          direction: y > lastY ? 'down' : 'up',
        });
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return state;
};

/** Returns true once the element has scrolled into view (for reveal animations). */
export const useInView = (
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0.1 }
): boolean => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);

  return inView;
};

/** Provides the current window size for responsive JS logic. */
export const useWindowSize = (): { width: number; height: number } => {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  useEffect(() => {
    let ticking = false;
    const onResize = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
        ticking = false;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
};
