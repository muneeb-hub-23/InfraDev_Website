import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocumentForm } from '@/components/admin/DocumentForm';
import { DOC_TYPES, isDocType, todayISO } from '@/lib/documents';
import { getSettings } from '@/lib/settings';

export default async function NewDocumentPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const type = (await searchParams).type?.toUpperCase();
  if (!isDocType(type)) notFound();
  const s = await getSettings();

  return (
    <>
      <Link href="/admin/documents" className="text-sm font-semibold text-brand hover:underline">&larr; All documents</Link>
      <h1 className="mb-6 mt-2 text-2xl font-black text-navy">New {DOC_TYPES[type].label.toLowerCase()}</h1>
      <DocumentForm
        type={type}
        values={{ date: todayISO(), customerName: '', customerAddress: '', status: 'DRAFT', terms: s.docTerms, items: [] }}
      />
    </>
  );
}
