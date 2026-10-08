import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { DocumentSheet } from '@/components/admin/DocumentSheet';
import { PrintButton } from '@/components/admin/PrintButton';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { db } from '@/lib/db';
import { DOC_TYPES, isDocType } from '@/lib/documents';
import { getSettings } from '@/lib/settings';

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const doc = Number.isInteger(id) ? await db.document.findUnique({ where: { id }, include: { items: { orderBy: { position: 'asc' } } } }) : null;
  if (!doc || !isDocType(doc.type)) notFound();
  const s = await getSettings();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <Link href="/admin/documents" className="text-sm font-semibold text-brand hover:underline">&larr; All documents</Link>
          <h1 className="mt-2 flex items-center gap-3 text-2xl font-black text-navy">
            {DOC_TYPES[doc.type].label} {doc.number} <StatusBadge status={doc.status} />
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/documents/${doc.id}/edit`} className="btn-outline flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <PrintButton />
        </div>
      </div>
      <div className="overflow-x-auto pb-4 print:overflow-visible print:pb-0">
        <DocumentSheet doc={{ ...doc, type: doc.type }} s={s} />
      </div>
    </>
  );
}
