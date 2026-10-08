'use client';

import { Plus, X } from 'lucide-react';
import { useActionState, useState } from 'react';
import { createDocument, updateDocument } from '@/app/admin/documents/actions';
import { DOC_TYPES, docTotal, money, statusLabel, type DocType } from '@/lib/documents';
import { Notice, SubmitButton } from './FormParts';

type Row = { key: number; description: string; unitPrice: string; quantity: string };

export type DocumentFormValues = {
  id?: number;
  number?: string;
  date: string;
  customerName: string;
  customerAddress: string;
  status: string;
  terms: string;
  items: { description: string; unitPrice: number; quantity: number }[];
};

export function DocumentForm({ type, values }: { type: DocType; values: DocumentFormValues }) {
  const editing = values.id !== undefined;
  const [state, action] = useActionState(editing ? updateDocument : createDocument, undefined);
  const [nextKey, setNextKey] = useState(values.items.length + 1);
  const [rows, setRows] = useState<Row[]>(
    values.items.length
      ? values.items.map((i, n) => ({ key: n, description: i.description, unitPrice: String(i.unitPrice), quantity: String(i.quantity) }))
      : [{ key: 0, description: '', unitPrice: '', quantity: '1' }],
  );
  const [f, setF] = useState({ date: values.date, customerName: values.customerName, customerAddress: values.customerAddress, status: values.status, terms: values.terms });
  const set = (patch: Partial<typeof f>) => setF((x) => ({ ...x, ...patch }));
  const meta = DOC_TYPES[type];

  const update = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const total = docTotal(rows.map((r) => ({ unitPrice: Number(r.unitPrice) || 0, quantity: Number(r.quantity) || 0 })));

  return (
    <form action={action} className="space-y-6">
      {editing ? <input type="hidden" name="id" value={values.id} /> : <input type="hidden" name="type" value={type} />}

      <section className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <label className="field-label">{meta.label} number</label>
          <input value={values.number ?? 'Generated automatically on save'} readOnly disabled className="field-input bg-slate-50 text-slate-500" />
        </div>
        <div>
          <label htmlFor="date" className="field-label">Date</label>
          <input id="date" name="date" type="date" required value={f.date} onChange={(e) => set({ date: e.target.value })} className="field-input" />
        </div>
        <div>
          <label htmlFor="customerName" className="field-label">To (customer / company) <span className="text-red-500">*</span></label>
          <input id="customerName" name="customerName" required maxLength={150} value={f.customerName} onChange={(e) => set({ customerName: e.target.value })} className="field-input" />
        </div>
        <div>
          <label htmlFor="status" className="field-label">Status</label>
          <select id="status" name="status" value={f.status} onChange={(e) => set({ status: e.target.value })} className="field-input">
            {meta.statuses.map((s) => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="customerAddress" className="field-label">Customer address (optional)</label>
          <textarea id="customerAddress" name="customerAddress" rows={2} maxLength={300} value={f.customerAddress} onChange={(e) => set({ customerAddress: e.target.value })} className="field-input" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-bold text-navy">Items</h2>
        <div className="space-y-3">
          <div className="hidden grid-cols-[2rem_1fr_8rem_6rem_7rem_2rem] gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">
            <span>#</span><span>Item</span><span>Unit price</span><span>Qty</span><span className="text-right">Total</span><span />
          </div>
          {rows.map((r, i) => {
            const t = docTotal([{ unitPrice: Number(r.unitPrice) || 0, quantity: Number(r.quantity) || 0 }]);
            return (
              <div key={r.key} className="grid grid-cols-2 items-center gap-3 md:grid-cols-[2rem_1fr_8rem_6rem_7rem_2rem]">
                <span className="hidden text-sm text-slate-500 md:block">{i + 1}.</span>
                <input name="description" value={r.description} onChange={(e) => update(r.key, { description: e.target.value })} placeholder="Item description" maxLength={300} aria-label="Item description" className="field-input col-span-2 md:col-span-1" />
                <input name="unitPrice" value={r.unitPrice} onChange={(e) => update(r.key, { unitPrice: e.target.value })} placeholder="Unit price" inputMode="decimal" aria-label="Unit price" className="field-input" />
                <input name="quantity" value={r.quantity} onChange={(e) => update(r.key, { quantity: e.target.value })} placeholder="Qty" inputMode="decimal" aria-label="Quantity" className="field-input" />
                <div className="text-right text-sm font-semibold text-navy">{money(t)}</div>
                <button
                  type="button"
                  aria-label="Remove item"
                  disabled={rows.length === 1}
                  onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setRows((rs) => [...rs, { key: nextKey, description: '', unitPrice: '', quantity: '1' }]);
              setNextKey((k) => k + 1);
            }}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
          <div className="text-sm text-slate-600">Total: <strong className="ml-1 text-lg text-navy">{money(total)}</strong></div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <label htmlFor="terms" className="field-label">Terms (printed on the document)</label>
        <textarea id="terms" name="terms" rows={3} maxLength={1000} value={f.terms} onChange={(e) => set({ terms: e.target.value })} className="field-input" />
        <p className="field-hint">One per line. Business address, contact details, regards and bank details come from Site settings.</p>
      </section>

      <Notice state={state} />
      <SubmitButton>{editing ? 'Save changes' : `Create ${meta.label.toLowerCase()}`}</SubmitButton>
    </form>
  );
}
