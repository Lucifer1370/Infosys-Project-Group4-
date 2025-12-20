# Quick Start Guide

## Installation Status Check

Run this command to check what's installed:
```powershell
.\check-installation.ps1
```

## Step-by-Step Installation

### 1. Install Node.js (Required)

**Download:**
- Visit: https://nodejs.org/
- Click the **LTS** (Long Term Support) button
- Download the Windows installer (.msi file)

**Install:**
1. Run the downloaded installer
2. Click "Next" through all prompts
3. **Important:** Make sure "Automatically install the necessary tools" is checked
4. Complete the installation
5. **Restart your computer** (or at least close and reopen PowerShell)

**Verify:**
```powershell
node --version
npm --version
```
You should see version numbers.

---

### 2. Install MongoDB (Required)

**Option A: Local Installation (Recommended for learning)**

1. **Download:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Click "Download"

2. **Install:**
   - Run the installer
   - Choose "Complete" installation
   - **Important:** Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (optional but helpful)
   - Complete installation

3. **Verify:**
   ```powershell
   mongod --version
   ```

**Option B: MongoDB Atlas (Cloud - Easier, Free)**

1. Sign up at: https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (M0 FREE tier)
3. Get your connection string
4. Update `backend\.env` with the connection string

---

### 3. Install Project Dependencies

Once Node.js is installed:

```powershell
cd backend
npm install
```

This will take 2-5 minutes. Wait for it to complete.

---

### 4. Configure Environment

The `.env` file should already exist. If not, create `backend\.env`:

**For Local MongoDB:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medication_tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**For MongoDB Atlas:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/medication_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

---

### 5. Start MongoDB (Local Installation Only)

If MongoDB is installed as a service, it should start automatically.

To check:
```powershell
Get-Service -Name MongoDB
```

To start manually:
```powershell
Start-Service -Name MongoDB
```

---

### 6. Start the Backend Server

```powershell
cd backend
npm start
```

You should see:
```
MongoDB Connected: localhost:27017
Server running on port 5000
```

**Keep this terminal window open!**

---

### 7. Open the Frontend

**Simple method:**
- Navigate to project folder in File Explorer
- Double-click `index.html`

**Better method (recommended):**
```powershell
# In a NEW terminal window
cd "F:\intern1 - Copy"
npm install -g http-server
http-server -p 8000
```
Then open: http://localhost:8000

---

## Troubleshooting

### "node is not recognized"
- Restart your computer after installing Node.js
- Or manually add Node.js to PATH

### "npm install" fails
- Check internet connection
- Try: `npm install --verbose` to see detailed errors

### "MongoDB connection error"
- Make sure MongoDB is running
- Check the connection string in `.env`
- For local: Make sure MongoDB service is running

### "Port 5000 already in use"
- Change PORT in `.env` to 5001
- Or stop the process using port 5000

---

## Complete Command Sequence

```powershell
# 1. Check installation status
.\check-installation.ps1

# 2. Install backend dependencies (after Node.js is installed)
cd backend
npm install

# 3. Start backend server
npm start

# 4. In another terminal, start frontend (optional)
cd "F:\intern1 - Copy"
http-server -p 8000
```

---

## Need Help?

See `INSTALLATION_GUIDE.md` for detailed instructions with screenshots and troubleshooting.


