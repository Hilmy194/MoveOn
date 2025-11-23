# MoveOn — Testing Documentation

Versi: 1.0
Tanggal: 16 Nov 2025
Cakupan: Setup pengujian, cara menjalankan pengujian per level, struktur folder yang disarankan, template test case & bug report, prioritas kasus, checklists (API/UI/security/performance/a11y), integrasi CI/CD, dan skrip UAT.

## 1) Ringkasan & Tujuan
- Memastikan fitur inti (auth, coach-trainee, assignments, submissions, dashboard) berjalan stabil dan aman.
- Menyediakan panduan cepat untuk QA/dev menjalankan pengujian lokal maupun CI.

## 2) Prasyarat
- OS: Windows 10/11
- Node.js: 22.x (backend), 18.x+ (frontend dev OK)
- Paket manajer: npm
- MongoDB: Atlas (via `MONGO_URI`) atau Mongo lokal
- ENV:
  - Backend: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`
  - Frontend: `VITE_API_URL=http://localhost:5000/api`

## 3) Menjalankan Aplikasi (Dev)
Jalankan backend dan frontend di terminal terpisah.

```powershell
# Backend
cd Backend; npm install; npm run dev

# Frontend (Vite)
cd Frontend; npm install; npm run dev
```

Default URL: Backend `http://localhost:5000`, Frontend `http://localhost:5173` (otomatis pindah ke 5174 bila bentrok).

## 4) Struktur Folder Pengujian (Disarankan)
- Backend tests (API/Integration): `Backend/tests/**/*.test.js`
- Frontend E2E (Cypress): `Frontend/cypress/**/*`
- Kinerja (k6): `tests/perf/**/*.js`
- Koleksi API (Postman/Insomnia): `tests/api_collections/**`

Catatan: Struktur ini rekomendasi. Belum seluruhnya ada di repo; buat saat diperlukan.

## 5) Pengujian API via curl (Cepat Coba)
Ganti token/id sesuai hasil login.

```powershell
# 1) Login (Coach atau Trainee)
$body = @{ email = "tescoach2@moveon.id"; password = "12345678" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/auth/login -ContentType 'application/json' -Body $body

# Simpan token ke var (contoh PowerShell)
$token = "<JWT_TOKEN>"

# 2) Ambil trainees (Coach)
Invoke-RestMethod -Headers @{Authorization = "Bearer $token"} -Uri http://localhost:5000/api/coach/trainees -Method Get

# 3) Ambil assignments Trainee
$traineeId = "<TRAINEE_USER_ID>"
Invoke-RestMethod -Headers @{Authorization = "Bearer $token"} -Uri http://localhost:5000/api/assignments/trainee/$traineeId -Method Get

# 4) Submit task (Trainee)
$submission = @{ assignment_id = "<ASSIGNMENT_ID>"; duration=45; calories=300; notes="Evening run" } | ConvertTo-Json
Invoke-RestMethod -Headers @{Authorization = "Bearer $token"} -Uri http://localhost:5000/api/submissions -Method Post -ContentType 'application/json' -Body $submission

# 5) Review submission (Coach)
$review = @{ status="approved"; comment="Well done" } | ConvertTo-Json
Invoke-RestMethod -Headers @{Authorization = "Bearer $token"} -Uri http://localhost:5000/api/submissions/<SUBMISSION_ID>/review -Method Patch -ContentType 'application/json' -Body $review
```

## 6) Level & Cara Menjalankan Tes
Berikut opsi implementasi (opsional jika belum tersedia di repo):

- Unit (Backend): Jest
  - Install: `npm i -D jest @types/jest ts-jest` (jika TS) atau `npm i -D jest`
  - Script contoh (Backend/package.json): `{ "test": "jest" }`
  - Target: validator, utils, controller dengan mocking DB.

- API/Integration (Backend): Supertest + Jest
  - Install: `npm i -D supertest jest`
  - Contoh: `Backend/tests/auth.test.js` menguji `/api/auth/login` sukses/gagal.

