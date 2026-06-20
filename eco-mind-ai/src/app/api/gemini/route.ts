import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Create the route handler
export async function POST(request: NextRequest) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiEnabled = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';
    if (!geminiEnabled) {
      return NextResponse.json({
        success: true,
        fallback: true,
        reason: "disabled_kill_switch",
        data: null
      });
    }

    if (!geminiApiKey) {
      return NextResponse.json({
        success: true,
        fallback: true,
        reason: "missing_api_key",
        data: null
      });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const { type, payload } = await request.json();

    if (!type || !payload) {
      return NextResponse.json(
        { error: 'Missing "type" or "payload" parameter.' },
        { status: 400 }
      );
    }

    let prompt = '';
    let imageParts: any[] = [];

    // Construct request parts based on type
    switch (type) {
      case 'coach': {
        const { preferences, carbonScore } = payload;
        prompt = `
          You are an expert AI Sustainability Coach. 
          Analyze the user's current carbon footprint preferences:
          - Transport: Commute is ${preferences?.transport?.dailyCommuteKm} km/day using ${preferences?.transport?.primaryModes?.join(', ')}. Flights: ${preferences?.transport?.monthlyFlights}/month.
          - Energy: Electricity is ${preferences?.energy?.electricityUnitsPerMonth} kWh/month. AC is ${preferences?.energy?.acHoursPerDay} hrs/day.
          - Food: Diet type is ${preferences?.food?.dietType}.
          - Shopping: Online orders: ${preferences?.shopping?.onlineOrdersPerMonth}/month, Fast Fashion items: ${preferences?.shopping?.fastFashionItemsPerMonth}/month.
          - Waste: Recycling is ${preferences?.waste?.recyclingLevel}, Composting is ${preferences?.waste?.composting ? 'active' : 'inactive'}.
          
          User Carbon Score: ${carbonScore} / 100.
          
          Generate 3 personalized, highly actionable sustainability recommendations to reduce their carbon footprint.
          Return the response as a JSON array of recommendation objects. Each object MUST look exactly like this:
          {
            "id": "rec-xxx",
            "content": "actionable suggestion string, mentioning concrete steps and why it helps",
            "category": "transport" | "energy" | "food" | "shopping" | "waste",
            "potentialSavingKg": number (estimated monthly carbon saving in kg CO2)
          }
          Return ONLY a valid JSON array, do not include markdown backticks or formatting.
        `;
        break;
      }

      case 'tracker': {
        const { text } = payload;
        prompt = `
          Analyze the user's daily activity description in natural language: "${text}".
          Extract all activities related to carbon emissions (transport, food, energy, shopping, waste).
          Estimate the carbon impact for each activity in kg CO2 based on typical Indian emission factor metrics:
          - Petrol Car travel: ~0.21 kg CO2/km
          - Motorcycle travel: ~0.10 kg CO2/km
          - Metro passenger-km: ~0.033 kg CO2/km
          - Public Bus: ~0.089 kg CO2/km
          - Electricity grid: ~0.82 kg CO2/kWh
          - AC running: ~1.23 kg CO2/hour
          - Vegetarian meals (full day): ~3.81 kg CO2/day
          - Vegan meals (full day): ~2.89 kg CO2/day
          - Mixed meals (full day): ~5.63 kg CO2/day
          - Meat-heavy meals (full day): ~7.19 kg CO2/day
          - Online delivery order: ~1.5 kg CO2/order
          - Fast fashion item: ~10 kg CO2/item
          - Waste Recycling / composting: reduce general waste daily factors.
          
          Return a JSON array of detected activity objects. Each object MUST look exactly like this:
          {
            "category": "transport" | "food" | "energy" | "shopping" | "waste",
            "description": "Short summary of the activity e.g., Drove 10 km by car",
            "parsedData": { "mode": string, "distanceKm": number } or similar parsed context keys,
            "estimatedCarbonKg": number (calculated carbon impact in kg CO2),
            "confidence": number (confidence score between 0.0 and 1.0)
          }
          Return ONLY a valid JSON array, do not include markdown backticks or formatting.
        `;
        break;
      }

      case 'bill': {
        const { fileData, mimeType } = payload;
        if (!fileData || !mimeType) {
          return NextResponse.json({ error: 'Missing fileData or mimeType for bill vision analysis' }, { status: 400 });
        }
        
        prompt = `
          Analyze the utility bill image. 
          Extract the following fields accurately:
          1. Provider name (e.g. MSEDCL, Tata Power, etc.)
          2. Units consumed in kWh (electricity units). If not found, estimate standard units.
          3. Total billing amount (in Rupees ₹).
          4. Billing period (e.g. 'May 2025' or date range).
          5. Carbon impact (calculate units consumed × 0.82 kg/kWh grid factor).
          
          Return a JSON object exactly like this:
          {
            "provider": "Provider Name",
            "unitsConsumed": number,
            "billingAmount": number,
            "billingPeriod": "Period name",
            "carbonImpact": number
          }
          Return ONLY a valid JSON object, do not include markdown backticks or formatting.
        `;
        imageParts = [{
          inlineData: {
            data: fileData.split(',')[1] || fileData,
            mimeType: mimeType
          }
        }];
        break;
      }

      case 'receipt': {
        const { fileData, mimeType } = payload;
        if (!fileData || !mimeType) {
          return NextResponse.json({ error: 'Missing fileData or mimeType for receipt vision analysis' }, { status: 400 });
        }
        
        prompt = `
          Analyze the shopping receipt image.
          Detect the primary purchased items (e.g. food items, clothing, electronics, plastic products).
          For each item, estimate the carbon impact level (low, medium, high) and estimated kg CO2 based on product materials, transport footprint, and manufacturing impact.
          Also generate a specific alternative suggestion recommendation.
          
          Return a JSON object exactly like this:
          {
            "items": [
              {
                "name": "Item Name",
                "impactRating": "low" | "medium" | "high",
                "estimatedCarbonKg": number
              }
            ],
            "recommendation": "A consolidated actionable recommendation for switching to lower-emission alternatives based on items found (e.g., switch to reusable, reduce single-use plastic, etc.)"
          }
          Return ONLY a valid JSON object, do not include markdown backticks or formatting.
        `;
        imageParts = [{
          inlineData: {
            data: fileData.split(',')[1] || fileData,
            mimeType: mimeType
          }
        }];
        break;
      }

      case 'journal': {
        const { text } = payload;
        prompt = `
          Analyze the daily sustainability journal entry: "${text}".
          1. Detect all green, sustainable actions described (e.g. cycling, eating vegetarian, using solar, recycling).
          2. Calculate the estimated carbon savings in kg CO2 compared to standard carbon-intensive alternatives (e.g., saving ~2 kg by riding a bicycle instead of driving).
          3. Provide a warm, encouraging comment from the Sustainability Coach, praising their actions and showing how it boosts their streak.
          
          Return a JSON object exactly like this:
          {
            "co2SavedKg": number (total estimated CO2 saved today in kg),
            "scoreIncrease": number (points gained, e.g. 5-15 depending on actions),
            "encouragement": "Encouraging comment string",
            "activities": ["Activity 1 description", "Activity 2 description", ...]
          }
          Return ONLY a valid JSON object, do not include markdown backticks or formatting.
        `;
        break;
      }

      case 'challenges': {
        const { preferences, carbonScore } = payload;
        prompt = `
          Generate 3 custom weekly sustainability challenges for this user profile:
          - Transport preferences: Commute is ${preferences?.transport?.dailyCommuteKm} km/day using ${preferences?.transport?.primaryModes?.join(', ')}.
          - Energy: Electricity is ${preferences?.energy?.electricityUnitsPerMonth} kWh/month. AC is ${preferences?.energy?.acHoursPerDay} hrs/day.
          - Food: Diet is ${preferences?.food?.dietType}.
          
          User Carbon Score: ${carbonScore} / 100.
          
          Provide challenges that directly target their highest emission sectors (e.g., if AC usage is high, offer AC-reduction challenge).
          Return the response as a JSON array of challenge objects. Each object MUST look exactly like this:
          {
            "title": "Short title, e.g. Walk 10km this week",
            "description": "Detailed description explaining what the user should do",
            "targetCO2Savings": number (CO2 savings in kg),
            "difficulty": "easy" | "medium" | "hard",
            "rewardPoints": number (50 for easy, 100 for medium, 200 for hard)
          }
          Return ONLY a valid JSON array, do not include markdown backticks or formatting.
        `;
        break;
      }

      case 'learn': {
        const { readArticles } = payload;
        prompt = `
          Based on the user's previously read article categories: [${readArticles?.join(', ')}],
          suggest 3 new educational topic recommendations for carbon footprint reduction.
          
          Return a JSON array of objects. Each object MUST look exactly like this:
          {
            "topic": "Name of the topic/article title",
            "reason": "Short explanation of why they should read this based on their profile",
            "pointsReward": number (usually 15, 20, or 25)
          }
          Return ONLY a valid JSON array, do not include markdown backticks or formatting.
        `;
        break;
      }

      default: {
        return NextResponse.json({ error: `Unsupported prompt type: ${type}` }, { status: 400 });
      }
    }

    let textResponse = '';

    if (geminiApiKey.startsWith('sk-or-')) {
      console.log('[Gemini API Route] Routing request via OpenRouter client proxy...');
      
      let contentParts: any = prompt;
      
      // If we have image data for vision calls
      if (imageParts.length > 0 && payload.fileData && payload.mimeType) {
        contentParts = [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: payload.fileData.includes('base64,') ? payload.fileData : `data:${payload.mimeType};base64,${payload.fileData}`
            }
          }
        ];
      }

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${geminiApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Eco Mind AI'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'user',
              content: contentParts
            }
          ],
          response_format: { type: 'json_object' },
          max_tokens: 4096
        })
      });

      if (!openRouterRes.ok) {
        const errText = await openRouterRes.text();
        throw new Error(`OpenRouter API returned status ${openRouterRes.status}: ${errText}`);
      }

      const openRouterJson = await openRouterRes.json();
      textResponse = openRouterJson.choices?.[0]?.message?.content || '';
    } else {
      // Call the standard Gemini model
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [...imageParts, prompt],
      });
      textResponse = response.text || '';
    }
    
    // Attempt to parse text response as JSON
    try {
      // Strip any accidental markdown formatting if the model still generated it
      const cleanJsonStr = textResponse
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();

      const parsedJson = JSON.parse(cleanJsonStr);
      return NextResponse.json({ data: parsedJson });
    } catch (e) {
      console.warn('Gemini response was not valid JSON. Response:', textResponse);
      return NextResponse.json({ 
        error: 'AI did not return valid JSON.',
        rawText: textResponse 
      });
    }

  } catch (e: any) {
    console.error('Gemini API Route error:', e);
    const status = e?.status || e?.response?.status || 500;
    
    if (status === 429) {
      return NextResponse.json({
        success: true,
        fallback: true,
        reason: "quota_exceeded",
        data: null
      });
    }

    return NextResponse.json({
      success: true,
      fallback: true,
      reason: "api_failure",
      data: null
    });
  }
}
