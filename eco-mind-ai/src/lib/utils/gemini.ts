// ===========================================
// Gemini Client Fetcher Helper — ECO MIND AI
// ===========================================

/**
 * Call the server-side Gemini API proxy route.
 */
export async function callGemini(type: string, payload: any): Promise<any> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, payload }),
    });

    if (!res.ok) {
      const errorJson = await res.json();
      throw new Error(errorJson.error || `Server returned status ${res.status}`);
    }

    const json = await res.json();
    
    if (json.error) {
      throw new Error(json.error);
    }

    return json.data;
  } catch (e: any) {
    console.error(`Gemini integration error on type [${type}]:`, e);
    throw e;
  }
}
