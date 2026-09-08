import { z } from 'zod';

const projectType = z.enum([
  'Website',
  'Web-App',
  'Mobile App',
  'Kassensystem',
  'Integration / API',
  'Individuelle Software',
  'Bestehendes System erweitern',
  'Sonstiges',
]);
const budget = z.enum(['bis_5000', '5000_15000', '15000_50000', 'ab_50000']).optional().or(z.literal(''));
const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');
const noControlCharacters = (value: string) => !/[\u0000-\u001f\u007f]/.test(value);
const noUnsafeMessageCharacters = (value: string) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
const singleLine = (minimum: number, maximum: number) =>
  z.string().max(maximum).refine(noControlCharacters).transform(normalize).pipe(z.string().min(minimum).max(maximum));

export const inquirySchema = z
  .object({
    company: singleLine(1, 120),
    name: singleLine(2, 120),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z
      .string()
      .max(40)
      .refine(noControlCharacters)
      .transform(normalize)
      .pipe(z.string().regex(/^[0-9+() ./-]*$/))
      .optional()
      .or(z.literal('')),
    projectType,
    budget,
    message: z
      .string()
      .max(5000)
      .refine(noUnsafeMessageCharacters)
      .transform((value) => value.trim())
      .pipe(z.string().min(10).max(5000)),
    privacyAccepted: z.literal('true'),
    turnstileToken: z
      .string()
      .min(1)
      .max(2048)
      .regex(/^[\x21-\x7e]+$/)
      .optional(),
    website: z.string().max(120).refine(noControlCharacters).optional(),
  })
  .strict();
export type InquiryInput = z.infer<typeof inquirySchema>;
