import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useEmailDerivation } from '../useEmailDerivation';

// Mock fetch
global.fetch = vi.fn();

describe('useEmailDerivation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('derive', () => {
    it('should successfully derive email', async () => {
      const mockResponse = {
        derivedEmail: 'jdoe@babbel.com',
        message: 'Email derived successfully'
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const { result } = renderHook(() => useEmailDerivation());

      await act(async () => {
        await result.current.derive({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        });
      });

      await waitFor(() => {
        expect(result.current.result).toBe('jdoe@babbel.com');
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
      });

      expect(fetch).toHaveBeenCalledWith('/api/derive-email', {
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
    });

    it('should handle API error response', async () => {
      const mockError = {
        error: 'Validation failed',
        details: [{ field: 'firstName', message: 'First name is required' }]
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError)
      } as Response);

      const { result } = renderHook(() => useEmailDerivation());

      await act(async () => {
        await result.current.derive({
          firstName: '',
          lastName: 'Doe',
          domain: 'babbel.com'
        });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Something went wrong');
        expect(result.current.result).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEmailDerivation());

      await act(async () => {
        await result.current.derive({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.result).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle JSON parsing error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as Response);

      const { result } = renderHook(() => useEmailDerivation());

      await act(async () => {
        await result.current.derive({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        });
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid JSON');
        expect(result.current.result).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading state correctly', async () => {
      let resolvePromise: (value: Response) => void;
      const promise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(fetch).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useEmailDerivation());

      // Start derivation
      act(() => {
        result.current.derive({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        });
      });

      // Should be loading immediately after calling derive
      expect(result.current.loading).toBe(true);

      // Resolve the promise with a proper Response object
      resolvePromise!(new Response(
        JSON.stringify({ derivedEmail: 'jdoe@babbel.com', message: 'Success' }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      ));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should clear previous result when starting new derivation', async () => {
      const { result } = renderHook(() => useEmailDerivation());

      // First derivation
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ derivedEmail: 'jdoe@babbel.com', message: 'Success' })
      } as Response);

      await act(async () => {
        await result.current.derive({
          firstName: 'John',
          lastName: 'Doe',
          domain: 'babbel.com'
        });
      });

      await waitFor(() => {
        expect(result.current.result).toBe('jdoe@babbel.com');
      });

      // Mock second derivation with a delayed response to test clearing
      let resolveSecondPromise: (value: Response) => void;
      const secondPromise = new Promise<Response>((resolve) => {
        resolveSecondPromise = resolve;
      });

      vi.mocked(fetch).mockReturnValueOnce(secondPromise);

      // Start second derivation
      act(() => {
        result.current.derive({
          firstName: 'Jane',
          lastName: 'Smith',
          domain: 'babbel.com'
        });
      });

      // Result should be cleared immediately when starting new derivation
      expect(result.current.result).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(true);

      // Resolve the second promise
      resolveSecondPromise!(new Response(
        JSON.stringify({ derivedEmail: 'jsmith@babbel.com', message: 'Success' }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      ));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

});
