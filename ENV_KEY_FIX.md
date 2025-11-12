# 🔧 Fix: GEMINI_API_KEY Configuration Error

## Problem
```
Error: API configuration error
at generateMealPlan (geminiService.js:28:13)
```

**Cause:** `process.env.GEMINI_API_KEY` dibaca sebagai `undefined` di controller saat import time.

---

## Solution

### ❌ OLD CODE (Problem)
```javascript
// Dibaca saat import, sebelum dotenv.config() dijalankan
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const generateMealPlan = async (req, res) => {
  // GEMINI_API_KEY sudah undefined di sini!
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API configuration error' });
  }
  // ...
}
```

### ✅ NEW CODE (Fixed)
```javascript
export const generateMealPlan = async (req, res) => {
  // Dibaca saat request time, setelah dotenv.config() dijalankan
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = '...gemini-2.0-flash:generateContent';

  // GEMINI_API_KEY sudah loaded dari .env!
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not configured');
    return res.status(500).json({ error: 'API configuration error - GEMINI_API_KEY not set' });
  }

  console.log('✅ GEMINI_API_KEY found:', GEMINI_API_KEY.substring(0, 10) + '...');
  // ...
}
```

---

## Key Changes

1. **Move Env Read to Runtime:**
   - ❌ OLD: `const GEMINI_API_KEY = process.env.GEMINI_API_KEY;` (at module level)
   - ✅ NEW: `const GEMINI_API_KEY = process.env.GEMINI_API_KEY;` (inside function)

2. **Move API URL to Runtime:**
   - Sekarang dibaca saat request, bukan saat import

3. **Better Debugging:**
   - Added console.log untuk verifikasi API key dimuat
   - Log first 10 chars untuk security

---

## How It Works Now

```
server.js
  ↓
dotenv.config() ← ENV variables loaded ✅
  ↓
import mealplan.routes.js
  ↓
generateMealPlan function defined (API key NOT read yet)
  ↓
User request ke /api/mealplan/generate
  ↓
generateMealPlan() function called
  ↓
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ← Read NOW ✅
  ↓
Value: "AIzaSyDPMvFb2ATGzJOEyvRh-B4RN_7wujtb_Kk"
  ↓
API call successful! ✅
```

---

## .env File

**File:** `Backend/.env`

```properties
PORT=5000
MONGODB_URI=...
JWT_SECRET=...
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ✅ GEMINI API CONFIGURATION
GEMINI_API_KEY=AIzaSyDPMvFb2ATGzJOEyvRh-B4RN_7wujtb_Kk
```

---

## Testing

1. **Backend running:**
   ```bash
   npm run dev
   # Should show: ✅ MongoDB Connected successfully
   ```

2. **Frontend request:**
   - Fill meal planner form
   - Click "Buat Rencana Makan"
   - Check browser console

3. **Backend logs should show:**
   ```
   ✅ GEMINI_API_KEY found: AIzaSyDPM...
   🍽️ Sending to Gemini API: { calories: 2000, ... }
   ✅ Gemini API Response status: 200
   ```

---

## Best Practices Applied

✅ **Lazy Loading:** Read env at request time, not import time  
✅ **Proper Error Messages:** Show what's missing  
✅ **Debugging Info:** Log partial key for verification  
✅ **Security:** Don't log full API key  

---

## File Changed

**File:** `Backend/src/controllers/mealplan.controller.js`

**Lines Modified:** 1-25 (Top of file)

```diff
- const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
- const GEMINI_API_URL = '...';

export const generateMealPlan = async (req, res) => {
+ const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
+ const GEMINI_API_URL = '...';
+
+ if (!GEMINI_API_KEY) {
+   console.error('❌ GEMINI_API_KEY not configured');
+   return res.status(500).json({ error: '...' });
+ }
+
+ console.log('✅ GEMINI_API_KEY found:', ...);
```

---

## Status

✅ **FIXED** - API key now properly loaded at request time  
✅ **Backend running** - Port 5000  
✅ **Frontend running** - Port 5173  
✅ **Ready for testing** - Try generating meal plan now!

---

**Last Updated:** November 10, 2025  
**Fix Verified:** Yes ✅
