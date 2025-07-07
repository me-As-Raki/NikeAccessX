# 🔥 Nike AI  – Fullstack Ecommerce with Firebase + AI

This is a complete fullstack **Nike ecommerce web app** built using **Next.js 14 App Router**, **Tailwind CSS**, **Firebase (Auth, Firestore, Storage)**, and an intelligent **OTP +AI-Chatbot system**.

> 🚀 Live Demo: Coming soon  
> 📦 Backend OTP Server: Python FastAPI  
> 🧠 AI Chatbot: Gemini (Google AI) or GPT integration  

---

## ✨ Features

### 🔐 Authentication
- ✅ Email & Password login (with validation)
- ✅ Google Sign-in (via Firebase)
- ✅ OTP-based registration and password reset (FastAPI backend)
- ✅ Forgot Password via OTP (not email link)
- ✅ Error handling with toast notifications

### 🛍️ Products
- ✅ Dynamic product loading from Firebase Firestore
- ✅ Filtering by type (Shoes, Clothing, Accessories)
- ✅ Sorting by price
- ✅ Search bar
- ✅ Product detail view (`/product/[id]`)
- ✅ Admin page to bulk upload products

### 🛒 Cart + Checkout
- ✅ Add to Cart / Buy Now
- ✅ Persistent localStorage + Firestore cart under user UID
- ✅ Checkout form (shipping details)
- ✅ Terms & Conditions checkbox
- ✅ Stores orders in Firestore under user ID
- ✅ My Orders page

### 👤 Profile
- ✅ Edit Name, Phone, Address (live updates to Firestore)
- ✅ Responsive and modern UI

### 💬 AI Chatbot
- ✅ Chat with Nike AI Bot to get help
- ✅ Gemini (Google AI) or GPT-powered chatbot
- ✅ Context-aware replies: “How to add to cart?”, “Where is my profile?”
- ✅ Voice Output (TTS), typing animation, clean layout

---

## 🛠️ Tech Stack

| Layer         | Stack                                           |
|---------------|--------------------------------------------------|
| Frontend      | Next.js 14 (App Router), Tailwind CSS            |
| Auth + DB     | Firebase Auth, Firestore, Firebase Storage       |
| OTP Server    | Python FastAPI (custom email OTP)                |
| AI Chat       | Gemini API (Google) or OpenAI Assistants         |
| UI Icons      | Lucide, React Icons                              |
| Deployment    | Vercel (Frontend), Render (Backend - Python)     |

---

## 📁 Folder Structure

```
nike-ai-redesign/
├── src/app/
│   ├── login/            # Firebase Auth login
│   ├── register/         # OTP Registration
│   ├── forgot-password/  # OTP-based password reset
│   ├── home/             # Homepage
│   ├── product/          # Product listing + filters
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout + order form
│   ├── profile/          # User profile (editable)
│   ├── orders/           # My Orders page
│   └── chatbot/          # Nike AI Chatbot (Gemini)
├── firebase/             # Firebase config
├── public/               # Static assets, logos
└── backend/              # FastAPI OTP server (main.py)
```

---

## ⚙️ Setup & Run Locally

1. **Clone repo**
   ```bash
   git clone https://github.com/yourname/nike-ai-redesign.git
   cd nike-ai-redesign
   ```

2. **Install packages**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Add your `firebase-adminsdk.json` to project root
   - Update `/firebase/config.js` with Firebase credentials

4. **Run OTP backend**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

5. **Run Frontend**
   ```bash
   npm run dev
   ```

---

## 🔐 Environment Variables

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `SMTP_EMAIL`          | Gmail used for sending OTP emails   |
| `SMTP_PASSWORD`       | Gmail App Password (not Gmail login) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key         |
| ... (see `.env.example`) |                                    |

---

## 🚧 Roadmap

- [x] Cart storage per user in Firestore
- [x] AI Chatbot integration with voice & typing animation
- [x] OTP verification for password reset
- [ ] PDF invoice download
- [ ] Stripe/Razorpay payment gateway
- [ ] Email confirmation on order

---

## 🤝 Credits

- Design Inspired by: [Nike](https://nike.com)
- Icons: [Lucide Icons](https://lucide.dev/)
- Backend OTP via FastAPI by [Rakesh Poojary]
- AI integration via Google Gemini / OpenAI GPT

---

## 📃 License

MIT License © 2025 Nike AI Project