- E2E UI (Frontend): Cypress
  - Install: `npm i -D cypress`
  - Run: `npx cypress open` (interaktif) atau `npx cypress run` (headless)
  - Skenario: login, coach melihat trainee, assign task, trainee submit, coach review.

- Performance: k6
  - Install: k6 (CLI)
  - Run: `k6 run tests/perf/smoke.js`
  - Target: p95 < 300ms untuk endpoint utama pada 50 RPS.

- Aksesibilitas: axe DevTools (browser) atau `@axe-core/react` di dev.

## 7) Prioritas Kasus Uji (Ringkas)
- Auth: login valid/invalid, token expired → 401 → logout.
- Coach: list trainees, add trainee, detail trainee load aman saat data kosong.
- Assignment: buat/assign, trainee start, status in_progress → completed.
- Submission: trainee submit, coach lihat dan review (approve/reject).
- Dashboard: metrik aman saat nilai null/undefined (tidak crash).

## 8) Template Test Case
```
ID: TC-<num>
Judul: <ringkas>
Prasyarat: <state, akun, data>
Langkah:
  1) ...
  2) ...
Data Uji: <input>
Hasil yang Diharapkan: <ekspektasi>
Catatan: <opsional>
```

## 9) Template Bug Report
```
ID: BUG-<num>
Ringkasan: <singkat>
Lingkungan: <OS/Browser/commit>
Langkah Repro:
  1) ...
  2) ...
Hasil Aktual: <apa yang terjadi>
Hasil Harapan: <seharusnya>
Bukti: <screenshot/log>
Severity: <Blocker/Critical/Major/Minor/Trivial>
Priority: <P0-P3>
Tambahan: <mitigasi/rekomendasi>
```

## 10) Checklists
- API
  - Status codes konsisten (2xx/4xx/5xx), schema stabil, pagination (jika ada)
  - Auth header wajib, RBAC role (coach/trainee) benar
  - ID benar (bedakan `task_id` vs `assignment_id`), validasi body/query

- UI/UX
  - Loading, empty, error states muncul dengan jelas
  - Navigasi detail trainee benar (`/coach/trainee/:id`), tanpa 404
  - Form input validasi & feedback error

- Security
  - JWT validasi/expiry, logout aman
  - Proteksi route backend dengan middleware auth
  - Hindari kebocoran data pada respons/stack trace

- Performance
  - p95 < 300ms endpoint utama, cache header (opsional)
  - N+1 query dihindari, gunakan indeks DB bila relevan

- Accessibility
  - Kontras warna, fokus yang terlihat, teks alternatif
  - Navigasi keyboard, form label jelas

## 11) UAT Scripts (Ringkas)
- UAT-1 Trainee alur lengkap
  - Register → login → lihat tasks → start → complete + submit → cek status
  - Kriteria OK: status assignment menjadi `completed`, submission terlihat di Coach
- UAT-2 Coach kelola trainee & review
  - Login → tambah trainee → assign task → lihat progress → review submission
  - Kriteria OK: trainee muncul di daftar, assignment tampil, review tercatat

## 12) CI/CD (Contoh GitHub Actions)
Tambahkan workflow (opsional) `.github/workflows/test.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22.x' }
      - run: npm ci
      - run: npm test --if-present
  test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18.x' }
      - run: npm ci
      - run: npm run build --if-present
```

## 13) Troubleshooting Cepat
- 401 di frontend: cek interceptor token & expiry → relogin
- 404 `submissions`: pastikan route dimount di `Backend/server.js`
- Crash detail trainee: hindari referensi field mock (mis. `streak`), gunakan data computed
- Port 5173 bentrok: Vite pindah otomatis (lihat terminal)

## 14) Referensi
- `TEST_PLAN.md`
- `INTEGRATION_CHECKLIST.md`, `TRAINEE_TESTING_GUIDE.md`, `COACH_TRAINEES_INTEGRATION.md`
