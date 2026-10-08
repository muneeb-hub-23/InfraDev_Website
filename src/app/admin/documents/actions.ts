'use server';

import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { DOC_TYPES, isDocType, isISODate, nextNumber } from '@/lib/documents';
import { getSettings } from '@/lib/settings';
import type { FormState } from '../actions';

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '');

type Parsed = {
  date: string;
  customerName: string;
  customerAddress: string;
  status: string;
  terms: string;
  items: { position: number; description: string; unitPrice: number; quantity: number }[];
};

function parse(fd: FormData, statuses: string[]): Parsed | string {
  const date = str(fd, 'date').trim();
  const customerName = str(fd, 'customerName').trim();
  const customerAddress = str(fd, 'customerAddress').trim();
  const status = str(fd, 'status');
  const terms = str(fd, 'terms').trim();

  if (!isISODate(date)) return 'Enter a valid date.';
  if (!customerName) return 'Customer name (To) is required.';
  if (customerName.length > 150) return 'Customer name is too long (max 150 characters).';
  if (customerAddress.length > 300) return 'Customer address is too long (max 300 characters).';
  if (terms.length > 1000) return 'Terms are too long (max 1000 characters).';
  if (!statuses.includes(status)) return 'Invalid status.';

  const desc = fd.getAll('description').map(String);
  const prices = fd.getAll('unitPrice').map(String);
  const qtys = fd.getAll('quantity').map(String);
  const items: Parsed['items'] = [];

  for (let i = 0; i < desc.length; i++) {
    const description = desc[i].trim();
    if (!description && !prices[i]?.trim()) continue;
    const unitPrice = Number(prices[i]);
    const quantity = Number(qtys[i]);
    const row = items.length + 1;
    if (!description) return `Item ${row}: description is required.`;
    if (description.length > 300) return `Item ${row}: description is too long (max 300 characters).`;
    if (!Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 1e9) return `Item ${row}: enter a valid unit price.`;
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 1e6) return `Item ${row}: enter a valid quantity.`;
    items.push({ position: row, description, unitPrice, quantity });
  }
  if (items.length === 0) return 'Add at least one item.';
  return { date, customerName, customerAddress, status, terms, items };
}

export async function createDocument(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const type = str(fd, 'type');
  if (!isDocType(type)) return { error: 'Unknown document type.' };
  const parsed = parse(fd, DOC_TYPES[type].statuses);
  if (typeof parsed === 'string') return { error: parsed };

  const prefix = (await getSettings())[DOC_TYPES[type].prefixKey].trim() || DOC_TYPES[type].slug.slice(0, 3).toUpperCase();
  const { items, ...data } = parsed;

  let id: number | undefined;
  for (let attempt = 0; attempt < 5 && !id; attempt++) {
    try {
      const doc = await db.$transaction(async (tx) => {
        const number = await nextNumber(tx, prefix);
        return tx.document.create({ data: { ...data, type, number, items: { create: items } } });
      });
      id = doc.id;
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')) throw e;
    }
  }
  if (!id) return { error: 'Could not generate a unique document number. Please try again.' };

  revalidatePath('/admin/documents');
  redirect(`/admin/documents/${id}`);
}

export async function updateDocument(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(str(fd, 'id'));
  const existing = Number.isInteger(id) ? await db.document.findUnique({ where: { id } }) : null;
  if (!existing || !isDocType(existing.type)) return { error: 'Document not found.' };
  const parsed = parse(fd, DOC_TYPES[existing.type].statuses);
  if (typeof parsed === 'string') return { error: parsed };

  const { items, ...data } = parsed;
  await db.$transaction([
    db.documentItem.deleteMany({ where: { documentId: id } }),
    db.document.update({ where: { id }, data: { ...data, items: { create: items } } }),
  ]);

  revalidatePath('/admin/documents');
  revalidatePath(`/admin/documents/${id}`);
  redirect(`/admin/documents/${id}`);
}
