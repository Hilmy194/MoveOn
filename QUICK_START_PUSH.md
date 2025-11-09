# 🚀 QUICK START - Push ke GitHub

## Langkah 1: Buat Repository di GitHub
1. Buka: https://github.com/new
2. Repository name: **MoveOn**
3. Description: **Fitness coaching platform**
4. Pilih: Public atau Private
5. JANGAN centang apa-apa
6. Click: **Create repository**

## Langkah 2: Copy Commands & Jalankan

Setelah repository dibuat, GitHub akan menampilkan commands.
Copy dan jalankan di terminal:

```powershell
# 1. Commit files
git commit -m "Initial commit: MoveOn fitness coaching platform"

# 2. Rename branch ke main
git branch -M main

# 3. Add remote (GANTI YOUR_USERNAME dengan username GitHub Anda!)
git remote add origin https://github.com/YOUR_USERNAME/MoveOn.git

# 4. Push!
git push -u origin main
```

## Contoh dengan Username:

Jika username GitHub Anda adalah `johndoe`, maka:

```powershell
git commit -m "Initial commit: MoveOn fitness coaching platform"
git branch -M main
git remote add origin https://github.com/johndoe/MoveOn.git
git push -u origin main
```

## Authentication

Saat push, akan diminta:
- **Username**: GitHub username Anda
- **Password**: Personal Access Token (bukan password biasa!)

### Cara Buat Token (jika belum punya):
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Centang: `repo` dan `workflow`
5. Generate token
6. **COPY dan SIMPAN** token tersebut
7. Gunakan sebagai password saat push

## Setelah Push Berhasil:

Repository akan tersedia di:
```
https://github.com/YOUR_USERNAME/MoveOn
```

## Troubleshooting:

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/MoveOn.git
```

### Error: "authentication failed"
- Pastikan menggunakan Personal Access Token, bukan password
- Generate token baru di GitHub Settings

### Error: "repository not found"
- Pastikan repository sudah dibuat di GitHub
- Check URL remote: `git remote -v`
