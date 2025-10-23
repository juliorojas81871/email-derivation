import { describe, it, expect } from 'vitest';
import { detectEmailPattern } from '../emailPatternDetector';

describe('emailPatternDetector', () => {
  describe('detectEmailPattern', () => {
    it('should detect first_name_last_name pattern', () => {
      const result = detectEmailPattern('John Doe', 'johndoe@example.com');
      expect(result).toBe('first_name_last_name');
    });

    it('should detect first_name_initial_last_name pattern', () => {
      const result = detectEmailPattern('John Doe', 'jdoe@example.com');
      expect(result).toBe('first_name_initial_last_name');
    });

    it('should detect last_name_first_name pattern', () => {
      const result = detectEmailPattern('John Doe', 'doejohn@example.com');
      expect(result).toBe('last_name_first_name');
    });

    it('should detect last_name_first_name_initial pattern', () => {
      const result = detectEmailPattern('John Doe', 'doej@example.com');
      expect(result).toBe('last_name_first_name_initial');
    });

    it('should handle case insensitive matching', () => {
      const result = detectEmailPattern('JANE SMITH', 'janesmith@example.com');
      expect(result).toBe('first_name_last_name');
    });

    it('should handle mixed case in email', () => {
      const result = detectEmailPattern('john doe', 'JohnDoe@example.com');
      expect(result).toBe('first_name_last_name');
    });

    it('should return null for unrecognized patterns', () => {
      const result = detectEmailPattern('John Doe', 'random@example.com');
      expect(result).toBeNull();
    });

    it('should return null for partial matches', () => {
      const result = detectEmailPattern('John Doe', 'john@example.com');
      expect(result).toBeNull();
    });

    it('should handle single name', () => {
      const result = detectEmailPattern('John', 'johnjohn@example.com');
      expect(result).toBe('first_name_last_name');
    });

    it('should handle multiple middle names', () => {
      const result = detectEmailPattern('John Michael Doe', 'jdoe@example.com');
      expect(result).toBe('first_name_initial_last_name');
    });

    it('should handle names with special characters', () => {
      const result = detectEmailPattern('Jean-Pierre Dupont', 'jean-pierredupont@example.com');
      expect(result).toBe('first_name_last_name');
    });
  });
});
