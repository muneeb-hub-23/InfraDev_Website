import Link from 'next/link';
import { Plus } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { db } from '@/lib/db';
import { DOC_TYPES, displayDate, docTotal, isDocType, money } from '@/lib/documents';

const PAGE_SIZE = 25;

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ type?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const type = sp.type?.toUpperCase();
  const q = (sp.q ?? '').trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const where = {
    ...(isDocType(type) ? { type } : {}),
    ...(q ? { OR: [{ number: { contains: q } }, { customerName: { contains: q } }] } : {}),
  };
  const [docs, count] = await Promise.all([
    db.document.findMany({
      where,
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { items: { select: { unitPrice: true, quantity: true } } },
    }),
    db.document.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const href = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { type: isDocType(type) ? type : undefined, q: q || undefined, page: undefined, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const qs = p.toString();
    return `/admin/documents${qs ? `?${qs}` : ''}`;
  };
  const tab = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${active ? 'bg-brand text-white' : 'bg-white text-slate-600 hover:bg-brand/10 hover:text-brand'}`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-black text-navy">Quotations &amp; Invoices</h1>
          <p className="text-sm text-slate-600">Numbers are generated automatically. Documents can be edited but not deleted.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/documents/new?type=quotation" className="btn-outline flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Quotation</Link>
          <Link href="/admin/documents/new?type=invoice" className="btn-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Invoice</Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href={href({ type: undefined })} className={tab(!isDocType(type))}>All</Link>
        <Link href={href({ type: 'INVOICE' })} className={tab(type === 'INVOICE')}>Invoices</Link>
        <Link href={href({ type: 'QUOTATION' })} className={tab(type === 'QUOTATION')}>Quotations</Link>
        <form action="/admin/documents" className="ml-auto flex gap-2">
          {isDocType(type) && <input type="hidden" name="type" value={type} />}
          <input name="q" defaultValue={q} placeholder="Search number or customer" className="field-input w-64" />
          <button className="btn-outline rounded-lg px-4 py-2 text-sm font-semibold">Search</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Number</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">To</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No documents yet.</td></tr>
            )}
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-navy"><Link href={`/admin/documents/${d.id}`} className="hover:text-brand">{d.number}</Link></td>
                <td className="px-4 py-3">{isDocType(d.type) ? DOC_TYPES[d.type].label : d.type}</td>
                <td className="px-4 py-3">{displayDate(d.date)}</td>
                <td className="px-4 py-3">{d.customerName}</td>
                <td className="px-4 py-3 text-right font-semibold">{money(docTotal(d.items))}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/admin/documents/${d.id}`} className="font-semibold text-brand hover:underline">View</Link>
                  <span className="mx-2 text-slate-300">|</span>
                  <Link href={`/admin/documents/${d.id}/edit`} className="font-semibold text-brand hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {page} of {pages} ({count} documents)</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={href({ page: String(page - 1) })} className="btn-outline rounded-lg px-3 py-1.5 font-semibold">Previous</Link>}
            {page < pages && <Link href={href({ page: String(page + 1) })} className="btn-outline rounded-lg px-3 py-1.5 font-semibold">Next</Link>}
          </div>
        </div>
      )}
    </>
  );
}
