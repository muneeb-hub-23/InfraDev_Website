import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { db } from './db';
import { DATA_DIR } from './paths';

const COOKIE = 'infradev_session';
const MAX_AGE = 60 * 60 * 8;

let secretCache: Uint8Array | null = null;

function getSecret() {
  if (secretCache) return secretCache;
  let secret = process.env.SESSION_SECRET?.trim();
  if (!secret) {
    const file = path.join(DATA_DIR, '.session_secret');
    fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(file)) fs.writeFileSync(file, randomBytes(32).toString('hex'), { mode: 0o600 });
    secret = fs.readFileSync(file, 'utf8').trim();
  }
  return (secretCache = new TextEncoder().encode(secret));
}

const fingerprint = (hash: string) => hash.slice(-12);

export async function createSession(user: { id: number; passwordHash: string }) {
  const token = await new SignJWT({ v: fingerprint(user.passwordHash) })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
  const h = await headers();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: h.get('x-forwarded-proto') === 'https',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
    const user = await db.adminUser.findUnique({ where: { id: Number(payload.sub) } });
    return user && fingerprint(user.passwordHash) === payload.v ? user : null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function isLocked(key: string) {
  const a = attempts.get(key);
  return !!a && a.until > Date.now();
}

export function recordFailure(key: string) {
  const a = attempts.get(key);
  const count = a && a.until === 0 ? a.count + 1 : 1;
  attempts.set(key, { count, until: count >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0 });
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
