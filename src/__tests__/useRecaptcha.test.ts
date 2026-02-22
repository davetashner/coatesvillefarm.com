import { renderHook, act } from '@testing-library/react';
import { useRecaptcha } from '../hooks/useRecaptcha';

// The CONFIG module is mocked via moduleNameMapper -> configMock.ts
// Import the mock so we can mutate it per test.
import { CONFIG } from '@/config';

describe('useRecaptcha', () => {
  beforeEach(() => {
    delete (window as { grecaptcha?: unknown }).grecaptcha;
    document.querySelectorAll('script[src*="recaptcha"]').forEach((s) => s.remove());
    // Reset to default (no key)
    (CONFIG as Record<string, unknown>).RECAPTCHA_SITE_KEY = '';
  });

  afterEach(() => {
    (CONFIG as Record<string, unknown>).RECAPTCHA_SITE_KEY = '';
  });

  test('returns a getToken function', () => {
    const { result } = renderHook(() => useRecaptcha());
    expect(typeof result.current.getToken).toBe('function');
  });

  test('getToken returns empty string when RECAPTCHA_SITE_KEY is not set', async () => {
    expect(CONFIG.RECAPTCHA_SITE_KEY).toBeFalsy();

    const { result } = renderHook(() => useRecaptcha());

    let token = '';
    await act(async () => {
      token = await result.current.getToken();
    });

    expect(token).toBe('');
  });

  test('loads recaptcha script when key is configured', () => {
    (CONFIG as Record<string, unknown>).RECAPTCHA_SITE_KEY = 'test-site-key';

    renderHook(() => useRecaptcha());

    const script = document.querySelector('script[src*="recaptcha"]');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toContain('test-site-key');
  });
});
