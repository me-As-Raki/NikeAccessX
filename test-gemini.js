import fetch from 'node-fetch';

const API_KEY = 'AIzaSyD5ParcUoQIHNq1vZB7RP-9eTmDaj5XKQ4';  // replace with actual Gemini API key
const MODEL_NAME = 'models/gemini-1.5-flash';

const prompt = "Hi, what is Nike?";

async function callGemini() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/${MODEL_NAME}:generateContent?key=${API_KEY}`,
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

  const text = await res.text();
  console.log('🔁 Gemini Response:\n', text || '❌ EMPTY');
}

callGemini();
