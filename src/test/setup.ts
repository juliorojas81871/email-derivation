import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock CSS modules
vi.mock('*.module.css', () => ({
  default: new Proxy({}, {
    get: (target, prop) => prop
  })
}));