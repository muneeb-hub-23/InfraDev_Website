'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PageEffects() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            reveal.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

    const counters = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const target = Number(el.dataset.target) || 0;
          const step = target / (1600 / 16);
          let current = 0;
          const tick = () => {
            current = Math.min(current + step, target);
            el.textContent = current < target ? `${Math.floor(current)}+` : `${target}+`;
            if (current < target) requestAnimationFrame(tick);
          };
          tick();
          counters.unobserve(el);
        }),
      { threshold: 0.5 },
    );
    document.querySelectorAll('.counter').forEach((el) => counters.observe(el));

    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      reveal.disconnect();
      counters.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`btn-primary fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
        showTop ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
