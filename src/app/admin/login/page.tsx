import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { Logo } from '@/components/Logo';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Admin login', robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdmin()) redirect('/admin/settings');
  const s = await getSettings();
  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo src={s.logo} name={s.companyName} className="h-20 w-auto" />
          <h1 className="text-xl font-bold text-navy">Admin sign in</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
