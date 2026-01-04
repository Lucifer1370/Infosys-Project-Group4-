# Infosys-Project-Group4-
# 🏥 Online Medication & Prescription Tracker

Welcome to the **Medication Tracker Project** (Group 4).
This application helps Patients track their meds, Doctors issue prescriptions, Pharmacists manage inventory, and Admins oversee the system.

---

## 🚀 How to Run the Project (Step-by-Step)

### 1️⃣ Prerequisites
Before starting, please ensure you have the following installed on your computer:
- **Node.js** (Download: [nodejs.org](https://nodejs.org/))
- **MongoDB Community Server** (Download: [mongodb.com](https://www.mongodb.com/try/download/community))
  - *Make sure the MongoDB service is running!*

### 2️⃣ Installation
1.  **Download/Clone** this repository.
2.  Open the folder in **VS Code** (or your terminal).
3.  Install the backend dependencies:
    ```bash
    cd backend
    npm install
    ```

### 3️⃣ Start the Application
You need to run the Backend (Server) and open the Frontend (UI).

#### **Option A: The Easy Way (Windows)**
Simply double-click the `start-project.ps1` file in the root folder.
*It will start the server and open the browser automatically.*

#### **Option B: Manual Way**
1.  **Start Backend:**
    ```bash
    cd backend
    npm start
    ```
    *You should see: "Server running on port 5000" and "Connected to MongoDB".*

2.  **Open Frontend:**
    - Go to the `frontend/pages` folder.
    - Double-click `index.html` to open it in your browser.
    - *Or serve it using live-server/http-server for best results.*

---

## 🔑 Demo Login Credentials
Use these accounts to test the different roles:

**1. Patient Access:**
- **Email:** `patient@example.com`
- **Password:** `password123`
- *Features: view reminders, track meds, see prescriptions.*

**2. Doctor Access:**
- **Email:** `doctor@example.com`
- **Password:** `password123`
- *Features: Issue prescriptions, view patient stats.*

**3. Pharmacist Access:**
- **Email:** `pharmacist@example.com`
- **Password:** `password123`
- *Features: Manage Inventory, dispense meds.*

**4. Admin Access:**
- **Email:** `admin@example.com`
- **Password:** `admin123`
- *Features: Full system control.*

---

## ✅ Key Features
- **Smart Dashboard:** Custom views for each role.
- **Audio Reminders:** "Beep" alert for patients when it's time to take meds.
- **Inventory System:** Tracks stock levels and warns of low supply.
- **Analytics:** Visual charts for health and sales data.

---
*Internship Project - Group 4*
