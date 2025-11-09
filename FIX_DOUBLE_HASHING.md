# 🔧 FIX: Double Hashing Password Issue - RESOLVED ✅

## 🐛 **Masalah yang Ditemukan:**

### **Gejala:**
- User yang didaftarkan melalui register baru **tidak bisa login**
- User lama (sampai "trainee") **bisa login** ✅
- User baru (xas, dika, muhamad.dzaky) **tidak bisa login** ❌
- Data berhasil masuk ke MongoDB tapi password **incorrect**

### **Root Cause:**
**Double Hashing Password** - Password di-hash 2 kali!

#### Proses yang Salah:
```javascript
// 1. Di Controller (auth.controller.js)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt); // Hash #1

// 2. Save ke database
const user = new User({
  password: hashedPassword // Already hashed
});
await user.save(); // Hash #2 by pre-save hook!

// Result: Password di-hash 2 kali!
```

#### Yang Terjadi di Model (UserModel.js):
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // Hash LAGI!
  next();
});
```

### **Kenapa User Lama Bisa Login?**
User lama dibuat sebelum ada double hashing, jadi hanya di-hash 1 kali (correct).

---

## ✅ **Solusi yang Diterapkan:**

### **1. Fix Controller (auth.controller.js)**

**SEBELUM:**
```javascript
// Hash password manually di controller
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const user = new User({
  password: hashedPassword // Already hashed
});
```

**SESUDAH:**
```javascript
// Kirim plain password, biar model yang hash
const user = new User({
  password: password // Plain password - akan di-hash by model
});
```

### **2. Fix Existing Users (fix-users.js)**

Script untuk memperbaiki user yang sudah ter-double hash:

```javascript
// Hash password dengan benar (1 kali saja)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(plainPassword, salt);

// Update langsung ke database (skip pre-save hook)
await User.updateOne(
  { _id: user._id },
  { $set: { password: hashedPassword } }
);
```

---

## 📊 **User yang Sudah Diperbaiki:**

| Username | Email | Password | Status |
|----------|-------|----------|--------|
| xas | dzaky@contoh.com | `12345678` | ✅ Fixed |
| trainee dika | dika@moveon.id | `12345678` | ✅ Fixed |
| muhamad.dzaky | mau@2.com | `12345678` | ✅ Fixed |

---

## 🧪 **Testing:**

### **Test Login - User yang Sudah Diperbaiki:**

```bash
# Test 1: Login dengan username "xas"
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "xas", "password": "12345678"}'

# Test 2: Login dengan username "trainee dika"
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "trainee dika", "password": "12345678"}'

# Test 3: Login dengan email
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "mau@2.com", "password": "12345678"}'
```

### **Test Register - User Baru:**

```bash
# Register user baru (tidak akan double hash lagi)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@test.com",
    "password": "password123",
    "full_name": "New User",
    "role": "trainee"
  }'
```

---

## 🎯 **Cara Test di Frontend:**

### **1. Login User yang Sudah Diperbaiki:**

**Via Login Page:**
```
Username: xas
Password: 12345678
Role: Trainee
```

atau

```
Username: muhamad.dzaky
Password: 12345678
Role: Coach
```

### **2. Register User Baru:**

**Via Register Page:**
- Isi form register normal
- Password akan di-hash dengan benar (1 kali)
- Langsung bisa login setelah register

---

## 🔐 **Password Flow yang Benar Sekarang:**

### **Register:**
```
User Input → Plain Password
    ↓
Controller → Pass to Model (plain)
    ↓
Model pre-save hook → Hash password (1x)
    ↓
MongoDB → Stored hashed password ✅
```

### **Login:**
```
User Input → Plain Password
    ↓
Controller → Get user from DB (with password)
    ↓
bcrypt.compare(plainPassword, hashedPassword)
    ↓
Match? → Login Success ✅
```

---

## 📝 **Checklist:**

- [x] Fix auth.controller.js (hapus manual hashing)
- [x] Buat script fix-users.js
- [x] Jalankan script untuk fix existing users
- [x] Verify password fix berhasil
- [x] Restart backend server
- [x] Test login user yang sudah diperbaiki
- [x] Test register user baru
- [x] Documentation lengkap

---

## ⚠️ **Catatan Penting:**

### **Untuk User Baru ke Depannya:**
- ✅ Register akan bekerja dengan benar
- ✅ Password hanya di-hash 1 kali
- ✅ Login akan langsung bisa digunakan

### **Untuk User Lama:**
- ✅ User yang dibuat sebelum fix tetap bisa login (trainee, dll)
- ✅ User yang di-fix bisa login dengan password baru

### **Jika Ada User Lain yang Bermasalah:**
Edit file `fix-users.js` dan tambahkan user ke array:

```javascript
const usersToFix = [
  { username: 'xas', password: '12345678' },
  { username: 'trainee dika', password: '12345678' },
  { username: 'muhamad.dzaky', password: '12345678' },
  // Tambahkan user baru di sini:
  { username: 'username_baru', password: 'password_asli' }
];
```

Lalu jalankan lagi:
```bash
cd Backend
node fix-users.js
```

---

## 🎉 **Status: RESOLVED ✅**

**Masalah:** Double hashing password  
**Solusi:** Remove manual hashing di controller + fix existing users  
**Result:** Semua user sekarang bisa login dengan benar!  

**Test sekarang:**
1. Buka frontend: http://localhost:5173/login
2. Login dengan:
   - Username: `xas` atau `trainee dika` atau `muhamad.dzaky`
   - Password: `12345678`
3. Should work! ✅

---

**Updated:** November 9, 2025  
**Fixed by:** Hilmy194  
**Files Changed:** 
- `Backend/src/controllers/auth.controller.js`
- `Backend/fix-users.js` (new)
