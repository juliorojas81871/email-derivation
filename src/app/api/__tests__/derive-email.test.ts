import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../derive-email/route';
import { deriveEmailAddress } from '@/lib/services/emailDerivationService';

// Mock the email derivation service
vi.mock('@/lib/services/emailDerivationService');

describe('/api/derive-email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return success response when email derivation succeeds', async () => {
      const mockResult = {
        success: true,
        derivedEmail: 'jdoe@babbel.com',
        message: 'Email derived successfully'
      };
      vi.mocked(deriveEmailAddress).mockReturnValue(mockResult);

      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        derivedEmail: 'jdoe@babbel.com',
        message: 'Email derived successfully'
      });
      expect(deriveEmailAddress).toHaveBeenCalledWith('John', 'Doe', 'babbel.com');
    });

    it('should return failure response when email derivation fails', async () => {
      const mockResult = {
        success: false,
        derivedEmail: null,
        message: 'Derivation not possible - no sample data found for this domain'
      };
      vi.mocked(deriveEmailAddress).mockReturnValue(mockResult);

      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'unknown.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        derivedEmail: null,
        message: 'Derivation not possible - no sample data found for this domain'
      });
    });

    it('should return 400 for invalid request body', async () => {
      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: '', // Invalid: empty first name
          lastName: 'Doe',
          domain: 'babbel.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
      expect(deriveEmailAddress).not.toHaveBeenCalled();
    });

    it('should return 400 for missing required fields', async () => {
      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John'
          // Missing lastName and domain
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should return 400 for invalid domain format', async () => {
      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          domain: '' // Empty domain should fail
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('should handle domain normalization', async () => {
      const mockResult = {
        success: true,
        derivedEmail: 'jdoe@babbel.com',
        message: 'Email derived successfully'
      };
      vi.mocked(deriveEmailAddress).mockReturnValue(mockResult);

      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'https://www.babbel.com/path' // Should be normalized to babbel.com
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.derivedEmail).toBe('jdoe@babbel.com');
      expect(deriveEmailAddress).toHaveBeenCalledWith('John', 'Doe', 'babbel.com');
    });

    it('should return 500 for internal server error', async () => {
      vi.mocked(deriveEmailAddress).mockImplementation(() => {
        throw new Error('Internal error');
      });

      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle names with spaces correctly', async () => {
      const mockResult = {
        success: true,
        derivedEmail: 'jdoe@babbel.com',
        message: 'Email derived successfully'
      };
      vi.mocked(deriveEmailAddress).mockReturnValue(mockResult);

      const request = new Request('http://localhost:3000/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'John Michael', // Name with space
          lastName: 'Doe',
          domain: 'babbel.com'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.derivedEmail).toBe('jdoe@babbel.com');
      expect(deriveEmailAddress).toHaveBeenCalledWith('John Michael', 'Doe', 'babbel.com');
    });
  });
});
