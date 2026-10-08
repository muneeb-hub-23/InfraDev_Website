'use client';

import { useActionState } from 'react';
import { changePassword, changeUsername } from '@/app/admin/actions';
import { Notice, SubmitButton } from './FormParts';

export function AccountForms({ username }: { username: string }) {
  const [pwState, pwAction] = useActionState(changePassword, undefined);
  const [unState, unAction] = useActionState(changeUsername, undefined);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form action={unAction} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-bold text-navy">Username</h3>
        <div>
          <label htmlFor="username" className="field-label">Username</label>
          <input id="username" name="username" defaultValue={username} required minLength={3} maxLength={32} autoComplete="username" className="field-input" />
        </div>
        <Notice state={unState} />
        <SubmitButton>Update username</SubmitButton>
      </form>

      <form action={pwAction} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-bold text-navy">Change password</h3>
        <div>
          <label htmlFor="current" className="field-label">Current password</label>
          <input id="current" name="current" type="password" required autoComplete="current-password" className="field-input" />
        </div>
        <div>
          <label htmlFor="next" className="field-label">New password</label>
          <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className="field-input" />
          <p className="field-hint">At least 8 characters.</p>
        </div>
        <div>
          <label htmlFor="confirm" className="field-label">Confirm new password</label>
          <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="field-input" />
        </div>
        <Notice state={pwState} />
        <SubmitButton>Update password</SubmitButton>
      </form>
    </div>
  );
}
