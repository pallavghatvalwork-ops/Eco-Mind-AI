import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Create a shared mock function that we can update dynamically
const mockGenerateContent = vi.fn();

// Mock the GoogleGenAI class from @google/genai as a class constructor
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: mockGenerateContent
      };
    }
  };
});

describe('Gemini API Route (/api/gemini)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Default mock response: returns successful mock JSON string
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify([{ id: 'rec-test', content: 'Reduce water usage', category: 'waste', potentialSavingKg: 5 }])
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  const createMockRequest = (body: any) => {
    const jsonString = JSON.stringify(body);
    return new NextRequest('http://localhost:3000/api/gemini', {
      method: 'POST',
      body: jsonString,
      headers: {
        'content-type': 'application/json'
      }
    });
  };

  it('should return 400 if type or payload is missing', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    process.env.GEMINI_API_KEY = 'valid-key';
    const request = createMockRequest({});
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing "type" or "payload"');
  });

  it('should return disabled fallback if NEXT_PUBLIC_ENABLE_AI is false', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'false';
    process.env.GEMINI_API_KEY = 'valid-key';
    const request = createMockRequest({ type: 'coach', payload: {} });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.fallback).toBe(true);
    expect(data.reason).toBe('disabled_kill_switch');
  });

  it('should return missing key fallback if GEMINI_API_KEY is not defined', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    delete process.env.GEMINI_API_KEY;
    const request = createMockRequest({ type: 'coach', payload: {} });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.fallback).toBe(true);
    expect(data.reason).toBe('missing_api_key');
  });

  it('should successfully handle call and return AI results when client is enabled', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    process.env.GEMINI_API_KEY = 'valid-gemini-key';

    const request = createMockRequest({
      type: 'coach',
      payload: { preferences: {}, carbonScore: 80 }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.data).toBeDefined();
    expect(result.data[0].id).toBe('rec-test');
  });

  it('should return fallback if standard call throws a 429 quota exception', async () => {
    process.env.NEXT_PUBLIC_ENABLE_AI = 'true';
    process.env.GEMINI_API_KEY = 'valid-gemini-key';

    // Mock the generateContent function to throw 429 error
    mockGenerateContent.mockRejectedValueOnce({
      status: 429,
      message: 'Quota exceeded'
    });

    const request = createMockRequest({
      type: 'coach',
      payload: { preferences: {}, carbonScore: 80 }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.fallback).toBe(true);
    expect(result.reason).toBe('quota_exceeded');
  });
});
