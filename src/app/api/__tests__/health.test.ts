import { describe, it, expect } from 'vitest';
import { GET } from '../health/route';

describe('/api/health', () => {
  describe('GET', () => {
    it('should return healthy status', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        status: 'healthy',
        timestamp: expect.any(String)
      });
    });

    it('should return a valid timestamp', async () => {
      const response = await GET();
      const data = await response.json();

      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should return current timestamp', async () => {
      const before = new Date();
      const response = await GET();
      const data = await response.json();
      const after = new Date();

      const timestamp = new Date(data.timestamp);
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
