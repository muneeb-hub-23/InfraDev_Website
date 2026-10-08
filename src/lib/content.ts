import {
  Activity, Cloud, Cpu, Database, DraftingCompass, HardDrive, Headphones, House, LayoutPanelTop, Network,
  Puzzle, Rocket, Server, Settings2, Shield, ShieldCheck, SquareCode, TrendingUp, Users, Zap, Clock, ClipboardList,
  type LucideIcon,
} from 'lucide-react';

export type Tone = 'brand' | 'gold';

export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#contact', label: 'Contact' },
];

export const HERO_ICONS: { icon: LucideIcon; label: string; tone: Tone }[] = [
  { icon: Server, label: 'Servers', tone: 'brand' },
  { icon: Network, label: 'Network', tone: 'brand' },
  { icon: ShieldCheck, label: 'Security', tone: 'brand' },
  { icon: Zap, label: 'Power', tone: 'gold' },
];

export const MARQUEE: { icon: LucideIcon; label: string; tone: Tone }[] = [
  { icon: Server, label: 'Server Infrastructure', tone: 'brand' },
  { icon: Network, label: 'Enterprise Networking', tone: 'brand' },
  { icon: SquareCode, label: 'Software Development', tone: 'brand' },
  { icon: ShieldCheck, label: 'Cybersecurity', tone: 'brand' },
  { icon: Cloud, label: 'Cloud & Virtualization', tone: 'brand' },
  { icon: House, label: 'Home & Office Automation', tone: 'brand' },
  { icon: Database, label: 'Data Center Solutions', tone: 'brand' },
  { icon: Zap, label: 'UPS & Power Solutions', tone: 'gold' },
];

export const ABOUT_POINTS: { text: string; tone: Tone }[] = [
  { text: 'End-to-end IT infrastructure design & deployment', tone: 'brand' },
  { text: 'Scalable, secure & future-ready environments', tone: 'brand' },
  { text: "Solutions tailored to each client's unique needs", tone: 'brand' },
  { text: 'From single server to enterprise data center', tone: 'brand' },
];

export const ABOUT_PILLARS: { icon: LucideIcon; title: string; text: string; tone: Tone }[] = [
  { icon: Shield, title: 'Secure by Design', text: 'Security baked into every solution', tone: 'brand' },
  { icon: TrendingUp, title: 'Scalable', text: 'Grows with your business', tone: 'brand' },
  { icon: Cpu, title: 'Future-Ready', text: "Built for tomorrow's demands", tone: 'brand' },
  { icon: Headphones, title: '24/7 Support', text: 'Always here when you need us', tone: 'gold' },
];

export const SERVICES: { icon: LucideIcon; title: string; text: string; tone: Tone; footer: string }[] = [
  { icon: LayoutPanelTop, title: 'IT Infrastructure Design & Development', text: 'Complete planning, architecture, and deployment of IT environments tailored to your business scale and goals.', tone: 'brand', footer: 'IT Infrastructure' },
  { icon: Server, title: 'Server Installation & Management', text: 'Physical and virtual server setup, configuration, performance tuning, and ongoing management for maximum uptime.', tone: 'brand', footer: 'Server Management' },
  { icon: SquareCode, title: 'Software Development & Deployment', text: 'Custom software solutions, web & desktop applications, and managed CI/CD pipelines from development to production.', tone: 'brand', footer: '' },
  { icon: Network, title: 'Enterprise Networking Solutions', text: 'LAN, WAN, wireless, VPN, and SD-WAN design and deployment for high-performance connectivity across your organization.', tone: 'brand', footer: 'Networking' },
  { icon: House, title: 'Home & Office Automation', text: 'Smart building solutions — automated lighting, HVAC, access control, CCTV, and IoT integration for homes and enterprises.', tone: 'brand', footer: '' },
  { icon: Cloud, title: 'Cloud & Virtualization Services', text: 'Private, public, and hybrid cloud setup, migration, and management. VMware, Hyper-V, and container-based environments.', tone: 'brand', footer: 'Cloud Solutions' },
  { icon: ShieldCheck, title: 'Cybersecurity & Data Protection', text: 'Firewalls, endpoint security, vulnerability assessments, compliance, and 24/7 threat monitoring to keep your data safe.', tone: 'brand', footer: 'Cybersecurity' },
  { icon: Database, title: 'Data Center Solutions', text: 'Design and build of scalable data centers: structured cabling, rack systems, cooling, power distribution, and monitoring.', tone: 'brand', footer: '' },
  { icon: HardDrive, title: 'Backup & Disaster Recovery', text: 'Automated backup strategies, off-site replication, and tested disaster recovery plans to ensure business continuity.', tone: 'brand', footer: '' },
  { icon: Zap, title: 'UPS & Power Infrastructure', text: 'UPS systems, power conditioning, surge protection, and energy management ensuring zero-downtime power for critical systems.', tone: 'gold', footer: 'UPS & Power' },
  { icon: Headphones, title: 'Technical Support & IT Consultancy', text: 'On-site and remote support, IT strategy consulting, technology roadmaps, and managed service agreements.', tone: 'brand', footer: '' },
];

export const ADVANTAGES: { icon: LucideIcon; title: string; text: string; tone: Tone }[] = [
  { icon: Puzzle, title: 'End-to-End Expertise', text: 'One partner for your entire IT stack — infrastructure, software, security, and power — eliminating vendor coordination headaches.', tone: 'brand' },
  { icon: Settings2, title: 'Tailored Solutions', text: 'No cookie-cutter installs. Every architecture is designed around your specific business requirements, budget, and growth plans.', tone: 'brand' },
  { icon: Shield, title: 'Security-First Approach', text: 'Security is never an afterthought. Every deployment follows industry best practices and compliance standards from day one.', tone: 'brand' },
  { icon: Users, title: 'Certified Professionals', text: 'Our team holds industry certifications and stays current with evolving technology landscapes to deliver modern, reliable solutions.', tone: 'brand' },
  { icon: Clock, title: '24/7 Support', text: 'Round-the-clock monitoring and support. When something needs attention, our team responds fast — because your uptime is critical.', tone: 'brand' },
  { icon: TrendingUp, title: 'Scalable Architecture', text: 'We build infrastructure that grows with you — from a single-office setup to a nationwide multi-branch enterprise network.', tone: 'gold' },
];

export const PROCESS: { icon: LucideIcon; title: string; text: string; tone: Tone }[] = [
  { icon: ClipboardList, title: 'Discover', text: 'We analyze your current infrastructure, understand your goals, and assess requirements thoroughly.', tone: 'brand' },
  { icon: DraftingCompass, title: 'Design', text: 'Our engineers craft a detailed architecture blueprint — scalable, secure, and optimized for your needs.', tone: 'brand' },
  { icon: Rocket, title: 'Deploy', text: 'Expert installation and configuration with minimal disruption to your existing operations.', tone: 'brand' },
  { icon: Activity, title: 'Manage', text: 'Ongoing monitoring, maintenance, and support to keep your infrastructure performing at its best.', tone: 'gold' },
];

export const FOOTER_SERVICES = SERVICES.filter((s) => s.footer).map((s) => s.footer);

export const TONE = {
  brand: { box: 'bg-brand/10', icon: 'text-brand', glow: 'icon-glow', text: 'text-brand' },
  gold: { box: 'bg-gold/15', icon: 'text-gold-dark', glow: 'icon-glow-gold', text: 'text-gold-dark' },
} as const;
