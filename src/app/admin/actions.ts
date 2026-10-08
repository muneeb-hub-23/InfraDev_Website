'use server';

import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import seed from '../../../prisma/seed-data.json';
import { HEX_RE } from '@/lib/color';
import {
  clearFailures, createSession, destroySession, isLocked, recordFailure, requireAdmin,
} from '@/lib/auth';
import { db } from '@/lib/db';
import { UPLOAD_DIR } from '@/lib/paths';
import { getSettings, setSettings } from '@/lib/settings';
import { GROUPS, type Field, type SettingKey } from '@/lib/settings-schema';

export type FormState = { ok?: boolean; error?: string; message?: string; username?: string } | undefined;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? '');
const refresh = () => revalidatePath('/', 'layout');

// ---------------------------------------------------------------- auth

let dummyHash: string | undefined;
const getDummyHash = async () => (dummyHash ??= await bcrypt.hash('not-a-real-password', 12));

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const username = str(fd, 'username').trim().toLowerCase();
  const password = str(fd, 'password');
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const key = `${ip}|${username}`;

  if (isLocked(key)) return { error: 'Too many failed attempts. Try again in 15 minutes.', username };

  const user = await db.adminUser.findUnique({ where: { username } });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !valid) {
    recordFailure(key);
    return { error: 'Invalid username or password.', username };
  }

  clearFailures(key);
  await createSession(user);
  redirect('/admin/settings');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const current = str(fd, 'current');
  const next = str(fd, 'next');
  const confirm = str(fd, 'confirm');

  if (!(await bcrypt.compare(current, admin.passwordHash))) return { error: 'Current password is incorrect.' };
  if (next.length < 8) return { error: 'New password must be at least 8 characters.' };
  if (next === current) return { error: 'New password must differ from the current one.' };
  if (next !== confirm) return { error: 'Password confirmation does not match.' };

  const updated = await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(next, 12), mustChangePassword: false },
  });
  await createSession(updated);
  revalidatePath('/admin', 'layout');
  return { ok: true, message: 'Password updated.' };
}

export async function changeUsername(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const username = str(fd, 'username').trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) return { error: 'Username must be 3–32 characters (letters, digits, . _ -).' };
  const clash = await db.adminUser.findUnique({ where: { username } });
  if (clash && clash.id !== admin.id) return { error: 'That username is already taken.' };
  await db.adminUser.update({ where: { id: admin.id }, data: { username } });
  revalidatePath('/admin', 'layout');
  return { ok: true, message: 'Username updated.' };
}

// ---------------------------------------------------------------- settings

function validate(field: Field, raw: string): string | null {
  const v = raw.trim();
  if (!v) return field.required ? `${field.label} is required.` : null;
  if (field.max && v.length > field.max) return `${field.label} must be at most ${field.max} characters.`;
  switch (field.type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : `${field.label} is not a valid email.`;
    case 'url':
      try {
        const u = new URL(v);
        return u.protocol === 'http:' || u.protocol === 'https:' ? null : `${field.label} must start with http:// or https://.`;
      } catch {
        return `${field.label} is not a valid URL.`;
      }
    case 'tel':
      return /^[+\d\s()-]+$/.test(v) ? null : `${field.label} may contain only digits, spaces, + ( ) -.`;
    case 'text':
      return !field.pattern || field.pattern.test(v) ? null : `${field.label} is invalid. ${field.patternHint ?? ''}`.trim();
    case 'color':
      return HEX_RE.test(v) ? null : `${field.label} must be a hex color like #1e6fc8.`;
    case 'number':
      return /^\d{1,9}$/.test(v) ? null : `${field.label} must be a whole number.`;
    default:
      return null;
  }
}

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const group = GROUPS.find((g) => g.id === str(fd, 'group'));
  if (!group) return { error: 'Unknown settings group.' };

  const values: Partial<Record<SettingKey, string>> = {};
  const errors: string[] = [];
  for (const f of group.fields) {
    const raw = str(fd, f.key);
    const err = validate(f, raw);
    if (err) errors.push(err);
    else values[f.key] = raw.trim();
  }
  if (errors.length) return { error: errors.join(' ') };

  await setSettings(values);
  refresh();
  return { ok: true, message: `${group.label} settings saved.` };
}

// ---------------------------------------------------------------- uploads

type Kind = 'logo' | 'favicon' | 'stamp';
const RULES: Record<Kind, { exts: string[]; maxBytes: number }> = {
  logo: { exts: ['png', 'jpg', 'jpeg', 'webp', 'svg'], maxBytes: 2 * 1024 * 1024 },
  favicon: { exts: ['ico', 'png', 'svg'], maxBytes: 512 * 1024 },
  stamp: { exts: ['png', 'jpg', 'jpeg', 'webp', 'svg'], maxBytes: 2 * 1024 * 1024 },
};
const LABELS: Record<Kind, string> = { logo: 'Logo', favicon: 'Favicon', stamp: 'Stamp' };

function matchesSignature(ext: string, b: Buffer) {
  switch (ext) {
    case 'png': return b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    case 'jpg':
    case 'jpeg': return b.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    case 'webp': return b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP';
    case 'ico': return b.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0]));
    case 'svg': {
      const t = b.toString('utf8').toLowerCase();
      return t.includes('<svg') && !t.includes('<script') && !/\son\w+\s*=/.test(t);
    }
    default: return false;
  }
}

async function removeOld(url: string) {
  const name = path.basename(url);
  if (!url.startsWith('/uploads/') || name.includes('-initial.')) return;
  await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
}

export async function uploadAsset(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const kind = str(fd, 'kind') as Kind;
  const rule = RULES[kind];
  const file = fd.get('file');
  if (!rule) return { error: 'Unknown asset type.' };
  if (!(file instanceof File) || file.size === 0) return { error: 'Choose a file to upload.' };
  if (file.size > rule.maxBytes) return { error: `File is too large (max ${rule.maxBytes / 1024} KB).` };

  const ext = path.extname(file.name).slice(1).toLowerCase();
  if (!rule.exts.includes(ext)) return { error: `Allowed file types: ${rule.exts.join(', ')}.` };
  const buf = Buffer.from(await file.arrayBuffer());
  if (!matchesSignature(ext, buf)) return { error: 'File content does not match its extension.' };

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${kind}-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);

  const old = (await getSettings())[kind];
  await setSettings({ [kind]: `/uploads/${name}` });
  if (old) await removeOld(old);
  refresh();
  return { ok: true, message: `${LABELS[kind]} updated.` };
}

export async function resetAsset(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const kind = str(fd, 'kind') as Kind;
  if (kind === 'stamp' && str(fd, 'mode') === 'remove') {
    const old = (await getSettings()).stamp;
    await setSettings({ stamp: '' });
    if (old) await removeOld(old);
    refresh();
    return { ok: true, message: 'Stamp removed.' };
  }
  const asset = seed.assets[kind];
  if (!asset) return { error: 'Unknown asset type.' };
  try {
    await fs.access(path.join(UPLOAD_DIR, asset.target));
  } catch {
    return { error: 'The original file is not available.' };
  }
  const old = (await getSettings())[kind];
  await setSettings({ [kind]: `/uploads/${asset.target}` });
  if (old) await removeOld(old);
  refresh();
  return { ok: true, message: 'Restored the original file.' };
}
