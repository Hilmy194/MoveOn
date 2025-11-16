# 🍽️ Meal Planner AI - Dokumentasi Fitur

## Status: ✅ SIAP DIGUNAKAN

### Deskripsi Fitur
Meal Planner AI adalah fitur yang memungkinkan pengguna untuk membuat rencana makan yang dipersonalisasi berdasarkan preferensi mereka menggunakan Google Gemini API.

## 📋 Komponen yang Dibuat

### 1. **geminiService.js** (`Frontend/src/services/geminiService.js`)
Service untuk mengintegrasikan Google Gemini API

**Fitur:**
- Mengirim preferensi pengguna ke Gemini API
- Parsing respons JSON dari Gemini
- Error handling yang comprehensive
- Console logging untuk debugging

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

**Parameter yang Diterima:**
```javascript
{
  calories: "2000",        // Target kalori harian
  dietType: "balanced",    // Jenis diet (balanced, low-carb, high-protein, vegetarian, vegan)
  allergies: "kacang",     // Alergi/pantangan (opsional)
  goal: "maintenance"      // Tujuan (maintenance, weight-loss, muscle-gain)
}
```

**Return Format:**
```javascript
{
  breakfast: {
    name: "Nasi Goreng Sehat",
    calories: 500,
    protein: 30,
    carbs: 50,
    fat: 20,
    ingredients: ["Nasi", "Telur", "Sayuran"],
    instructions: "Langkah 1..., Langkah 2..., dst"
  },
  lunch: { /* struktur sama */ },
  dinner: { /* struktur sama */ }
}
```

### 2. **MealPlanner.jsx** (`Frontend/src/pages/MealPlanner.jsx`)
Komponen React untuk UI Meal Planner

**Fitur:**
- ✅ Form untuk input preferensi pengguna
- ✅ Real-time state management dengan useState
- ✅ Loading state dengan spinner animasi
- ✅ Error handling dan display error message
- ✅ Responsive grid layout (2 kolom di desktop, 1 di mobile)
- ✅ Display hasil rencana makan dengan emoji indicator
- ✅ Scrollable meal plan section
- ✅ Nutrisi macros display (Protein, Karbs, Fat)
- ✅ Bahan-bahan dan cara membuat

**Styling:**
- Dark theme sesuai brand MoveOn (#001a3d, #002a5c, #0055b8)
- Focus states untuk accessibility
- Smooth transitions dan hover effects
- Semi-transparent overlay loading

## 🔧 Konfigurasi

### 1. Environment Variable
File: `.env`
```
VITE_GEMINI_API_KEY=AIzaSyDPMvFb2ATGzJOEyvRh-B4RN_7wujtb_Kk
```

### 2. Routes
Sudah terdaftar di `main.jsx`:
```javascript
{ path: '/meal-planner', element: <MealPlanner /> }
```

### 3. Navigation
Sudah terdaftar di navbar untuk:
- ✅ Coach: `/ai-assistant` link
- ✅ Trainee: `/ai-assistant` link

## 🚀 Cara Menggunakan

1. **Login** sebagai Coach atau Trainee
2. **Klik** "AI Assistant" di navbar
3. **Isi form:**
   - Target Kalori Harian (misal: 2000)
   - Pilih Jenis Diet
   - Masukkan alergi/pantangan (opsional)
   - Pilih Tujuan Kebugaran
4. **Klik** "Buat Rencana Makan"
5. **Tunggu** sampai rencana makan muncul di kanan

## 📱 Preview

### Form Section (Kiri)
- Input field untuk kalori
- Dropdown untuk diet type
- Input untuk alergi
- Dropdown untuk fitness goal
- Submit button
- Error display

### Result Section (Kanan)
- Loading spinner dengan text
- Meal cards untuk Breakfast, Lunch, Dinner
- Setiap meal menampilkan:
  - Nama makanan (dengan emoji)
  - Kalori
  - Protein, Karbohidrat, Lemak
  - List bahan-bahan
  - Cara membuat

## ⚙️ Technical Details

### Dependencies
- `react`: UI framework
- `import.meta.env`: Vite env variables
- `../context/AuthContext`: User authentication

### API Integration
- Method: POST
- Headers: Content-Type, x-goog-api-key
- Model: gemini-pro
- Prompt format: String concatenation untuk JSON consistency

### Error Handling
- Invalid API key → Error message
- Network error → Caught and displayed
- Invalid JSON response → JSON parse error message
- Missing meal data → Structure validation

### Console Logging
Untuk debugging:
```javascript
console.log('Memproses preferences:', preferences);
console.log('Respons dari API:', data);
console.log('Rencana makan yang diurai:', parsedPlan);
```

## 🎯 Next Steps (Opsional)

1. **Save to Database:**
   - Create mealPlan table
   - POST endpoint untuk save meal plan
   - GET endpoint untuk retrieve history

2. **Additional Features:**
   - Export to PDF
   - Share meal plan
   - Rating system
   - Favorite meals

3. **Optimization:**
   - Cache results
   - Rate limiting
   - User feedback form

## 📊 Testing Checklist

- [x] API key configured
- [x] Service function created
- [x] Component UI created
- [x] Form validation works
- [x] Loading state displays
- [x] Error handling shows
- [x] Meal plan renders correctly
- [x] Responsive on mobile
- [x] Styling matches brand
- [x] Accessibility basics covered

## 🔐 Security Notes

- API key stored in .env file (not exposed to client in production)
- VITE_ prefix ensures it's included in bundle (browser-safe)
- Consider using backend proxy for production
- Rate limit API calls per user

---

**Status:** Ready for QA Testing
**Last Updated:** November 10, 2025
