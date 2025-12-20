# 🚀 Quick Start: Running the Project

## Problem: "ERR_CONNECTION_REFUSED"

This means the frontend server is not running. You need **TWO servers** running:
1. **Backend Server** (Node.js) - Port 5000 ✅ Already running
2. **Frontend Server** (HTTP Server) - Port 5500 ❌ Needs to be started

---

## ✅ Solution: Start Frontend Server

### Option 1: Using Python (Easiest - Recommended)

1. **Check if Python is installed:**
   ```powershell
   python --version
   ```

2. **If Python is installed, start frontend server:**
   ```powershell
   python -m http.server 5500
   ```

3. **Open browser:**
   - Go to: `http://localhost:5500`
   - The page will redirect to login automatically

---

### Option 2: Using npm http-server

1. **Install http-server globally:**
   ```powershell
   npm install -g http-server
   ```

2. **Start frontend server:**
   ```powershell
   npx http-server -p 5500 -c-1
   ```

3. **Open browser:**
   - Go to: `http://localhost:5500`

---

### Option 3: Using VS Code Live Server Extension

1. **Install "Live Server" extension in VS Code**

2. **Right-click on `index.html` → "Open with Live Server"**

3. **Browser opens automatically**

---

### Option 4: Use the PowerShell Script

**Simply run:**
```powershell
.\start-project.ps1
```

This script will:
- ✅ Check if backend is running (start if needed)
- ✅ Start frontend server automatically
- ✅ Open browser for you

---

## 📋 Manual Steps

### Terminal 1: Backend Server
```powershell
cd backend
npm start
```
Should show: `Server running on port 5000`

### Terminal 2: Frontend Server

**If you have Python:**
```powershell
python -m http.server 5500
```

**Or if you have http-server:**
```powershell
npx http-server -p 5500 -c-1
```

---

## 🌐 Access URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:5500 | ⚠️ Start this |
| **Backend API** | http://localhost:5000/api | ✅ Running |
| **Health Check** | http://localhost:5000/api/health | ✅ Running |

---

## ✅ Verification

1. **Backend is running:**
   - Open: http://localhost:5000/api/health
   - Should show: `{"success":true,"message":"Server is running"}`

2. **Frontend is running:**
   - Open: http://localhost:5500
   - Should show: Login page (or redirect to login)

---

## 🎯 Quick Fix

**Just run this PowerShell command:**
```powershell
python -m http.server 5500
```

Then open: http://localhost:5500

That's it! 🎉

