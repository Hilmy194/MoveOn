# ✅ Pre-Push Checklist - MoveOn Project

Centang setiap item sebelum push ke GitHub!

## 🔐 Security Check

- [ ] File `.env` di Backend **TIDAK** akan ter-commit
- [ ] File `.env.local` di Frontend **TIDAK** akan ter-commit  
- [ ] File `.gitignore` sudah dibuat di root folder
- [ ] MongoDB URI credentials **TIDAK** ada di code
- [ ] JWT Secret **TIDAK** hardcoded di code
- [ ] Supabase credentials **TIDAK** ada di code
- [ ] File `.env.example` sudah dibuat (dengan placeholder values)

## 📁 Files Check

- [ ] `node_modules/` di-exclude dari git
- [ ] `package-lock.json` di-exclude (sudah ada di .gitignore)
- [ ] `.vscode/` di-exclude (sudah ada di .gitignore)
- [ ] Log files tidak ter-commit
- [ ] Build files (`dist/`, `build/`) tidak ter-commit
- [ ] Temporary files tidak ter-commit

## 📝 Documentation Check

- [ ] `README.md` sudah dibuat dan informatif
- [ ] `.env.example` files sudah tersedia
- [ ] `CONTRIBUTING.md` sudah dibuat
- [ ] API documentation up-to-date
- [ ] Setup instructions lengkap

## 🧪 Code Quality Check

- [ ] No console.log di production code (atau minimal tidak excessive)
- [ ] No commented-out code yang tidak perlu
- [ ] Code formatting konsisten
- [ ] No hardcoded credentials atau API keys
- [ ] All imports used (no unused imports)

## 🎯 Git Commands to Run

```powershell
# 1. Initialize Git (if not done)
git init

# 2. Check what will be committed
git status

# 3. VERIFY no sensitive files listed!
# If you see .env, STOP and fix .gitignore

# 4. Add files
git add .

# 5. Check again
git status

# 6. Commit
git commit -m "Initial commit: MoveOn fitness coaching platform"

# 7. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/MoveOn.git

# 8. Push
git branch -M main
git push -u origin main
```

## ⚠️ STOP If You See These in `git status`:

- ❌ `Backend/.env`
- ❌ `Frontend/.env.local`
- ❌ `node_modules/`
- ❌ `package-lock.json`
- ❌ Any file containing passwords/tokens

If you see any of above:
```powershell
# Remove from staging
git reset HEAD <filename>

# Update .gitignore
# Then add again
git add .
```

## ✅ Good to See in `git status`:

- ✅ `Backend/src/`
- ✅ `Frontend/src/`
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `package.json`
- ✅ `.env.example`

## 🎉 After First Push Success

- [ ] Verify repository on GitHub
- [ ] Check README renders correctly
- [ ] Clone to different location to test
- [ ] Add collaborators (if team project)
- [ ] Setup GitHub Actions (optional)
- [ ] Add repository description
- [ ] Add topics/tags on GitHub

## 📊 Project Info for GitHub

**Repository Description:**
```
Fitness coaching platform connecting coaches with trainees for workout management, progress tracking, and communication
```

**Topics/Tags:**
```
fitness, coaching, react, nodejs, mongodb, express, tailwindcss, jwt-authentication, workout-tracker
```

**Features to Highlight in Repo:**
- ⭐ Coach-Trainee Management
- ⭐ Task Assignment System  
- ⭐ Progress Tracking
- ⭐ Real-time Chat
- ⭐ JWT Authentication
- ⭐ Responsive Design

---

## 🆘 Emergency: If .env Was Pushed

```powershell
# 1. Remove from git (but keep local file)
git rm --cached Backend/.env
git rm --cached Frontend/.env.local

# 2. Commit removal
git commit -m "Remove sensitive environment files"

# 3. Push
git push

# 4. IMPORTANT: Rotate all credentials!
# - Change MongoDB password
# - Generate new JWT secret
# - Change all API keys
# - Update .env locally with new values
```

---

**All checked? Ready to push! 🚀**

```powershell
git push -u origin main
```
