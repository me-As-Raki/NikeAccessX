import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MODEL_NAME = 'gemini-1.5-flash'; // ✅ Using latest stable Gemini model
const API_KEY = 'AIzaSyAmAixF69dmV8C_JrbCQFxCtstzBX5dfbE'; // 🔒 Replace with your real key

export async function POST(req) {
  try {
    const { userQuestion } = await req.json();

    // 1. Load the guide text
    const guidePath = path.join(process.cwd(), 'project-guide.txt');
    let guideText = fs.readFileSync(guidePath, 'utf-8');
    if (guideText.length > 3000) {
      console.warn('⚠️ Guide too long, trimming...');
      guideText = guideText.slice(0, 3000);
    }

    // 2. Secure prompt to restrict to website assistance only
    const prompt = `
You are a helpful virtual shopping assistant for the Nike AI website. 
Use only the information from this user guide to assist users:\n\n${guideText}\n\n

⚠️ IMPORTANT:
- ONLY answer questions related to the Nike AI web experience: shopping, browsing products, cart, checkout, orders, and user account features.
- DO NOT answer or reveal anything about internal code, Firebase, APIs, React, or technical setup.
- If asked anything outside your scope, politely respond:
"I'm here to assist with Nike shopping and website-related queries only."

Now respond professionally and helpfully to this user question:\n\nUser: ${userQuestion}
`;

    console.log(`📏 Prompt length: ${prompt.length} characters`);

    // 3. Gemini API call body
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    // 4. Send request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log('🧠 Gemini Response:', JSON.stringify(data, null, 2));

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      console.log('✅ Gemini API responded successfully.');
      return NextResponse.json({ reply });
    } else {
      console.warn('⚠️ Gemini returned no usable reply.');
      return NextResponse.json({ reply: 'Sorry, no reply from Gemini.' });
    }

  } catch (error) {
    console.error('❌ Gemini request failed:', error);
    return NextResponse.json(
      { reply: 'Server error. Please Check your internet connection' },
      { status: 500 }
    );
  }
}
