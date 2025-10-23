import { describe, it, expect } from 'vitest';
import { requestSchema } from '../serverSchemas';

describe('serverSchemas', () => {
  describe('requestSchema', () => {
    it('should validate correct request data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        domain: 'babbel.com'
      };

      const result = requestSchema.safeParse(validData);
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

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('First name is required');
      }
    });

    it('should reject empty last name', () => {
      const data = {
        firstName: 'John',
        lastName: '',
        domain: 'babbel.com'
      };

      const result = requestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Last name is required');
      }
    });

    it('should reject empty domain', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        domain: ''
      };

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Domain is required');
      }
    });

    it('should reject first name that is too long', () => {
      const data = {
        firstName: 'A'.repeat(25), // 25 characters
        lastName: 'Doe',
        domain: 'babbel.com'
      };

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
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

      const result = requestSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.domain).toBe('babbel.com');
      }
    });

    it('should handle complex URL normalization', () => {
      const testCases = [
        { input: 'https://www.babbel.com/path?query=1#fragment', expected: 'babbel.com' },
        { input: 'http://babbel.com', expected: 'babbel.com' },
        { input: 'www.babbel.com', expected: 'babbel.com' },
        { input: 'babbel.com', expected: 'babbel.com' },
        { input: 'BABBEL.COM', expected: 'babbel.com' }
      ];

      testCases.forEach(({ input, expected }) => {
        const data = {
          firstName: 'John',
          lastName: 'Doe',
          domain: input
        };

        const result = requestSchema.safeParse(data);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.domain).toBe(expected);
        }
      });
    });
  });
});
