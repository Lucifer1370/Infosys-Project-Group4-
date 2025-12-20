# How to Run the Project - Step by Step

## Current Status
✅ MongoDB is running  
✅ Backend dependencies are installed  
✅ .env file exists  
❌ Node.js is NOT installed (required to run the server)

---

## STEP 1: Install Node.js (REQUIRED)

**You MUST do this first before running the project!**

1. **Download Node.js:**
   - Go to: **https://nodejs.org/**
   - Click the big green button that says **"LTS"** (Long Term Support)
   - This will download a file like `node-v20.x.x-x64.msi`

2. **Install Node.js:**
   - Double-click the downloaded file
   - Click "Next" through all the installation steps
   - **Important:** Make sure "Automatically install the necessary tools" is checked
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **RESTART YOUR COMPUTER** (or at least close ALL PowerShell/Command Prompt windows)

4. **Verify Installation:**
   - Open a NEW PowerShell window
   - Run these commands:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., `v20.10.0` and `10.2.3`)
   - If you see "command not found", restart your computer and try again

---

## STEP 2: Start the Backend Server

Once Node.js is installed:

1. **Open PowerShell in the project folder:**
   ```powershell
   cd "F:\intern1 - Copy\backend"
   ```

2. **Start the server:**
   ```powershell
   npm start
   ```

3. **You should see:**
   ```
   MongoDB Connected: localhost:27017
   Server running on port 5000
   ```

4. **Keep this window open!** The server must keep running.

---

## STEP 3: Open the Frontend

**Option 1: Simple (Just open the HTML file)**
- Navigate to `F:\intern1 - Copy` in File Explorer
- Double-click `index.html`
- It will open in your default browser

**Option 2: Using a Local Server (Recommended)**
1. Open a **NEW** PowerShell window (keep the backend server running in the first window)
2. Run:
   ```powershell
   cd "F:\intern1 - Copy"
   npm install -g http-server
   http-server -p 8000
   ```
3. Open your browser and go to: **http://localhost:8000**

---

## STEP 4: Test the Application

1. **Sign Up:**
   - Select a role (Patient, Doctor, Pharmacy, or Admin)
   - Enter your full name, email, and password
   - If Doctor: Enter Medical License Number and Specialization
   - If Pharmacy: Enter Pharmacy License Number and Address
   - Click "Sign Up"

2. **Login:**
   - Enter the email and password you just created
   - Click "Login"
   - You should be redirected to the dashboard

3. **Create a Prescription (Doctor only):**
   - Go to the "Prescriptions" page
   - Fill in medication details:
     - Medicine Name
     - Dose/Frequency
     - Notes
     - Start Date
     - Status
   - Click "Add Medication"
   - If you're a Doctor, you'll be prompted to enter a patient email

4. **View Prescriptions:**
   - Patients see only their own prescriptions
   - Doctors see prescriptions they created
   - Pharmacy and Admin see all prescriptions

---

## Complete Command Sequence

**Terminal 1 (Backend Server):**
```powershell
cd "F:\intern1 - Copy\backend"
npm start
```
*Keep this running!*

**Terminal 2 (Frontend Server - Optional):**
```powershell
cd "F:\intern1 - Copy"
http-server -p 8000
```
*Or just open index.html in browser*

---

## Troubleshooting

### "node is not recognized"
- **Solution:** Restart your computer after installing Node.js
- Or manually add Node.js to PATH (usually `C:\Program Files\nodejs\`)

### "npm is not recognized"
- **Solution:** npm comes with Node.js. Reinstall Node.js and restart.

### "MongoDB connection error"
- **Solution:** MongoDB service is already running (good!), but check:
  ```powershell
  Get-Service -Name MongoDB
  ```
  If not running: `Start-Service -Name MongoDB`

### "Port 5000 already in use"
- **Solution:** Change PORT in `backend\.env` to 5001
- Or stop the process using port 5000:
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### "Cannot find module" errors
- **Solution:** Reinstall dependencies:
  ```powershell
  cd backend
  npm install
  ```

### Backend starts but frontend can't connect
- **Check:** Make sure backend is running on port 5000
- **Check:** Open browser console (F12) and look for CORS errors
- **Check:** Verify `API_BASE_URL` in `app.js` is `http://localhost:5000/api`

---

## Quick Checklist

Before running:
- [ ] Node.js installed (https://nodejs.org/)
- [ ] Computer restarted after Node.js installation
- [ ] MongoDB service running (already done ✅)
- [ ] Backend dependencies installed (already done ✅)
- [ ] .env file exists (already done ✅)

To run:
- [ ] Open PowerShell in `backend` folder
- [ ] Run `npm start`
- [ ] See "Server running on port 5000"
- [ ] Open `index.html` in browser
- [ ] Test signup and login

---

## Need Help?

If you get stuck:
1. Run `.\check-installation.ps1` to see what's missing
2. Check `INSTALLATION_GUIDE.md` for detailed instructions
3. Check browser console (F12) for errors
4. Check backend terminal for error messages

---

**Remember:** You MUST install Node.js first before you can run the project!


