import seed from '../../prisma/seed-data.json';

export type FieldType = 'text' | 'textarea' | 'email' | 'url' | 'tel' | 'color' | 'number';

export type Field = {
  key: SettingKey;
  label: string;
  type: FieldType;
  hint?: string;
  max?: number;
  required?: boolean;
  pattern?: RegExp;
  patternHint?: string;
  rows?: number;
};

export type GroupId = 'general' | 'branding' | 'contact' | 'documents' | 'about' | 'stats' | 'seo';

export const DEFAULT_SETTINGS = seed.settings;
export type SettingKey = keyof typeof seed.settings | 'logo' | 'favicon' | 'stamp';

export const GROUPS: { id: GroupId; label: string; description: string; fields: Field[] }[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Company identity and the main texts shown on the home page.',
    fields: [
      { key: 'companyName', label: 'Company name', type: 'text', max: 80, required: true },
      { key: 'tagline', label: 'Tagline', type: 'text', max: 120, required: true, hint: 'Sentences are split on "." for the hero heading.' },
      { key: 'ntn', label: 'NTN', type: 'text', max: 30, hint: 'National Tax Number, printed on quotations and invoices.' },
      { key: 'heroBadge', label: 'Hero badge text', type: 'text', max: 80 },
      { key: 'shortDescription', label: 'Hero description', type: 'textarea', max: 500 },
      { key: 'footerDescription', label: 'Footer description', type: 'textarea', max: 500 },
    ],
  },
  {
    id: 'branding',
    label: 'Branding',
    description: 'Logo, favicon and theme colors.',
    fields: [
      { key: 'brandColor', label: 'Brand color', type: 'color', required: true },
      { key: 'accentColor', label: 'Accent color', type: 'color', required: true },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Contact details shown in the header, contact section and footer.',
    fields: [
      { key: 'phone', label: 'Phone', type: 'tel', max: 40 },
      { key: 'whatsapp', label: 'WhatsApp number', type: 'tel', max: 20, hint: 'Digits with country code, e.g. 923230980043. Falls back to the phone number.' },
      { key: 'email', label: 'Email', type: 'email', max: 120 },
      { key: 'website', label: 'Website URL', type: 'url', max: 200 },
      { key: 'address', label: 'Location / address', type: 'text', max: 200 },
      { key: 'availabilityText', label: 'Availability text', type: 'text', max: 80 },
      { key: 'responseTime', label: 'Typical response time', type: 'text', max: 40 },
    ],
  },
  {
    id: 'documents',
    label: 'Quotations & Invoices',
    description: 'Details printed on quotations and invoices. Changes also apply to documents created earlier when they are viewed or printed.',
    fields: [
      { key: 'docAddress', label: 'Business address', type: 'textarea', max: 200, rows: 2, hint: 'Shown in the footer of every document.' },
      { key: 'docEmail', label: 'Email', type: 'email', max: 120 },
      { key: 'docPhone', label: 'Phone / WhatsApp', type: 'tel', max: 40 },
      { key: 'docRegards', label: 'Regards (signatory name)', type: 'text', max: 80 },
      { key: 'docBankDetails', label: 'Bank details', type: 'textarea', max: 500, rows: 4, hint: 'One item per line, e.g. Account Title, Bank, Account #, IBAN.' },
      { key: 'docTerms', label: 'Default terms', type: 'textarea', max: 500, rows: 3, hint: 'One per line. Pre-filled on new documents and editable per document.' },
      { key: 'invoicePrefix', label: 'Invoice number prefix', type: 'text', max: 8, required: true, pattern: /^[A-Za-z0-9]{1,8}$/, patternHint: 'Letters and digits only.', hint: 'Numbers look like INV-2026091401 (prefix, date, daily sequence).' },
      { key: 'quotationPrefix', label: 'Quotation number prefix', type: 'text', max: 8, required: true, pattern: /^[A-Za-z0-9]{1,8}$/, patternHint: 'Letters and digits only.' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    description: 'Text of the About section.',
    fields: [
      { key: 'aboutText1', label: 'About paragraph 1', type: 'textarea', max: 800 },
      { key: 'aboutText2', label: 'About paragraph 2', type: 'textarea', max: 800 },
    ],
  },
  {
    id: 'stats',
    label: 'Statistics',
    description: 'Numbers shown in the hero and the “Why Us” section.',
    fields: [
      { key: 'statProjects', label: 'Projects completed', type: 'number', hint: 'Animated counter (shown with a trailing +).' },
      { key: 'statClients', label: 'Satisfied clients', type: 'number', hint: 'Animated counter (shown with a trailing +).' },
      { key: 'statUptime', label: 'Uptime SLA', type: 'text', max: 20 },
      { key: 'statSupport', label: 'Support availability', type: 'text', max: 20 },
      { key: 'statExperience', label: 'Industry experience', type: 'text', max: 20 },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    description: 'Search engine and social sharing metadata.',
    fields: [
      { key: 'metaTitle', label: 'Page title', type: 'text', max: 120 },
      { key: 'metaDescription', label: 'Meta description', type: 'textarea', max: 300 },
      { key: 'metaKeywords', label: 'Meta keywords', type: 'textarea', max: 300 },
    ],
  },
];

export const ALL_KEYS = GROUPS.flatMap((g) => g.fields.map((f) => f.key));
