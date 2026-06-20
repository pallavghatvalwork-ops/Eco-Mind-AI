# ECO MIND AI — Setup & Development Guide

> **"Understand. Track. Reduce."** — AI-Powered Carbon Footprint Awareness Platform

ECO MIND AI is a modern, premium Next.js web application built with TypeScript, TailwindCSS, and Google Gemini AI.

---

## 🛠️ Firebase Setup Configuration

This project is built on the **Google Ecosystem** using client-side Firebase SDKs (`firebase/app`, `firebase/auth`, and `firebase/firestore`). 

### ⚠️ Technical Decision: No Service Account Key Required
* **No `firebase-admin` dependency**: The project handles authentication states (Google Sign-In) and Firestore document read/write syncing directly in the browser client using secure client SDK triggers in [AuthContext.tsx](file:///c:/Development/Eco-Mind-AI/eco-mind-ai/src/contexts/AuthContext.tsx).
* **Generating a Service Account Key is NOT REQUIRED**: Unlike server-side setups, you do not need to download or distribute private keys or service account certificates, keeping the setup lightweight, highly private, and compatible with Firebase Spark (free tier) limits.

### How to Run Locally

1. **Clone and Install Dependencies**:
   ```bash
   cd eco-mind-ai
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add the public client-side credentials:
   ```env
   # Firebase Client SDK Credentials (Public)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBX6-W9qE3TPAX8ZIn1sGkogHw_eSW22zc
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eco-mind-ai-8996a.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=eco-mind-ai-8996a
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eco-mind-ai-8996a.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=894100189062
   NEXT_PUBLIC_FIREBASE_APP_ID=1:894100189062:web:cec04f324f9438cd72c607

   # Gemini API Key (Server-side only)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: Placeholders in [client.ts](file:///c:/Development/Eco-Mind-AI/eco-mind-ai/src/lib/firebase/client.ts) will automatically fall back to the above active configuration if environment variables are not supplied.*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Verify Production Build**:
   ```bash
   npm run build
   ```

---

## 📂 File Architecture
* **Auth Context**: [AuthContext.tsx](file:///c:/Development/Eco-Mind-AI/eco-mind-ai/src/contexts/AuthContext.tsx) manages the browser's authentication status and user document syncing.
* **Firebase Initialization**: [client.ts](file:///c:/Development/Eco-Mind-AI/eco-mind-ai/src/lib/firebase/client.ts) configures client instances.
* **AI Carbon Calculator**: [calculator.ts](file:///c:/Development/Eco-Mind-AI/eco-mind-ai/src/lib/carbon/calculator.ts) computes carbon equivalents.
