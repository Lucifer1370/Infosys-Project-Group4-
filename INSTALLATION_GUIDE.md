# Complete Installation Guide

## Step 1: Install Node.js

### Download and Install Node.js

1. **Visit the Official Node.js Website:**
   - Go to: https://nodejs.org/
   - Click on the **LTS (Long Term Support)** version button (recommended)
   - This will download the Windows installer (.msi file)
2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - **Important:** Check the box that says "Automatically install the necessary tools" (this installs npm and other tools)
   - Accept the license agreement
   - Choose the default installation path (usually `C:\Program Files\nodejs\`)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"
3. **Verify Installation:**
   - Open a **NEW** PowerShell or Command Prompt window (important: close and reopen if one was already open)
   - Run these commands:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., `v20.10.0` and `10.2.3`)
   - If you see "command not found", restart your computer and try again

### Alternative: Using Chocolatey (if you have it)

If you have Chocolatey package manager installed:
```powershell
choco install nodejs-lts
```

---

## Step 2: Install MongoDB

### Option A: MongoDB Community Edition (Local Installation)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - **Version:** Latest (or 7.0)
     - **Platform:** Windows
     - **Package:** MSI
   - Click "Download"

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Click "Next"
   - Accept the license agreement
   - Choose "Complete" installation
   - **Important:** Check "Install MongoDB as a Service" (recommended)
   - Select "Run service as Network Service user"
   - **Important:** Check "Install MongoDB Compass" (GUI tool - optional but helpful)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Verify MongoDB Installation:**
   - Open PowerShell or Command Prompt
   - Run:
     ```powershell
     mongod --version
     ```
   - You should see MongoDB version information

4. **Start MongoDB Service:**
   - MongoDB should start automatically if installed as a service
   - To check if it's running:
     - Press `Win + R`, type `services.msc`, press Enter
     - Look for "MongoDB Server" service
     - It should be "Running"
   - If not running, right-click and select "Start"

### Option B: MongoDB Atlas (Cloud - Easier Alternative)

If you prefer not to install MongoDB locally:

1. **Create Free Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a cloud provider and region
   - Click "Create"

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update the `.env` file with this connection string

---

## Step 3: Set Up the Project

### 1. Verify You're in the Right Directory

Open PowerShell in the project folder:
```powershell
cd "F:\intern1 - Copy"
```

### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

This will install all required packages (Express, MongoDB, JWT, etc.)

**Expected output:**
- You'll see a progress bar
- It may take 2-5 minutes
- At the end, you should see something like:
  ```
  added 250 packages, and audited 251 packages in 2m
  ```

### 3. Configure Environment Variables

The `.env` file should already exist in the `backend` folder. If not, create it:

**For Local MongoDB:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medication_tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/medication_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 4. Start MongoDB (if using local installation)

If MongoDB is installed as a service, it should already be running. If not:

```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it
Start-Service -Name MongoDB
```

Or manually:
```powershell
mongod
```
(Keep this window open - MongoDB will run in it)

### 5. Start the Backend Server

In the `backend` directory:
```powershell
npm start
```

**Expected output:**
```
MongoDB Connected: localhost:27017
Server running on port 5000
```

**If you see errors:**
- **"Cannot find module 'express'"**: Run `npm install` again
- **"MongoDB connection error"**: Make sure MongoDB is running
- **"Port 5000 already in use"**: Change PORT in `.env` to another number (e.g., 5001)

### 6. Open the Frontend

1. **Simple Method:**
   - Navigate to the project folder in File Explorer
   - Double-click `index.html`
   - It will open in your default browser

2. **Better Method (using a local server):**
   - Install a simple HTTP server:
     ```powershell
     npm install -g http-server
     ```
   - In the project root directory:
     ```powershell
     http-server -p 8000
     ```
   - Open browser and go to: `http://localhost:8000`

---

## Step 4: Test the Application

1. **Sign Up:**
   - Select a role (e.g., "Patient")
   - Enter full name, email, password
   - Click "Sign Up"

2. **Login:**
   - Use the email and password you just created
   - Click "Login"
   - You should be redirected to the dashboard

3. **Create a Prescription (if logged in as Doctor):**
   - Go to Prescriptions page
   - Fill in medication details
   - Click "Add Medication"

---

## Troubleshooting

### Node.js Issues

**Problem:** `node` command not found after installation
- **Solution:** Restart your computer, then open a new terminal window
- **Alternative:** Add Node.js to PATH manually:
  - Find Node.js installation (usually `C:\Program Files\nodejs\`)
  - Add it to System Environment Variables PATH

**Problem:** npm install fails with network errors
- **Solution:** Check your internet connection
- **Alternative:** Use a different registry:
  ```powershell
  npm config set registry https://registry.npmjs.org/
  ```

### MongoDB Issues

**Problem:** MongoDB connection fails
- **Check if MongoDB is running:**
  ```powershell
  Get-Service -Name MongoDB
  ```
- **Start MongoDB service:**
  ```powershell
  Start-Service -Name MongoDB
  ```
- **Check MongoDB logs:**
  - Usually in `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

**Problem:** Port 27017 already in use
- Another MongoDB instance might be running
- Stop other MongoDB processes or change the port

### Backend Server Issues

**Problem:** "EADDRINUSE: address already in use :::5000"
- **Solution:** Change PORT in `.env` file to 5001 or another port
- **Or:** Find and stop the process using port 5000:
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

**Problem:** CORS errors in browser
- Make sure backend is running
- Check that API_BASE_URL in `app.js` matches your backend port

---

## Quick Start Commands Summary

```powershell
# 1. Navigate to project
cd "F:\intern1 - Copy\backend"

# 2. Install dependencies (first time only)
npm install

# 3. Start MongoDB (if local, and if not running as service)
# MongoDB should auto-start if installed as service

# 4. Start backend server
npm start

# 5. In another terminal, start frontend server (optional)
cd "F:\intern1 - Copy"
http-server -p 8000
```

---

## Need More Help?

- **Node.js Documentation:** https://nodejs.org/en/docs/
- **MongoDB Documentation:** https://www.mongodb.com/docs/
- **Express.js Documentation:** https://expressjs.com/

---

## Verification Checklist

Before running the project, verify:

- [ ] Node.js installed (`node --version` works)
- [ ] npm installed (`npm --version` works)
- [ ] MongoDB installed and running (`mongod --version` works)
- [ ] Backend dependencies installed (`npm install` completed)
- [ ] `.env` file exists in `backend` folder
- [ ] Backend server starts without errors (`npm start`)
- [ ] Frontend opens in browser

Once all checkboxes are checked, you're ready to go! 🚀


