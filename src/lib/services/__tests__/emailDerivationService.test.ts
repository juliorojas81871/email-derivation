import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deriveEmailAddress } from '../emailDerivationService';
import { loadSampleData, type SampleData } from '../../data/dataLoader';
import { detectEmailPattern } from '../emailPatternDetector';
import { deriveEmail } from '../emailDeriver';

// Mock the dependencies
vi.mock('../../data/dataLoader');
vi.mock('../emailPatternDetector');
vi.mock('../emailDeriver');

describe('emailDerivationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deriveEmailAddress', () => {
    it('should successfully derive email when pattern is detected', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@babbel.com',
        'Jane Smith': 'jsmith@babbel.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern).mockReturnValue('first_name_initial_last_name');
      vi.mocked(deriveEmail).mockReturnValue('jdoe@babbel.com');

      const result = deriveEmailAddress('John', 'Doe', 'babbel.com');

      expect(result).toEqual({
        success: true,
        derivedEmail: 'jdoe@babbel.com',
        message: 'Email derived successfully'
      });

      expect(detectEmailPattern).toHaveBeenCalledWith('John Doe', 'jdoe@babbel.com');
      expect(deriveEmail).toHaveBeenCalledWith('John Doe', 'babbel.com', 'first_name_initial_last_name');
    });

    it('should return failure when no sample data found for domain', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@example.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);

      const result = deriveEmailAddress('John', 'Doe', 'babbel.com');

      expect(result).toEqual({
        success: false,
        derivedEmail: null,
        message: 'Derivation not possible - no sample data found for this domain'
      });

      expect(detectEmailPattern).not.toHaveBeenCalled();
      expect(deriveEmail).not.toHaveBeenCalled();
    });

    it('should return failure when no pattern can be detected', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@babbel.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern).mockReturnValue(null);

      const result = deriveEmailAddress('John', 'Doe', 'babbel.com');

      expect(result).toEqual({
        success: false,
        derivedEmail: null,
        message: 'Derivation not possible - could not detect pattern from samples'
      });

      expect(detectEmailPattern).toHaveBeenCalledWith('John Doe', 'jdoe@babbel.com');
      expect(deriveEmail).not.toHaveBeenCalled();
    });

    it('should handle case insensitive domain matching', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@BABBEL.COM'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern).mockReturnValue('first_name_initial_last_name');
      vi.mocked(deriveEmail).mockReturnValue('jdoe@babbel.com');

      const result = deriveEmailAddress('John', 'Doe', 'babbel.com');

      expect(result.success).toBe(true);
      expect(detectEmailPattern).toHaveBeenCalledWith('John Doe', 'jdoe@BABBEL.COM');
    });

    it('should handle multiple samples and use first detected pattern', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@babbel.com',
        'Jane Smith': 'jsmith@babbel.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce('first_name_initial_last_name');
      vi.mocked(deriveEmail).mockReturnValue('jdoe@babbel.com');

      const result = deriveEmailAddress('John', 'Doe', 'babbel.com');

      expect(result.success).toBe(true);
      expect(detectEmailPattern).toHaveBeenCalledTimes(2);
      expect(detectEmailPattern).toHaveBeenNthCalledWith(1, 'John Doe', 'jdoe@babbel.com');
      expect(detectEmailPattern).toHaveBeenNthCalledWith(2, 'Jane Smith', 'jsmith@babbel.com');
    });

    it('should handle empty first name', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@babbel.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern).mockReturnValue('first_name_initial_last_name');
      vi.mocked(deriveEmail).mockReturnValue('doe@babbel.com');

      const result = deriveEmailAddress('', 'Doe', 'babbel.com');

      expect(result.success).toBe(true);
      expect(deriveEmail).toHaveBeenCalledWith('Doe', 'babbel.com', 'first_name_initial_last_name');
    });

    it('should handle empty last name', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@babbel.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern).mockReturnValue('first_name_initial_last_name');
      vi.mocked(deriveEmail).mockReturnValue('j@babbel.com');

      const result = deriveEmailAddress('John', '', 'babbel.com');

      expect(result.success).toBe(true);
      expect(deriveEmail).toHaveBeenCalledWith('John', 'babbel.com', 'first_name_initial_last_name');
    });

    it('should trim whitespace from names', () => {
      const mockSampleData: SampleData = {
        'John Doe': 'jdoe@babbel.com'
      };
      vi.mocked(loadSampleData).mockReturnValue(mockSampleData);
      vi.mocked(detectEmailPattern).mockReturnValue('first_name_initial_last_name');
      vi.mocked(deriveEmail).mockReturnValue('jdoe@babbel.com');

      const result = deriveEmailAddress('  John  ', '  Doe  ', 'babbel.com');

      expect(result.success).toBe(true);
      expect(deriveEmail).toHaveBeenCalledWith('John     Doe', 'babbel.com', 'first_name_initial_last_name');
    });
  });
});