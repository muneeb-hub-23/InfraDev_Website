// First-run data setup. Idempotent: safe to run on every start.
//  - inserts default settings (only keys that do not exist yet)
//  - copies the bundled logo / favicon into the uploads folder and registers them in settings
//  - creates the first admin user when none exists
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  process.loadEnvFile(path.join(root, '.env'));
} catch {}

const dataDir = path.resolve(process.env.DATA_DIR || path.join(root, 'storage'));
const uploadDir = path.join(dataDir, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const db = new PrismaClient({ datasourceUrl: `file:${path.join(dataDir, 'infradev.db')}` });
const seed = JSON.parse(fs.readFileSync(path.join(root, 'prisma', 'seed-data.json'), 'utf8'));

async function getSetting(key) {
  return (await db.setting.findUnique({ where: { key } }))?.value ?? '';
}

async function main() {
  for (const [key, value] of Object.entries(seed.settings)) {
    await db.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  for (const asset of Object.values(seed.assets)) {
    const current = await getSetting(asset.settingKey);
    const src = path.join(root, asset.source);
    if (current && fs.existsSync(path.join(uploadDir, path.basename(current)))) continue;
    if (!fs.existsSync(src)) {
      console.warn(`[seed] asset not found, skipped: ${asset.source}`);
      continue;
    }
    fs.copyFileSync(src, path.join(uploadDir, asset.target));
    const value = `/uploads/${asset.target}`;
    await db.setting.upsert({ where: { key: asset.settingKey }, update: { value }, create: { key: asset.settingKey, value } });
    console.log(`[seed] imported ${asset.source} -> ${value}`);
  }

  if ((await db.adminUser.count()) === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    await db.adminUser.create({
      data: { username, passwordHash: await bcrypt.hash(password, 12), mustChangePassword: true },
    });
    console.log(`[seed] created admin user "${username}" (password must be changed on first login)`);
  }

  console.log('[seed] done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
