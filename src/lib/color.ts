export const HEX_RE = /^#[0-9a-fA-F]{6}$/;

type RGB = [number, number, number];

function parse(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)) as RGB;
}

const triplet = (c: RGB) => c.join(' ');

export function colorVars(brand: string, accent: string, fallback: { brand: string; accent: string }) {
  const b = parse(HEX_RE.test(brand) ? brand : fallback.brand);
  const a = parse(HEX_RE.test(accent) ? accent : fallback.accent);
  const white: RGB = [255, 255, 255];
  const black: RGB = [0, 0, 0];
  return {
    '--brand': triplet(b),
    '--brand-light': triplet(mix(b, white, 0.35)),
    '--brand-dark': triplet(mix(b, black, 0.22)),
    '--gold': triplet(a),
    '--gold-light': triplet(mix(a, white, 0.3)),
    '--gold-dark': triplet(mix(a, black, 0.25)),
  } as Record<string, string>;
}
