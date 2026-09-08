export const projectTypes = [
  ['Website', 'Website'],
  ['Web-App', 'Web app'],
  ['Mobile App', 'Mobile app'],
  ['Kassensystem', 'Point of sale'],
  ['Integration / API', 'Integration / API'],
  ['Individuelle Software', 'Custom software'],
  ['Bestehendes System erweitern', 'Extend an existing system'],
  ['Sonstiges', 'Something else'],
] as const;

export const budgets = [
  ['', 'Noch offen', 'Not decided'],
  ['bis_5000', 'Bis 5.000 €', 'Up to €5,000'],
  ['5000_15000', '5.000 – 15.000 €', '€5,000 – €15,000'],
  ['15000_50000', '15.000 – 50.000 €', '€15,000 – €50,000'],
  ['ab_50000', 'Ab 50.000 €', '€50,000 and above'],
] as const;

export const fieldOrder = [
  'company',
  'name',
  'email',
  'phone',
  'projectType',
  'budget',
  'message',
  'privacyAccepted',
] as const;
export type FieldName = (typeof fieldOrder)[number];
export type InquiryPayload = Record<FieldName | 'website', string> & { turnstileToken?: string };
export type ValidationCode =
  'required' | 'name' | 'email' | 'phone' | 'message' | 'tooLong' | 'projectType' | 'budget' | 'privacy';
export type FieldErrors = Partial<Record<FieldName, ValidationCode>>;

const emailPattern = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export function readPayload(data: FormData, token: string): InquiryPayload {
  const read = (name: string) => {
    const value = data.get(name);
    return typeof value === 'string' ? value.trim() : '';
  };
  return {
    company: read('company').replace(/\s+/g, ' '),
    name: read('name').replace(/\s+/g, ' '),
    email: read('email').toLowerCase(),
    phone: read('phone'),
    projectType: read('projectType'),
    budget: read('budget'),
    message: read('message'),
    privacyAccepted: read('privacyAccepted'),
    website: read('website'),
    ...(token ? { turnstileToken: token } : {}),
  };
}

export function validate(payload: InquiryPayload): FieldErrors {
  const errors: FieldErrors = {};
  if (!payload.company) errors.company = 'required';
  if (payload.company.length > 120) errors.company = 'tooLong';
  if (payload.name.length < 2) errors.name = 'name';
  if (payload.name.length > 120) errors.name = 'tooLong';
  if (!emailPattern.test(payload.email)) errors.email = 'email';
  if (payload.email.length > 254) errors.email = 'tooLong';
  if (!/^[0-9+() ./-]*$/.test(payload.phone)) errors.phone = 'phone';
  if (payload.phone.length > 40) errors.phone = 'tooLong';
  if (!projectTypes.some(([value]) => value === payload.projectType)) errors.projectType = 'projectType';
  if (!budgets.some(([value]) => value === payload.budget)) errors.budget = 'budget';
  if (payload.message.length < 10) errors.message = 'message';
  if (payload.message.length > 5000) errors.message = 'tooLong';
  if (payload.privacyAccepted !== 'true') errors.privacyAccepted = 'privacy';
  return errors;
}
