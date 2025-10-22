import { z } from 'zod';

// Domain normalization function (same as client)
const normalizeDomain = (value: string): string => {
  // Remove spaces and trim
  let domain = value.replace(/\s/g, '').trim();

  // Remove protocol and www, lower-case, and strip any path/query
  domain = domain
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/^www\./i, '')
    .replace(/\/.*/, '')
    .replace(/\?.*/, '')
    .replace(/#.*/, '');

  // If no TLD present (e.g., "babbel"), default to .com
  if (!/\.[a-z]{2,}$/i.test(domain) && domain) {
    domain = `${domain}.com`;
  }

  return domain;
};

// Server-side validation schema
const requestSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'First name is required' }).max(24, { message: 'First name must be at most 24 characters' }),
  lastName: z.string().trim().min(1, { message: 'Last name is required' }).max(24, { message: 'Last name must be at most 24 characters' }),
  domain: z.string()
    .min(1, { message: 'Domain is required' })
    .transform(normalizeDomain)
    .refine((val) => val.includes('.'), { message: 'Domain must contain a dot (e.g., babbel.com)' })
});

export { requestSchema };
