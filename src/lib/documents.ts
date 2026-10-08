export type DocType = 'INVOICE' | 'QUOTATION';

export const DOC_TYPES: Record<DocType, { label: string; plural: string; slug: string; prefixKey: 'invoicePrefix' | 'quotationPrefix'; statuses: string[] }> = {
  INVOICE: { label: 'Invoice', plural: 'Invoices', slug: 'invoice', prefixKey: 'invoicePrefix', statuses: ['DRAFT', 'SENT', 'PAID', 'CANCELLED'] },
  QUOTATION: { label: 'Quotation', plural: 'Quotations', slug: 'quotation', prefixKey: 'quotationPrefix', statuses: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'CANCELLED'] },
};

export const isDocType = (v: unknown): v is DocType => v === 'INVOICE' || v === 'QUOTATION';

export const statusLabel = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export type ItemLike = { unitPrice: number; quantity: number };

const round2 = (n: number) => Math.round(n * 100) / 100;
export const lineTotal = (i: ItemLike) => round2(i.unitPrice * i.quantity);
export const docTotal = (items: ItemLike[]) => round2(items.reduce((sum, i) => sum + lineTotal(i), 0));
export const money = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

const pad = (n: number) => String(n).padStart(2, '0');

export function todayISO(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function displayDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}-${m}-${y}` : iso;
}

export const isISODate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/** Next number for the day: PREFIX-YYYYMMDDNN (NN = 01, 02, ...), e.g. INV-2026091401. */
export async function nextNumber(
  tx: { document: { findMany(args: { where: { number: { startsWith: string } }; select: { number: true } }): Promise<{ number: string }[]> } },
  prefix: string,
) {
  const base = `${prefix}-${todayISO().replace(/-/g, '')}`;
  const existing = await tx.document.findMany({ where: { number: { startsWith: base } }, select: { number: true } });
  const max = existing.reduce((m, d) => {
    const seq = d.number.slice(base.length);
    return /^\d+$/.test(seq) ? Math.max(m, Number(seq)) : m;
  }, 0);
  return `${base}${pad(max + 1)}`;
}
