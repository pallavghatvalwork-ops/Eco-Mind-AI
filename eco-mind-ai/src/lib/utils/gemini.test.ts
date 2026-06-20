import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callGemini } from './gemini';

describe('callGemini client helper', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    global.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return fallback data directly when NEXT_PUBLIC_ENABLE_AI is false', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'false';
    // Re-import callGemini to pick up environment variable change or use it directly
    const result = await callGemini('coach', {});
    expect(result).toBeDefined();
    expect(result.isFallback).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should call fetch and return success data when response is successful', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    const mockData = { id: 'rec-123', content: 'Use solar' };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData })
    });

    const result = await callGemini('coach', {});
    expect(result).toBeDefined();
    expect(result.isFallback).toBe(false);
    expect(result.id).toBe('rec-123');
    expect(global.fetch).toHaveBeenCalledWith('/api/gemini', expect.any(Object));
  });

  it('should return fallback data if fetch returns fallback: true from API route', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ fallback: true, reason: 'quota_exceeded' })
    });

    const result = await callGemini('coach', {});
    expect(result).toBeDefined();
    expect(result.isFallback).toBe(true);
    // Standard fallback coach suggestions has content
    expect(result[0].content).toContain('Switch to LED');
  });

  it('should return fallback data if fetch fails or throws an error', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await callGemini('coach', {});
    expect(result).toBeDefined();
    expect(result.isFallback).toBe(true);
    expect(result[0].content).toContain('Switch to LED');
  });
});
