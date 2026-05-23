import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

global.fetch = vi.fn();

export function mockFetch(data, status = 200) {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  });
}

afterEach(() => {
  vi.clearAllMocks();
});
