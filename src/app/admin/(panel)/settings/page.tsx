import Link from 'next/link';
import { AssetUpload } from '@/components/admin/AssetUpload';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/settings';
import { GROUPS } from '@/lib/settings-schema';

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const group = GROUPS.find((g) => g.id === tab) ?? GROUPS[0];
  const s = await getSettings();

  return (
    <>
      <h1 className="mb-1 text-2xl font-black text-navy">Site settings</h1>
      <p className="mb-6 text-sm text-slate-600">Changes appear on the public website immediately after saving.</p>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {GROUPS.map((g) => (
          <Link
            key={g.id}
            href={`/admin/settings?tab=${g.id}`}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              g.id === group.id ? 'bg-brand text-white' : 'bg-white text-slate-600 hover:bg-brand/10 hover:text-brand'
            }`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-navy">{group.label}</h2>
        <p className="mb-6 text-sm text-slate-500">{group.description}</p>
        <SettingsForm key={group.id} group={group.id} fields={group.fields.map(({ pattern: _pattern, ...f }) => f)} values={s} />
      </section>

      {group.id === 'branding' && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <AssetUpload kind="logo" label="Logo" current={s.logo} accept=".png,.jpg,.jpeg,.webp,.svg" hint="PNG, JPG, WebP or SVG, up to 2 MB. A transparent or white background works best on the light theme." />
          <AssetUpload kind="favicon" label="Favicon" current={s.favicon} accept=".ico,.png,.svg" hint="ICO, PNG or SVG, up to 512 KB. Square images work best." />
          <AssetUpload kind="stamp" label="Company stamp" current={s.stamp} accept=".png,.jpg,.jpeg,.webp,.svg" hint="Printed on quotations and invoices. A transparent PNG works best." />
        </div>
      )}
    </>
  );
}
