# MoveOn — Software Test Plan (STP)

Versi: 1.0
Tanggal: 16 Nov 2025
Produk: MoveOn (Frontend React + Vite, Backend Node.js/Express, MongoDB)

## 1. Pendahuluan
- Tujuan: Mendefinisikan ruang lingkup, strategi, jadwal, lingkungan, peran, dan kriteria keberhasilan pengujian untuk memastikan kualitas rilis MoveOn.
- Referensi:
  - Backend: `Backend/README.md`, `src/routes/*`, `src/controllers/*`
  - Frontend: `Frontend/README.md`, `src/pages/*`, `src/services/api.js`
  - Dokumen internal: `COACH_FEATURES.md`, `TRAINEE_API.md`, `TRAINEE_TESTING_GUIDE.md`, `BACKEND_REQUIREMENTS.md`

## 2. Ruang Lingkup
### 2.1 Dalam ruang lingkup
- Fungsionalitas inti peran Coach & Trainee:
  - Autentikasi (register, login, token refresh, logout)
  - Manajemen Trainee oleh Coach (lihat daftar, tambah, hapus, detail)
  - Manajemen Task/Assignment (buat task, assign, lihat, update status)
  - Submission Trainee (submit bukti, durasi, kalori) dan review Coach
  - Dashboard/Progress (statistik, ringkasan)
  - Notifikasi (ambil dan tandai dibaca)
- Non-fungsional prioritas:
  - Keamanan (JWT, otorisasi RBAC, validasi input)
  - Kinerja (latensi API p95, throughput, beban ringan–sedang)
  - Ketersediaan dan reliabilitas dasar (error handler, retry ringan)

### 2.2 Di luar ruang lingkup (rilis ini)
- Integrasi pembayaran/3rd-party non-tercantum
- Mobile native app
- SLA produksi tingkat enterprise (failover multi-region)

## 3. Tujuan & KPI Kualitas
- Defect escape rate < 2% (bug kritikal di produksi)
- p95 latensi endpoint utama < 300 ms untuk 50 RPS beban uji
- Tingkat keberhasilan skenario E2E kritikal ≥ 95%
- Cakupan unit test minimal 60% untuk modul utilitas & controller kunci

## 4. Fitur yang Diuji
- Auth: `/api/auth/*`
- Coach: `/api/coach/*` (trainees, profile, tasks)
- Tasks: `/api/tasks/*`
- Assignments: `/api/assignments/*`
- Submissions: `/api/submissions/*`
- Trainee: `/api/trainee/*`
- Dashboard/Notifications/Templates sesuai rute masing-masing

## 5. Risiko & Mitigasi
- Password hashing/validasi salah → UAT regresi login + script verifikasi akun dummy.
- Perbedaan ID (task_id vs assignment_id) → Tes kontrak API + lintasan E2E start/complete/submit.
- Ketergantungan DB Atlas → Seed data lokal & fallback connection.
- Token invalid/expired → Interceptor axios + tes 401 flow logout.

## 6. Strategi Pengujian
### 6.1 Level Pengujian
- Unit: utilitas, validator, response helper, controller dengan mocking DB.
- API/Service (Integration): controller + route via Supertest.
- Integrasi: lintasan modul (Auth → Coach → Assignment → Submission).
- E2E UI: skenario user nyata dengan Cypress (coach & trainee).
- UAT: verifikasi fitur oleh pemilik produk dengan skrip UAT.
- Non-Fungsional: kinerja (k6), keamanan (checklist OWASP top 10 dasar), aksesibilitas (axe devtools).

### 6.2 Prioritas Skenario Kritis (Happy Paths)
1. Trainee register → login → lihat tasks → start → complete + submit → coach melihat & approve.
2. Coach login → tambah trainee → buat & assign task → lihat status pengerjaan.
3. Auth token kedaluwarsa → redirect login & state aman.
4. Error UI fallback: halaman detail trainee ketika data kosong/terlambat.

## 7. Lingkungan Uji
- OS: Windows 10/11
- Node.js: 22.x (backend), 18.x+ (frontend dev ok)
- DB: MongoDB Atlas (variabel `.env`), opsi Mongo lokal untuk dev
- URL:
  - Backend: `http://localhost:5000` (`/api`)
  - Frontend: `http://localhost:5173` atau `5174`
- Variabel ENV contoh:
  - Backend: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`, `NODE_ENV=development`
  - Frontend: `VITE_API_URL=http://localhost:5000/api`
- Data uji minimal:
  - Coach: `tescoach2 / 12345678`
  - Trainee: `dika@moveon.id / 12345678`

## 8. Data Uji & Manajemen
- Seed ringan: 1 coach, 1–3 trainee, 2 task (beginner/intermediate).
- Pembuatan data melalui API (POST) dalam pre-test step.
- Masking: tanpa menyimpan data sensitif nyata.

## 9. Peran & Tanggung Jawab
- QA: Menulis kasus uji, eksekusi, pelaporan, regresi.
- Dev Backend/Frontend: perbaikan bug, unit/integration tests.
- PO: validasi UAT & keputusan go/no-go.

## 10. Jadwal & Milestone (Contoh)
- T-5 hari: Finalisasi test case + seed data.
- T-3 hari: Sesi API & E2E pass ≥ 90%.
- T-2 hari: Non-fungsional (k6) + keamanan dasar.
- T-1 hari: UAT sign-off.

## 11. Proses Defect & SLA
- Severity: Blocker, Critical, Major, Minor, Trivial.
- Priority: P0–P3.
- SLA contoh: P0/P1 fix dalam 24–48 jam dev; P2 3–5 hari; P3 sesuai sprint.
- Workflow: New → Triaged → In-Progress → In-Review → Resolved → Verified → Closed.

## 12. Metrik & Pelaporan
- Pass/Fail per suite, jumlah defect per severity, cakupan test, p95 latensi.
- Laporan harian selama fase uji + ringkasan rilis.

## 13. Kriteria Masuk/Keluar
- Entry: Build lulus, env siap, akun dummy tersedia, rute API stabil.
- Exit: Semua kasus prioritas tinggi lulus, tidak ada defect P0/P1 terbuka, UAT sign-off.

## 14. Traceability (contoh ringkas)
| Requirement/Fitur | Endpoint/Komponen | Tipe Tes | Kasus Utama |
|---|---|---|---|
| Login/Logout | `/api/auth/login`, interceptor FE | API, E2E | Login valid/invalid, 401 redirect |
| Kelola Trainee | `/api/coach/trainees*` | API, E2E | List/tambah/hapus/detail |
| Assign Task | `/api/tasks`, `/api/assignments` | API, E2E | Buat task, assign multi trainee |
| Submission | `/api/submissions` | API, E2E | Submit trainee, review coach |
| Progress | Dashboard/Progress pages | UI, API | Statistik aman saat nilai null |

## 15. Persetujuan
- QA Lead: ___________________
- Tech Lead: _________________
- Product Owner: _____________
