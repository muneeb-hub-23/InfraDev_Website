import { Globe, Mail, MapPin, MessageCircle, Network, Server, ShieldCheck, SquareCode, Zap } from 'lucide-react';
import { DOC_TYPES, displayDate, docTotal, lineTotal, money, type DocType } from '@/lib/documents';
import type { Settings } from '@/lib/settings';

export type SheetDoc = {
  type: DocType;
  number: string;
  date: string;
  customerName: string;
  customerAddress: string;
  terms: string;
  items: { description: string; unitPrice: number; quantity: number }[];
};

const SERVICES = [
  { icon: Server, label: 'Servers &\nData Centers' },
  { icon: SquareCode, label: 'Software\nSolutions' },
  { icon: Network, label: 'Networking &\nConnectivity' },
  { icon: ShieldCheck, label: 'Security &\nInfrastructure' },
  { icon: Zap, label: 'Power & Energy\nSolutions' },
];

const lines = (v: string) => v.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-end gap-3">
      <span className="w-[16mm] flex-shrink-0 text-[10.5pt] text-slate-800">{label}</span>
      <span className="min-h-[6mm] flex-1 border-b border-slate-900 px-1 text-[10pt] text-slate-900">{value}</span>
    </div>
  );
}

export function DocumentSheet({ doc, s }: { doc: SheetDoc; s: Settings }) {
  const title = DOC_TYPES[doc.type].label.toUpperCase();
  const total = docTotal(doc.items);
  const contacts = [
    s.docPhone && { icon: MessageCircle, text: s.docPhone },
    s.docEmail && { icon: Mail, text: s.docEmail },
    s.website && { icon: Globe, text: s.website.replace(/^https?:\/\//, '').replace(/\/$/, '') },
  ].filter((c): c is { icon: typeof Mail; text: string } => !!c);
  const cell = 'border border-slate-900 px-2 py-[1.2mm]';

  return (
    <div className="doc-sheet relative mx-auto flex min-h-[296mm] w-[210mm] flex-col overflow-hidden bg-white text-slate-900 shadow-lg print:shadow-none">
      {s.logo && (
        <div
          className="pointer-events-none absolute left-1/2 top-[46%] w-[150mm] -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-[0.06]"
          style={{ aspectRatio: '924 / 510' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.logo} alt="" className="w-full" />
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col px-[11mm] pt-[8mm]">
        <header className="flex items-start justify-between gap-6">
          <div className="flex flex-1 justify-center pl-[12mm] pt-1">
            {s.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logo} alt={s.companyName} className="h-[44mm] w-auto" />
            ) : (
              <span className="font-display text-4xl font-bold text-navy">{s.companyName}</span>
            )}
          </div>
          <div className="w-[68mm] flex-shrink-0 space-y-[2.2mm] pt-[4mm]">
            <MetaRow label="NTN:" value={s.ntn} />
            <MetaRow label="Date:" value={displayDate(doc.date)} />
            <MetaRow label="Doc#" value={doc.number} />
            <MetaRow label="To:" value={doc.customerName} />
            {doc.customerAddress && <p className="whitespace-pre-line pl-[19mm] text-[8.5pt] text-slate-700">{doc.customerAddress}</p>}
          </div>
        </header>

        <table className="mt-[3mm] w-full border-collapse text-[9pt]">
          <thead>
            <tr><th colSpan={5} className={`${cell} text-center font-semibold`}>{title}</th></tr>
            <tr className="text-center font-semibold">
              <th className={`${cell} w-[13mm]`}>SR #</th>
              <th className={cell}>ITEM</th>
              <th className={`${cell} w-[30mm]`}>UNIT PRICE</th>
              <th className={`${cell} w-[20mm]`}>QTY</th>
              <th className={`${cell} w-[28mm]`}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((i, n) => (
              <tr key={n}>
                <td className={`${cell} text-center`}>{n + 1}.</td>
                <td className={`${cell} whitespace-pre-line`}>{i.description}</td>
                <td className={`${cell} text-center`}>{money(i.unitPrice)}</td>
                <td className={`${cell} text-center`}>{money(i.quantity)}</td>
                <td className={`${cell} text-center`}>{money(lineTotal(i))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} />
              <td className={`${cell} text-center font-bold`}>TOTAL</td>
              <td className={`${cell} text-center font-bold`}>{money(total)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="flex flex-1 flex-col justify-end pb-[16mm] pt-[10mm]">
          {s.stamp && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.stamp} alt="Company stamp" className="mb-[2mm] ml-[6mm] flex-none self-start object-contain mix-blend-multiply" style={{ height: '28mm', width: '28mm', maxWidth: '28mm' }} />
          )}
          <div className="grid grid-cols-2 gap-6 text-[8.5pt] font-semibold leading-snug">
            <div className="pl-[2mm]">
              <p>Regards,</p>
              <p className="pl-[12mm]">{s.docRegards}</p>
            </div>
            <div className="pl-[6mm]">
              {lines(doc.terms).map((l, n) => <p key={`t${n}`}>{l}</p>)}
              {lines(s.docBankDetails).map((l, n) => <p key={`b${n}`}>{l}</p>)}
            </div>
          </div>
        </div>

        <footer className="pb-[8mm]">
          <div className="mx-auto grid max-w-[170mm] grid-cols-5 divide-x divide-slate-200 pb-[5mm] text-center text-slate-300">
            {SERVICES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 px-1">
                <Icon className="h-8 w-8" strokeWidth={1.5} />
                <span className="whitespace-pre-line text-[6.5pt] font-semibold uppercase leading-tight tracking-wide">{label}</span>
              </div>
            ))}
          </div>
          <div className="mx-auto mb-[4mm] h-px max-w-[170mm] bg-slate-200" />
          <div className="mx-auto flex max-w-[180mm] items-center justify-center divide-x divide-slate-300 text-[9pt] font-medium">
            {contacts.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-5">
                <span className="flex h-[7mm] w-[7mm] items-center justify-center rounded-full bg-navy text-white"><Icon className="h-3.5 w-3.5" /></span>
                {text}
              </div>
            ))}
          </div>
          {s.docAddress && (
            <div className="mt-[4mm] flex flex-col items-center gap-1 text-center text-[9.5pt] font-semibold">
              <span className="flex h-[6mm] w-[6mm] items-center justify-center rounded-full bg-navy text-white"><MapPin className="h-3 w-3" /></span>
              <span className="whitespace-pre-line">{s.docAddress}</span>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
