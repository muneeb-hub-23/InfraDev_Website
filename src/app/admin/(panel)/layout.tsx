import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, FileText, KeyRound, LogOut, Settings } from 'lucide-react';
import { logout } from '../actions';
import { Logo } from '@/components/Logo';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/settings';

export const metadata: Metadata = { title: 'Admin panel', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const s = await getSettings();
  const link = 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand/10 hover:text-brand';

  return (
    <div className="min-h-screen bg-surface lg:flex print:block print:bg-white">
      <aside className="print:hidden border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:flex-shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <Logo src={s.logo} name={s.companyName} className="h-10 w-auto" />
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Admin</div>
        </div>
        <nav className="flex gap-1 p-3 lg:flex-col">
          <Link href="/admin/documents" className={link}><FileText className="h-4 w-4" /> Quotations &amp; Invoices</Link>
          <Link href="/admin/settings" className={link}><Settings className="h-4 w-4" /> Site settings</Link>
          <Link href="/admin/account" className={link}><KeyRound className="h-4 w-4" /> Account</Link>
          <a href="/" target="_blank" className={link}><ExternalLink className="h-4 w-4" /> View website</a>
        </nav>
        <div className="hidden border-t border-slate-100 p-4 lg:block">
          <div className="mb-3 text-xs text-slate-500">Signed in as <strong className="text-navy">{admin.username}</strong></div>
          <form action={logout}>
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"><LogOut className="h-4 w-4" /> Sign out</button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-5 sm:p-8 print:p-0">
        <div className="mx-auto max-w-5xl print:max-w-none">
          {admin.mustChangePassword && (
            <div className="mb-6 rounded-lg border border-amber-300 print:hidden bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You are using the default password. Please <Link href="/admin/account" className="font-semibold underline">change it now</Link>.
            </div>
          )}
          {children}
          <form action={logout} className="mt-10 lg:hidden print:hidden">
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"><LogOut className="h-4 w-4" /> Sign out</button>
          </form>
        </div>
      </main>
    </div>
  );
}
