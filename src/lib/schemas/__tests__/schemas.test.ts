import { describe, it, expect } from 'vitest';
import { formSchema } from '../schemas';

describe('schemas', () => {
  describe('formSchema', () => {
    it('should validate correct form data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should normalize domain from URL', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: 'https://www.babbel.com/path'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('babbel.com');
      }
    });

    it('should normalize domain with www prefix', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: 'www.babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('babbel.com');
      }
    });

    it('should add .com extension to domains without TLD', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: 'babbel'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('babbel.com');
      }
    });

    it('should reject empty first name', () => {
      const data = {
        firstName: '',
        lastName: 'Doe',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name must be at least 1 character');
      }
    });

    it('should reject empty last name', () => {
      const data = {
        firstName: 'John',
        lastName: '',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name must be at least 1 character');
      }
    });

    it('should reject empty domain', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: ''
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Domain is required');
      }
    });

    it('should reject domain without dot after normalization', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: '' // Empty domain should fail
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Domain is required');
      }
    });

    it('should reject first name with spaces', () => {
      const data = {
        firstName: 'John Michael',
        lastName: 'Doe',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name cannot contain spaces');
      }
    });

    it('should reject last name with spaces', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe Smith',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name cannot contain spaces');
      }
    });

    it('should reject first name that is too long', () => {
      const data = {
        firstName: 'A'.repeat(25), // 25 characters
        lastName: 'Doe',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name must be at most 24 characters');
      }
    });

    it('should reject last name that is too long', () => {
      const data = {
        firstName: 'John',
        lastName: 'A'.repeat(25), // 25 characters
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name must be at most 24 characters');
      }
    });

    it('should trim whitespace from names', () => {
      const data = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        domain: 'babbel.com'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
      }
    });

    it('should handle case insensitive domain normalization', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: 'BABBEL.COM'
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('babbel.com');
      }
    });
  });
});
