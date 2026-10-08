'use client';

import { useFormStatus } from 'react-dom';
import type { FormState } from '@/app/admin/actions';

export function SubmitButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60 ${className}`}>
      {pending ? 'Working…' : children}
    </button>
  );
}

export function Notice({ state }: { state: FormState }) {
  if (!state) return null;
  if (state.error) return <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>;
  if (state.message) return <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{state.message}</div>;
  return null;
}
