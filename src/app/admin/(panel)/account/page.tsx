import { AccountForms } from '@/components/admin/AccountForms';
import { requireAdmin } from '@/lib/auth';

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <>
      <h1 className="mb-1 text-2xl font-black text-navy">Account</h1>
      <p className="mb-8 text-sm text-slate-600">Manage your admin sign-in credentials.</p>
      <AccountForms username={admin.username} />
    </>
  );
}
