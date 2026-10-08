'use client';

import { useActionState } from 'react';
import { saveSettings } from '@/app/admin/actions';
import type { Field, GroupId } from '@/lib/settings-schema';
import { Notice, SubmitButton } from './FormParts';

export function SettingsForm({ group, fields, values }: { group: GroupId; fields: Field[]; values: Record<string, string> }) {
  const [state, action] = useActionState(saveSettings, undefined);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="group" value={group} />
      {fields.map((f) => (
        <div key={f.key}>
          <label htmlFor={f.key} className="field-label">
            {f.label}
            {f.required && <span className="text-red-500"> *</span>}
          </label>
          {f.type === 'textarea' ? (
            <textarea id={f.key} name={f.key} rows={f.rows ?? 4} maxLength={f.max} defaultValue={values[f.key]} className="field-input" />
          ) : f.type === 'color' ? (
            <div className="flex items-center gap-3">
              <input
                id={f.key}
                name={f.key}
                type="color"
                defaultValue={values[f.key]}
                className="h-11 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />
              <span className="text-xs text-slate-500">Click the swatch to pick a color.</span>
            </div>
          ) : (
            <input
              id={f.key}
              name={f.key}
              type={f.type === 'number' ? 'text' : f.type}
              inputMode={f.type === 'number' ? 'numeric' : undefined}
              maxLength={f.max}
              required={f.required}
              defaultValue={values[f.key]}
              className="field-input"
            />
          )}
          {f.hint && <p className="field-hint">{f.hint}</p>}
        </div>
      ))}
      <Notice state={state} />
      <SubmitButton>Save changes</SubmitButton>
    </form>
  );
}
