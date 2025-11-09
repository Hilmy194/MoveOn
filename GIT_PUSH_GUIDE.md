# 🚀 Git & GitHub Push Guide

## 📋 Checklist Sebelum Push

### ✅ 1. Verifikasi File Sensitif
Pastikan file-file ini **TIDAK** akan ter-commit:

```bash
# Check apakah file .env sudah di-ignore
git status
```

File yang **TIDAK BOLEH** di-push:
- ❌ `.env`
- ❌ `.env.local`
- ❌ `node_modules/`
- ❌ Database credentials
- ❌ API keys
- ❌ `package-lock.json` (optional, tapi lebih baik di-ignore)

File yang **HARUS** di-push:
- ✅ `.env.example`
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ Source code
- ✅ `package.json`

---

## 🎯 Langkah-Langkah Push ke GitHub

### Step 1: Initialize Git Repository

```powershell
# Masuk ke root folder project
cd c:\Users\mhilm\Downloads\MoveOn

# Initialize git
git init

# Verify git initialized
git status
```

### Step 2: Buat Repository di GitHub

1. Buka https://github.com
2. Click **"New repository"**
3. Isi detail:
   - **Repository name**: `MoveOn` atau `moveon-fitness-app`
   - **Description**: "Fitness coaching platform connecting coaches with trainees"
   - **Visibility**: Public atau Private (pilih sesuai kebutuhan)
   - ❌ **JANGAN** centang "Initialize with README" (karena sudah ada)
4. Click **"Create repository"**

### Step 3: Stage Files

```powershell
# Add semua file (kecuali yang ada di .gitignore)
git add .

# Atau add file tertentu saja
git add Backend/src/
git add Frontend/src/
git add README.md
git add .gitignore
```

### Step 4: Verify What Will Be Committed

```powershell
# Check status - pastikan .env TIDAK ada di sini
git status

# Check apa yang akan di-commit
git diff --cached
```

**🚨 PENTING**: Jika melihat `.env` atau credentials, STOP dan jalankan:
```powershell
git reset HEAD .env
git reset HEAD Backend/.env
git reset HEAD Frontend/.env.local
```

### Step 5: First Commit

```powershell
# Commit dengan pesan yang jelas
git commit -m "Initial commit: MoveOn fitness coaching platform

- Add backend API with Express, MongoDB, PostgreSQL support
- Add frontend React app with Vite and TailwindCSS
- Implement coach and trainee features
- Add authentication with JWT
- Include task management system
- Add comprehensive documentation"
```

### Step 6: Add Remote Repository

```powershell
# Ganti YOUR_USERNAME dengan username GitHub Anda
git remote add origin https://github.com/YOUR_USERNAME/MoveOn.git

# Verify remote
git remote -v
```

### Step 7: Push to GitHub

```powershell
# Push ke branch main
git branch -M main
git push -u origin main
```

Jika diminta login:
- Username: GitHub username Anda
- Password: Gunakan **Personal Access Token** (bukan password biasa)

---

## 🔑 Membuat Personal Access Token

Jika belum punya token:

1. Go to GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Pilih scopes:
   - ✅ `repo` (full control)
   - ✅ `workflow`
5. Copy token dan simpan dengan aman
6. Gunakan token ini sebagai password saat push

---

## 📁 Struktur yang Akan Di-Push

```
MoveOn/
├── .gitignore                    ✅ Push
├── README.md                     ✅ Push
├── CONTRIBUTING.md               ✅ Push
├── package.json                  ✅ Push
├── *.md (documentation files)    ✅ Push
├── Backend/
│   ├── .env                      ❌ TIDAK (di .gitignore)
│   ├── .env.example             ✅ Push
│   ├── .gitignore               ✅ Push
│   ├── package.json             ✅ Push
│   ├── server.js                ✅ Push
│   ├── src/                     ✅ Push
│   └── node_modules/            ❌ TIDAK (di .gitignore)
├── Frontend/
│   ├── .env.local               ❌ TIDAK (di .gitignore)
│   ├── .env.example             ✅ Push
│   ├── .gitignore               ✅ Push
│   ├── package.json             ✅ Push
│   ├── src/                     ✅ Push
│   └── node_modules/            ❌ TIDAK (di .gitignore)
└── my-project/
    └── (same structure)
```

