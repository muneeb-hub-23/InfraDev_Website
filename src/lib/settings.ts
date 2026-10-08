import { cache } from 'react';
import { db } from './db';
import { DEFAULT_SETTINGS, type SettingKey } from './settings-schema';

export type Settings = Record<SettingKey, string>;

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await db.setting.findMany();
  const out: Record<string, string> = { ...DEFAULT_SETTINGS, logo: '', favicon: '', stamp: '' };
  for (const r of rows) out[r.key] = r.value;
  return out as Settings;
});

export async function setSettings(values: Partial<Record<SettingKey, string>>) {
  await db.$transaction(
    Object.entries(values).map(([key, value]) =>
      db.setting.upsert({ where: { key }, update: { value: value ?? '' }, create: { key, value: value ?? '' } }),
    ),
  );
}
