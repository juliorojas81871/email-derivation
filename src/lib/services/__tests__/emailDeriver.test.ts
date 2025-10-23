import { describe, it, expect } from 'vitest';
import { deriveEmail } from '../emailDeriver';

describe('emailDeriver', () => {
  describe('deriveEmail', () => {
    it('should derive email using first_name_last_name pattern', () => {
      const result = deriveEmail('John Doe', 'example.com', 'first_name_last_name');
      expect(result).toBe('johndoe@example.com');
    });

    it('should derive email using first_name_initial_last_name pattern', () => {
      const result = deriveEmail('John Doe', 'example.com', 'first_name_initial_last_name');
      expect(result).toBe('jdoe@example.com');
    });

    it('should derive email using last_name_first_name pattern', () => {
      const result = deriveEmail('John Doe', 'example.com', 'last_name_first_name');
      expect(result).toBe('doejohn@example.com');
    });

    it('should derive email using last_name_first_name_initial pattern', () => {
      const result = deriveEmail('John Doe', 'example.com', 'last_name_first_name_initial');
      expect(result).toBe('doej@example.com');
    });

    it('should handle case insensitive domain', () => {
      const result = deriveEmail('John Doe', 'EXAMPLE.COM', 'first_name_last_name');
      expect(result).toBe('johndoe@example.com');
    });

    it('should handle mixed case names', () => {
      const result = deriveEmail('JANE SMITH', 'example.com', 'first_name_last_name');
      expect(result).toBe('janesmith@example.com');
    });

    it('should handle single name', () => {
      const result = deriveEmail('John', 'example.com', 'first_name_last_name');
      expect(result).toBe('johnjohn@example.com');
    });

    it('should handle multiple middle names', () => {
      const result = deriveEmail('John Michael Doe', 'example.com', 'first_name_initial_last_name');
      expect(result).toBe('jdoe@example.com');
    });

    it('should handle names with special characters', () => {
      const result = deriveEmail('Jean-Pierre Dupont', 'example.com', 'first_name_last_name');
      expect(result).toBe('jean-pierredupont@example.com');
    });

    it('should return null for unknown pattern', () => {
      const result = deriveEmail('John Doe', 'example.com', 'unknown_pattern');
      expect(result).toBeNull();
    });

    it('should handle empty name', () => {
      const result = deriveEmail('', 'example.com', 'first_name_last_name');
      expect(result).toBe('@example.com');
    });

    it('should handle names with extra spaces', () => {
      const result = deriveEmail('  John   Doe  ', 'example.com', 'first_name_last_name');
      expect(result).toBe('@example.com');
    });
  });
});
