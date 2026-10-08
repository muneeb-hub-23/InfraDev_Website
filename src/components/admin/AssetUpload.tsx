'use client';

import { useActionState } from 'react';
import { resetAsset, uploadAsset } from '@/app/admin/actions';
import { Notice, SubmitButton } from './FormParts';

export function AssetUpload({ kind, label, current, accept, hint }: { kind: 'logo' | 'favicon' | 'stamp'; label: string; current: string; accept: string; hint: string }) {
  const [state, action] = useActionState(uploadAsset, undefined);
  const [resetState, resetAction] = useActionState(resetAsset, undefined);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-navy">{label}</h3>
      <div className="mb-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={label} className={kind === 'logo' ? 'max-h-full max-w-full object-contain' : 'h-12 w-12 object-contain'} />
        ) : (
          <span className="text-sm text-slate-400">No {kind} set</span>
        )}
      </div>
      <form action={action} className="space-y-3">
        <input type="hidden" name="kind" value={kind} />
        <input type="file" name="file" accept={accept} required className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20" />
        <p className="field-hint">{hint}</p>
        <Notice state={state} />
        <SubmitButton>Upload</SubmitButton>
      </form>
      <form action={resetAction} className="mt-3 space-y-3">
        <input type="hidden" name="kind" value={kind} />
        <Notice state={resetState} />
        <button type="submit" className="text-xs font-semibold text-slate-500 underline hover:text-brand">Restore original {kind}</button>
      </form>
      {kind === 'stamp' && current && (
        <form action={resetAction} className="mt-2">
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="mode" value="remove" />
          <button type="submit" className="text-xs font-semibold text-slate-500 underline hover:text-red-600">Remove stamp</button>
        </form>
      )}
    </div>
  );
}