---

## 🔍 Troubleshooting

### Issue 1: File .env Ter-commit

```powershell
# Hapus dari git (tapi tidak hapus file)
git rm --cached Backend/.env
git rm --cached Frontend/.env.local

# Commit removal
git commit -m "Remove sensitive environment files"

# Push
git push
```

### Issue 2: Lupa Tambah File di .gitignore

```powershell
# Edit .gitignore
# Add file yang lupa

# Remove from git
git rm --cached <filename>

# Commit
git commit -m "Update .gitignore"
git push
```

### Issue 3: node_modules Ter-commit (Ukuran Besar)

```powershell
# Remove dari git
git rm -r --cached node_modules/
git rm -r --cached Backend/node_modules/
git rm -r --cached Frontend/node_modules/
git rm -r --cached my-project/node_modules/

# Commit
git commit -m "Remove node_modules from git"
git push
```

### Issue 4: Push Rejected

```powershell
# Pull changes first
git pull origin main --rebase

# Resolve conflicts if any
# Then push
git push origin main
```

---

## 🌿 Branching Strategy (Recommended)

### For Features:
```powershell
# Create feature branch
git checkout -b feature/task-management

# Work on feature
# ...commit changes...

# Push feature branch
git push origin feature/task-management

# Create Pull Request di GitHub
```

### For Bug Fixes:
```powershell
git checkout -b fix/auth-issue
# ...fix and commit...
git push origin fix/auth-issue
```

### Branch Naming Convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `hotfix/` - Urgent fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

---

## 📊 Best Practices

### ✅ DO:
1. **Commit sering** dengan pesan yang jelas
2. **Review** sebelum push (`git status`, `git diff`)
3. **Pull** sebelum push jika kolaborasi
4. **Branch** untuk setiap fitur baru
5. **Test** sebelum commit
6. **Documentation** update bersamaan dengan code

### ❌ DON'T:
1. **Jangan** commit file sensitive (`.env`, credentials)
2. **Jangan** commit `node_modules/`
3. **Jangan** commit log files
4. **Jangan** commit file binary besar
5. **Jangan** force push ke main branch
6. **Jangan** commit dengan pesan "update" atau "fix"

---

## 📝 Commit Message Guidelines

### Good Examples:
```bash
✅ git commit -m "feat(auth): add OAuth2 login support"
✅ git commit -m "fix(dashboard): resolve trainee count display bug"
✅ git commit -m "docs: update API documentation for task endpoints"
✅ git commit -m "refactor(models): optimize database queries"
```

### Bad Examples:
```bash
❌ git commit -m "update"
❌ git commit -m "fix"
❌ git commit -m "changes"
❌ git commit -m "asdf"
```

---

## 🔐 Security Checklist

Before pushing, verify:
- [ ] No `.env` files in staging area
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No database credentials
- [ ] No authentication tokens
- [ ] `.gitignore` is properly configured
- [ ] `.env.example` has placeholder values only

---

## 📚 Useful Git Commands

```powershell
# Check status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote URL
git remote -v

# View what will be committed
git diff --cached

# View differences
git diff

# Create and switch to new branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# Delete branch
git branch -d branch-name

# View all branches
git branch -a
```

---

## 🎓 Next Steps After Push

1. **Add GitHub Actions** untuk CI/CD
2. **Setup Branch Protection Rules**
3. **Add Issues Templates**
4. **Create Project Board**
5. **Add Contributors**
6. **Setup Webhooks** (if needed)
7. **Enable GitHub Pages** (untuk documentation)

---

## 📞 Need Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- GitHub Support: https://support.github.com

---

**Ready to push? Run the commands step by step! 🚀**
