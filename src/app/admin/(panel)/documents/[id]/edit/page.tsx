import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocumentForm } from '@/components/admin/DocumentForm';
import { DOC_TYPES, isDocType } from '@/lib/documents';
import { db } from '@/lib/db';

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const doc = Number.isInteger(id) ? await db.document.findUnique({ where: { id }, include: { items: { orderBy: { position: 'asc' } } } }) : null;
  if (!doc || !isDocType(doc.type)) notFound();

  return (
    <>
      <Link href={`/admin/documents/${doc.id}`} className="text-sm font-semibold text-brand hover:underline">&larr; Back to {doc.number}</Link>
      <h1 className="mb-6 mt-2 text-2xl font-black text-navy">Edit {DOC_TYPES[doc.type].label.toLowerCase()}</h1>
      <DocumentForm
        type={doc.type}
        values={{
          id: doc.id,
          number: doc.number,
          date: doc.date,
          customerName: doc.customerName,
          customerAddress: doc.customerAddress,
          status: doc.status,
          terms: doc.terms,
          items: doc.items.map((i) => ({ description: i.description, unitPrice: i.unitPrice, quantity: i.quantity })),
        }}
      />
    </>
  );
}
