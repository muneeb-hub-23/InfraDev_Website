'use client';

import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NAV_LINKS } from '@/lib/content';
import { Logo } from './Logo';

export function Navbar({ logo, name, phone }: { logo: string; name: string; phone: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      let current = 'home';
      document.querySelectorAll<HTMLElement>('section[id]').forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tel = phone.replace(/[^\d+]/g, '');

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-brand/15 bg-white/90 shadow-sm backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <a href="#home" className="group flex items-center gap-3">
            <Logo src={logo} name={name} className="h-10 w-auto transition-transform duration-300 group-hover:scale-105 lg:h-12" />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link text-sm font-medium transition-colors hover:text-navy ${
                  active === l.href.slice(1) ? 'active text-navy' : 'text-slate-600'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {phone && (
              <a href={`tel:${tel}`} className="flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-dark">
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </a>
            )}
            <a href="#contact" className="btn-primary rounded-lg px-5 py-2 text-sm font-semibold">
              Get a Quote
            </a>
          </div>

          <button
            className="p-2 text-slate-600 transition-colors hover:text-navy lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div id="mobile-menu" className={`glass mb-3 rounded-xl lg:hidden ${open ? 'open' : ''}`}>
          <div className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-brand/5 hover:text-navy"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-1 border-t border-slate-200 pt-2">
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary block rounded-lg px-4 py-2.5 text-center text-sm font-semibold">
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
