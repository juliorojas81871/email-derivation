import { z } from "zod";

// Domain normalization function
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

export const formSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, { message: "First name must be at least 1 character" })
    .max(24, { message: "First name must be at most 24 characters" })
    .refine((val) => !/\s/.test(val), { message: "First name cannot contain spaces" }),

  lastName: z.string()
    .trim()
    .min(1, { message: "Last name must be at least 1 character" })
    .max(24, { message: "Last name must be at most 24 characters" })
    .refine((val) => !/\s/.test(val), { message: "Last name cannot contain spaces" }),

  domain: z.string()
    .min(1, { message: "Domain is required" })
    .transform(normalizeDomain)
    .refine((val) => val.includes("."), { message: "Domain must contain a dot (e.g., babbel.com)" })
    .refine((val) => !/\s/.test(val), { message: "Domain cannot contain spaces" })
});

export type FormSchema = z.infer<typeof formSchema>;
