# 🔧 Troubleshooting Guide

## Problem: Frontend Not Working

### Step 1: Check What's Running

**Check if backend is running:**
```powershell
netstat -ano | findstr ":5000"
```
Should show: `LISTENING` on port 5000

**Check if frontend is running:**
```powershell
netstat -ano | findstr ":5500"
```
Should show: `LISTENING` on port 5500

---

### Step 2: Start Frontend Server

**Option A: Simple PowerShell Script**
```powershell
.\start-frontend.ps1
```

**Option B: Manual Command**
```powershell
python -m http.server 5500
```

**Option C: From frontend folder**
```powershell
cd frontend
python -m http.server 5500
```

---

### Step 3: Verify Access

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/health
   - Should show: `{"success":true,"message":"Server is running"}`

2. **Frontend Access:**
   - Open: http://localhost:5500
   - Should show: Login page or redirect to login

---

### Step 4: Common Issues

#### Issue: Port Already in Use
**Solution:**
```powershell
# Find process using port 5500
netstat -ano | findstr ":5500"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Then start server again
python -m http.server 5500
```

#### Issue: Python Not Found
**Solution:**
- Install Python from python.org
- Or use VS Code Live Server extension
- Or install http-server: `npm install -g http-server`

#### Issue: Wrong Port
**Check:**
- Backend should be on port 5000
- Frontend should be on port 5500
- Don't confuse them!

#### Issue: CORS Errors
**Solution:**
- Make sure backend is running
- Check backend/server.js has CORS enabled
- Verify API_BASE_URL in frontend/js/app.js is `http://localhost:5000/api`

---

### Step 5: Complete Restart

**Kill all servers and restart:**

```powershell
# Kill all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill Python server on port 5500
$connection = Get-NetTCPConnection -LocalPort 5500 -ErrorAction SilentlyContinue
if ($connection) {
    Stop-Process -Id $connection.OwningProcess -Force
}

# Start backend
cd backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

# Start frontend
cd ..
python -m http.server 5500
```

---

### Step 6: Test Everything

1. ✅ Backend running: http://localhost:5000/api/health
2. ✅ Frontend running: http://localhost:5500
3. ✅ Login page loads
4. ✅ Can register/login
5. ✅ API calls work (check browser DevTools → Network tab)

---

## 🆘 Still Not Working?

1. **Check browser console (F12)** for errors
2. **Check Network tab** for failed requests
3. **Verify both servers are running** (two separate terminal windows)
4. **Try different browser** (Chrome, Edge, Firefox)
5. **Check firewall** isn't blocking ports 5000/5500

---

## 📞 Quick Fix Commands

**Start everything fresh:**
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd ..
python -m http.server 5500
```

Then open: http://localhost:5500

