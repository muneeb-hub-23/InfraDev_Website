export function Logo({ src, name, className = '' }: { src: string; name: string; className?: string }) {
  if (!src) return <span className={`font-display text-2xl font-bold text-navy ${className}`}>{name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${name} logo`} className={className} />;
}
