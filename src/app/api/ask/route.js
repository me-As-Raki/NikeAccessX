import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MODEL_NAME = 'gemini-1.5-flash';
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    console.log('✅ /api/ask POST route hit. Connecting to Gemini API...');

    const { userQuestion } = await req.json();
    console.log('💬 User Question:', userQuestion);

    const guidePath = path.join(process.cwd(), 'public', 'project-guide.txt');
    let guideText = await readFile(guidePath, 'utf-8');

    if (guideText.length > 3000) guideText = guideText.slice(0, 3000);

    const prompt = `
You are a friendly and helpful AI assistant for the Nike AI website. 
You're here to guide users with anything related to shopping, products, accounts, orders, or using the website.

📌 IMPORTANT INSTRUCTIONS:
- Only use the information provided in the guide below.
- If the user's question is unrelated (like personal or general topics), respond politely:
  "I'm here to help with the Nike AI website. Try asking about products, orders, or your account!"
- If the user's question contains spelling mistakes or typos, try to understand and correct it, as long as it's related to the guide.

Nike AI Website Guide:
======================
${guideText}
======================

✅ Sample Conversations:

User: Where do I find running shoes?
AI: You can browse running shoes in the Products section under the 'Running' filter.

User: How can I view my past orders?
AI: Go to the 'My Orders' page after logging in to see all your previous purchases.

User: Can I sign in with Google?
AI: Yes, you can log in using your email and password or your Google account on the /login page.

❌ Off-topic Example:

User: What's your name?
AI: I'm your Nike AI Assistant — here to help you with anything on the Nike AI website!

User: What is 2 + 2?
AI: I'm here to help with the Nike AI website. Try asking about products, orders, or your account!

Now help with this:
User: ${userQuestion}
AI:
`;



    // ✅ Calling Gemini
    console.log('📡 Sending prompt to Gemini...');
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();
    console.log('📦 Gemini API raw response:', JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ Gemini did not return a valid reply.";

    const response = NextResponse.json({ reply });

    // ✅ Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    console.log('✅ Gemini response sent to frontend.\n');
    return response;
  } catch (err) {
    console.error('❌ Gemini route error:', err);
    return NextResponse.json(
      { reply: '⚠️ Server error while processing your request.' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
