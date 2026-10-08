'use client';

import { useActionState } from 'react';
import { login } from '../actions';
import { Notice, SubmitButton } from '@/components/admin/FormParts';

export function LoginForm() {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="username" className="field-label">Username</label>
        <input id="username" name="username" defaultValue={state?.username} required autoComplete="username" autoFocus className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field-input" />
      </div>
      <Notice state={state} />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
