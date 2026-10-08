import {
  ArrowRight, Check, ChevronDown, ChevronRight, Globe, Info, Layers, Mail, MapPin, MessageCircle, Phone, PlusCircle, Star, Workflow,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Navbar } from '@/components/Navbar';
import { PageEffects } from '@/components/PageEffects';
import { Particles } from '@/components/Particles';
import {
  ABOUT_PILLARS, ABOUT_POINTS, ADVANTAGES, FOOTER_SERVICES, HERO_ICONS, MARQUEE, PROCESS, SERVICES, TONE,
} from '@/lib/content';
import { getSettings } from '@/lib/settings';

const delay = (s: number) => ({ transitionDelay: `${s}s` });
const BG_DOWN = { background: 'linear-gradient(180deg, #ffffff 0%, #f4f8fc 100%)' };
const BG_UP = { background: 'linear-gradient(180deg, #f4f8fc 0%, #ffffff 100%)' };

function Badge({ icon: Icon, children }: { icon: typeof Info; children: React.ReactNode }) {
  return (
    <div className="badge mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
      <Icon className="h-3.5 w-3.5" /> {children}
    </div>
  );
}

function Counter({ value, className }: { value: string; className: string }) {
  const n = Number(value);
  return Number.isFinite(n) && value.trim() !== '' ? (
    <div className={`${className} counter`} data-target={n}>0</div>
  ) : (
    <div className={className}>{value}</div>
  );
}

function Heading({ tagline }: { tagline: string }) {
  const sentences = tagline.split(/(?<=[.!?])\s+/).filter(Boolean);
  return (
    <>
      {sentences.map((sentence, i) => {
        const words = sentence.split(' ');
        const last = words.pop()!;
        return (
          <span key={i} className="block">
            {words.length > 0 && <span className="text-navy">{words.join(' ')} </span>}
            <span className="gradient-text">{last}</span>
          </span>
        );
      })}
    </>
  );
}

