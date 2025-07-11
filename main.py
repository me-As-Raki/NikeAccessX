from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import smtplib
import ssl
import os
import json
import base64
import random

# ✅ Firebase Admin SDK from ENV Base64
from firebase_admin import auth, credentials, initialize_app
import firebase_admin

firebase_config_b64 = os.getenv("FIREBASE_CONFIG_B64")
if not firebase_admin._apps and firebase_config_b64:
    config_dict = json.loads(base64.b64decode(firebase_config_b64))
    cred = credentials.Certificate(config_dict)
    firebase_admin.initialize_app(cred)

# ✅ FastAPI app
app = FastAPI()

# ✅ CORS setup for local + frontend deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://nikeaccessx.onrender.com",
        "https://nike-access-x-9bsk.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Fix preflight CORS issue (Render specific bug)
@app.options("/{rest_of_path:path}")
async def preflight_handler():
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
        "Access-Control-Allow-Headers": "*",
    }
    return JSONResponse(status_code=204, content=None, headers=headers)

# ✅ SMTP credentials from environment
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "rakeshpoojary850@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "zmvvppmowvnnurcp")

# ✅ OTP Store (in-memory)
otp_store = {}

# ✅ Models
class OTPRequest(BaseModel):
    email: str

class PasswordResetRequest(BaseModel):
    email: str
    new_password: str

# ✅ Send registration OTP email
def send_otp_email_for_registration(email: str, otp: str):
    message = f"""Subject: Welcome to Nike\n\nUse this OTP to complete your registration: {otp}"""
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, email, message)
        return {"success": True, "message": "OTP sent for registration"}
    except Exception as e:
        return {"success": False, "error": f"Email sending failed (registration): {str(e)}"}

# ✅ Send reset OTP email
def send_otp_email_for_reset(email: str, otp: str):
    message = f"""Subject: Nike Password Reset\n\nUse this OTP to reset your password: {otp}"""
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, email, message)
        return {"success": True, "message": "OTP sent for password reset"}
    except Exception as e:
        return {"success": False, "error": f"Email sending failed (reset): {str(e)}"}

# ✅ Health check
@app.get("/")
def root():
    return {"message": "✅ OTP Server is running!"}

# ✅ Register OTP
@app.post("/send-otp")
async def send_registration_otp(data: OTPRequest):
    try:
        auth.get_user_by_email(data.email)
        return {"success": False, "error": "Email is already registered"}
    except firebase_admin.auth.UserNotFoundError:
        otp = str(random.randint(100000, 999999))
        otp_store[data.email] = otp
        return send_otp_email_for_registration(data.email, otp)
    except Exception as e:
        return {"success": False, "error": f"Firebase error: {str(e)}"}

# ✅ Reset OTP
@app.post("/send-reset-otp")
async def send_reset_otp(data: OTPRequest):
    otp = str(random.randint(100000, 999999))
    otp_store[data.email] = otp
    return send_otp_email_for_reset(data.email, otp)

# ✅ Verify OTP
@app.post("/verify-otp")
async def verify_otp(request: Request):
    body = await request.json()
    email = body.get("email")
    otp_input = body.get("otp")
    if email in otp_store and otp_store[email] == otp_input:
        del otp_store[email]
        return {"verified": True}
    return {"verified": False}

# ✅ Reset password via Firebase
@app.post("/reset-password")
async def reset_password(data: PasswordResetRequest):
    try:
        user = auth.get_user_by_email(data.email)
        auth.update_user(user.uid, password=data.new_password)
        return {"success": True, "message": "Password updated successfully"}
    except firebase_admin.auth.UserNotFoundError:
        return {"success": False, "error": "Email not found"}
    except Exception as e:
        return {"success": False, "error": f"Password update failed: {str(e)}"}

# ✅ Chatbot route (include after all endpoints)
from chatbot import router as chatbot_router
app.include_router(chatbot_router)

# ✅ Run locally
if __name__ == "__main__":
    import uvicorn
    print("🚀 Server running at http://0.0.0.0:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
