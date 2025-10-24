import { describe, it, expect } from 'vitest';
import { loadSampleData } from '../dataLoader';

describe('dataLoader', () => {
  describe('loadSampleData', () => {
    it('should load sample data', () => {
      const data = loadSampleData();
      expect(data).toBeDefined();
      expect(typeof data).toBe('object');
    });

    it('should return the same data on multiple calls', () => {
      const data1 = loadSampleData();
      const data2 = loadSampleData();
      expect(data1).toBe(data2); // Should be the same reference
    });

    it('should have expected sample data structure', () => {
      const data = loadSampleData();
      const entries = Object.entries(data);

      expect(entries.length).toBeGreaterThan(0);

      // Check that all values are email addresses
      entries.forEach(([name, email]) => {
        expect(typeof name).toBe('string');
        expect(typeof email).toBe('string');
        expect(email).toContain('@');
        expect(email).toContain('.');
      });
    });

    it('should contain expected sample entries', () => {
      const data = loadSampleData();

      // Check for some expected sample data
      const entries = Object.entries(data);
      expect(entries.length).toBeGreaterThan(0);

      // Verify that we have some babbel.com entries
      const babbelEntries = entries.filter(([, email]) => email.includes('@babbel.com'));
      expect(babbelEntries.length).toBeGreaterThan(0);
    });
  });
});