export default async function HomePage() {
  const s = await getSettings();
  const name = s.companyName;
  const tel = s.phone.replace(/[^\d+]/g, '');
  const wa = (s.whatsapp || s.phone).replace(/\D/g, '');
  const siteLabel = s.website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <>
      <noscript>
        <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
      </noscript>
      <Navbar logo={s.logo} name={name} phone={s.phone} />

      {/* HERO */}
      <section id="home" className="hero-bg relative flex min-h-screen items-center overflow-hidden pt-20">
        <Particles />
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 animate-pulse-slow rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-64 w-64 animate-pulse-slow rounded-full bg-gold/15 blur-3xl" style={{ animationDelay: '1.5s' }} />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              {s.heroBadge && (
                <div className="badge reveal inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                  {s.heroBadge}
                </div>
              )}

              <h1 className="reveal text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl" style={delay(0.1)}>
                <Heading tagline={s.tagline} />
              </h1>

              <p className="reveal max-w-xl text-lg leading-relaxed text-slate-600 lg:text-xl" style={delay(0.2)}>
                {s.shortDescription}
              </p>

              <div className="reveal flex flex-wrap gap-4" style={delay(0.3)}>
                <a href="#services" className="btn-primary flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold">
                  <Layers className="h-5 w-5" /> Explore Services
                </a>
                <a href="#contact" className="btn-outline flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold">
                  <Mail className="h-5 w-5" /> Contact Us
                </a>
              </div>

              <div className="reveal flex flex-wrap gap-6 pt-4" style={delay(0.4)}>
                <div className="text-center">
                  <Counter value={s.statProjects} className="text-3xl font-black text-navy" />
                  <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">Projects Done</div>
                </div>
                <div className="w-px bg-slate-300" />
                <div className="text-center">
                  <Counter value={s.statClients} className="text-3xl font-black text-navy" />
                  <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">Happy Clients</div>
                </div>
                <div className="w-px bg-slate-300" />
                <div className="text-center">
                  <div className="text-3xl font-black text-navy">{SERVICES.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">Services</div>
                </div>
                <div className="w-px bg-slate-300" />
                <div className="text-center">
                  <div className="text-3xl font-black text-navy">{s.statSupport}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-slate-500">Support</div>
                </div>
              </div>
            </div>

            <div className="reveal flex justify-center lg:justify-end" style={delay(0.25)}>
              <div className="relative animate-float">
                <div className="absolute inset-0 scale-110 animate-pulse-slow rounded-full bg-brand/15 blur-2xl" />
                <div className="glass relative flex animate-glow flex-col items-center gap-6 rounded-3xl p-10 lg:p-12">
                  <Logo src={s.logo} name={name} className="w-52 lg:w-64 xl:w-72" />
                  <div className="mt-2 flex gap-4">
                    {HERO_ICONS.map(({ icon: Icon, label, tone }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONE[tone].box} ${TONE[tone].glow}`}>
                          <Icon className={`h-5 w-5 ${TONE[tone].icon}`} />
                        </div>
                        <span className="text-xs text-slate-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-slate-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-brand/10 bg-surface py-5">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map(({ icon: Icon, label, tone }, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
              <Icon className={`h-4 w-4 ${tone === 'gold' ? 'text-gold' : 'text-brand/70'}`} /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="py-24 lg:py-32" style={BG_DOWN}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <Badge icon={Info}>About {name}</Badge>
            <h2 className="text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
              Your Technology <span className="gradient-text">Infrastructure Partner</span>
            </h2>
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="reveal relative">
              <div className="glass rounded-2xl p-8 lg:p-10">
                <div className="mb-6 flex items-center gap-4">
                  <Logo src={s.logo} name={name} className="h-14 w-auto" />
                  <div>
                    <div className="font-display text-lg font-bold text-navy">{name}</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500">{s.heroBadge}</div>
                  </div>
                </div>
                <div className="mb-6 rounded-xl border border-brand/20 bg-brand/10 p-4">
                  <p className="text-lg font-semibold italic text-brand-dark">&ldquo;{s.tagline}&rdquo;</p>
                </div>
                <ul className="space-y-3">
                  {ABOUT_POINTS.map((p) => (
                    <li key={p.text} className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand/15">
                        <Check className="h-3 w-3 text-brand" />
                      </div>
                      {p.text}
                    </li>
                  ))}
                  {s.address && (
                    <li className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/20">
                        <Check className="h-3 w-3 text-gold-dark" />
                      </div>
                      Based in {s.address} – serving nationwide
                    </li>
                  )}
                </ul>
              </div>
              {s.statExperience && (
                <div className="stat-card absolute -bottom-4 -right-4 hidden rounded-xl px-5 py-3 lg:block">
                  <div className="text-2xl font-black text-navy">{s.statExperience}</div>
                  <div className="text-xs text-slate-500">Industry Experience</div>
                </div>
              )}
            </div>

            <div className="reveal space-y-6" style={delay(0.15)}>
              <h3 className="text-2xl font-bold leading-snug text-navy lg:text-3xl">
                We design, deploy &amp; manage <span className="text-brand">modern technology solutions</span> for businesses of all sizes
              </h3>
              <p className="leading-relaxed text-slate-600">{s.aboutText1}</p>
              <p className="leading-relaxed text-slate-600">{s.aboutText2}</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {ABOUT_PILLARS.map(({ icon: Icon, title, text, tone }) => (
                  <div key={title} className="glass glass-hover rounded-xl p-4">
                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${TONE[tone].box} ${TONE[tone].glow}`}>
                      <Icon className={`h-5 w-5 ${TONE[tone].icon}`} />
                    </div>
                    <div className="mb-1 text-sm font-semibold text-navy">{title}</div>
                    <div className="text-xs text-slate-500">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-7xl" />

      {/* SERVICES */}
      <section id="services" className="py-24 lg:py-32" style={BG_UP}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <Badge icon={Layers}>What We Do</Badge>
            <h2 className="mb-4 text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Comprehensive IT infrastructure services — from single installations to complete enterprise environments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, text, tone }, i) => (
              <div key={title} className="glass glass-hover reveal group cursor-default rounded-2xl p-7" style={delay((i % 3) * 0.05)}>
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${TONE[tone].box} ${TONE[tone].glow}`}>
                  <Icon className={`h-6 w-6 ${TONE[tone].icon}`} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-navy">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{text}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2 ${TONE[tone].text}`}>
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}

            <div
              className="glass reveal flex flex-col items-center justify-center rounded-2xl p-7 text-center"
              style={{ ...delay(0.15), background: 'linear-gradient(135deg, rgb(var(--brand) / 0.12) 0%, #ffffff 100%)', borderColor: 'rgb(var(--brand) / 0.3)' }}
            >
              <div className="icon-glow mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                <PlusCircle className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-navy">Need a Custom Solution?</h3>
              <p className="mb-5 text-sm text-slate-600">Tell us your requirements and we&apos;ll engineer the perfect infrastructure for you.</p>
              <a href="#contact" className="btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="py-24 lg:py-32" style={BG_DOWN}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <Badge icon={Star}>Why Choose {name}</Badge>
            <h2 className="mb-4 text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
              The {name} <span className="gradient-text">Advantage</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              We don&apos;t just install technology — we build the backbone of your digital future.
            </p>
          </div>

          <div className="reveal mb-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Projects Completed', value: s.statProjects, counter: true },
              { label: 'Satisfied Clients', value: s.statClients, counter: true },
              { label: 'Service Areas', value: String(SERVICES.length) },
              { label: 'Uptime SLA', value: s.statUptime },
            ].map((st) => (
              <div key={st.label} className="stat-card rounded-2xl p-6 text-center">
                {st.counter ? (
                  <Counter value={st.value} className="text-4xl font-black text-navy lg:text-5xl" />
                ) : (
                  <div className="text-4xl font-black text-navy lg:text-5xl">{st.value}</div>
                )}
                <div className="mt-2 text-xs uppercase tracking-wider text-slate-500">{st.label}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map(({ icon: Icon, title, text, tone }, i) => (
              <div key={title} className="glass glass-hover reveal rounded-2xl p-7" style={delay((i % 3) * 0.07)}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${TONE[tone].box} ${TONE[tone].glow}`}>
                    <Icon className={`h-5 w-5 ${TONE[tone].icon}`} />
                  </div>
                  <div>
                    <h4 className="mb-2 font-bold text-navy">{title}</h4>
                    <p className="text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 lg:py-32" style={BG_UP}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <Badge icon={Workflow}>How We Work</Badge>
            <h2 className="text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
              Our <span className="gradient-text">Process</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent lg:block" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map(({ icon: Icon, title, text, tone }, i) => (
                <div key={title} className="glass glass-hover reveal relative rounded-2xl p-7 text-center" style={delay(i * 0.08)}>
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${tone === 'gold' ? 'border-gold/30' : 'border-brand/30'} ${TONE[tone].box} ${TONE[tone].glow}`}>
                    <Icon className={`h-7 w-7 ${TONE[tone].icon}`} />
                  </div>
                  <div className={`mb-2 font-display text-4xl font-black ${tone === 'gold' ? 'text-gold/40' : 'text-brand/30'}`}>{String(i + 1).padStart(2, '0')}</div>
                  <h4 className="mb-2 font-bold text-navy">{title}</h4>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 lg:py-32" style={BG_DOWN}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <Badge icon={Mail}>Get in Touch</Badge>
            <h2 className="mb-4 text-3xl font-black leading-tight text-navy sm:text-4xl lg:text-5xl">
              Let&apos;s Build Your <span className="gradient-text">Infrastructure</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Ready to upgrade your IT environment? Contact us for a free consultation and customized quote.
            </p>
          </div>

          <div className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wa && (
              <div className="glass glass-hover flex items-center gap-5 rounded-2xl p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/15" style={{ boxShadow: '0 6px 16px rgba(34,197,94,0.2)' }}>
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">WhatsApp / Phone</div>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy transition-colors hover:text-brand">{s.phone || `+${wa}`}</a>
                </div>
              </div>
            )}
            {s.email && (
              <div className="glass glass-hover flex items-center gap-5 rounded-2xl p-6">
                <div className="icon-glow flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <Mail className="h-6 w-6 text-brand" />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">Email</div>
                  <a href={`mailto:${s.email}`} className="break-all font-semibold text-navy transition-colors hover:text-brand">{s.email}</a>
                </div>
              </div>
            )}
            {s.website && (
              <div className="glass glass-hover flex items-center gap-5 rounded-2xl p-6">
                <div className="icon-glow flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <Globe className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">Website</div>
                  <a href={s.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy transition-colors hover:text-brand">{siteLabel}</a>
                </div>
              </div>
            )}
            {s.address && (
              <div className="glass glass-hover flex items-center gap-5 rounded-2xl p-6">
                <div className="icon-glow flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <MapPin className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">Location</div>
                  <span className="font-semibold text-navy">{s.address}</span>
                </div>
              </div>
            )}
            {(s.availabilityText || s.responseTime) && (
              <div className="glass rounded-2xl p-6">
                {s.availabilityText && (
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-sm font-semibold text-green-600">{s.availabilityText}</span>
                  </div>
                )}
                {s.responseTime && (
                  <p className="text-sm text-slate-600">
                    We typically respond within <strong className="text-navy">{s.responseTime}</strong> during business hours.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-brand/15 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Logo src={s.logo} name={name} className="mb-4 h-12 w-auto" />
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-600">{s.footerDescription}</p>
              <div className="flex items-center gap-3">
                {[
                  wa && { href: `https://wa.me/${wa}`, icon: MessageCircle, hover: 'hover:bg-green-500/15 hover:text-green-600 hover:border-green-500/30', ext: true },
                  s.email && { href: `mailto:${s.email}`, icon: Mail, hover: 'hover:bg-brand/10 hover:text-brand hover:border-brand/30' },
                  s.website && { href: s.website, icon: Globe, hover: 'hover:bg-brand/10 hover:text-brand hover:border-brand/30', ext: true },
                ]
                  .filter((x): x is { href: string; icon: typeof Mail; hover: string; ext?: boolean } => !!x)
                  .map(({ href, icon: Icon, hover, ext }) => (
                    <a
                      key={href}
                      href={href}
                      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all ${hover}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
              </div>
            </div>

            <div>
              <h5 className="mb-4 text-sm font-semibold uppercase tracking-widest text-navy">Services</h5>
              <ul className="space-y-2.5">
                {FOOTER_SERVICES.map((label) => (
                  <li key={label}>
                    <a href="#services" className="flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-brand">
                      <ChevronRight className="h-3 w-3" /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="mb-4 text-sm font-semibold uppercase tracking-widest text-navy">Contact</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                {s.phone && (
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                    <a href={`tel:${tel}`} className="transition-colors hover:text-brand">{s.phone}</a>
                  </li>
                )}
                {s.email && (
                  <li className="flex items-start gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                    <a href={`mailto:${s.email}`} className="break-all transition-colors hover:text-brand">{s.email}</a>
                  </li>
                )}
                {s.website && (
                  <li className="flex items-start gap-2.5">
                    <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand">{siteLabel}</a>
                  </li>
                )}
                {s.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                    <span>{s.address}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="section-divider mb-8" />

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
            <p className="flex items-center gap-1">
              {s.address && (<><MapPin className="h-3 w-3" /> {s.address}</>)}
              {s.address && s.email && <span>&nbsp;|&nbsp;</span>}
              {s.email && <a href={`mailto:${s.email}`} className="transition-colors hover:text-brand">{s.email}</a>}
            </p>
          </div>
        </div>
      </footer>

      <PageEffects />
    </>
  );
}
