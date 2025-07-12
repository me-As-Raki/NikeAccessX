# chatbot.py

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import os
import json
import aiofiles
import aiohttp
import pathlib

router = APIRouter()

MODEL_NAME = "gemini-1.5-flash"
API_KEY = os.getenv("GEMINI_API_KEY")  # Load from Render env

@router.post("/api/ask")
async def ask_chatbot(request: Request):
    try:
        body = await request.json()
        user_question = body.get("userQuestion", "")

        # ✅ Read project-guide.txt
        guide_path = pathlib.Path("public/project-guide.txt")
        if not guide_path.exists():
            return JSONResponse({"reply": "Guide file not found."}, status_code=500)

        async with aiofiles.open(guide_path, mode='r') as f:
            guide_text = await f.read()
            guide_text = guide_text[:3000]  # Gemini limit

        # ✅ Prompt
        prompt = f"""
You are a helpful Nike AI shopping assistant.
Use ONLY this info:\n\n{guide_text}\n\n
User: {user_question}
"""

        # ✅ Send to Gemini API
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://generativelanguage.googleapis.com/v1/models/{MODEL_NAME}:generateContent?key={API_KEY}",
                headers={"Content-Type": "application/json"},
                json={ "contents": [ { "parts": [{ "text": prompt }] } ] }
            ) as response:
                data = await response.json()
                reply = (
                    data.get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [{}])[0]
                        .get("text", "No reply from Gemini.")
                )
                return {"reply": reply}

    except Exception as e:
        print("❌ Chatbot Error:", str(e))
        return JSONResponse({"reply": "Server error occurred."}, status_code=500)
