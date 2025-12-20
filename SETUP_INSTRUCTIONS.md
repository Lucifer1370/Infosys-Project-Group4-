# Setup and Run Instructions

## Prerequisites

1. **Node.js and npm** (if not installed):
   - Download and install from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **MongoDB** (if not installed):
   - Download and install from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Make sure MongoDB is running on `localhost:27017`

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - The `.env` file should already exist
   - If not, create `backend/.env` with:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/medication_tracker
     JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
     JWT_EXPIRE=7d
     ```

4. **Start MongoDB:**
   - If installed locally, start MongoDB service
   - Or use: `mongod` (if in PATH)

5. **Start the backend server:**
   ```bash
   npm start
   ```
   - Server will run on `http://localhost:5000`
   - You should see: "MongoDB Connected" and "Server running on port 5000"

## Frontend Setup

1. **Open the frontend:**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python (if installed)
     python -m http.server 8000
     
     # Using Node.js http-server (if installed globally)
     npx http-server -p 8000
     ```
   - Then open: `http://localhost:8000`

2. **The frontend is already configured to connect to:**
   - Backend API: `http://localhost:5000/api`

## Running the Project

### Option 1: Quick Start (Backend in Terminal)

1. Open a terminal in the project root
2. Navigate to backend: `cd backend`
3. Install dependencies: `npm install` (first time only)
4. Start server: `npm start`
5. Open `index.html` in your browser

### Option 2: Development Mode (with auto-restart)

1. Install nodemon globally: `npm install -g nodemon`
2. In backend directory: `npm run dev`
3. Server will auto-restart on file changes

## Testing the Application

1. **Sign Up:**
   - Select a role (Patient, Doctor, Pharmacy, Admin)
   - Fill in the form
   - Click "Sign Up"

2. **Login:**
   - Use the email and password you registered with
   - Click "Login"

3. **Create Prescription (Doctor only):**
   - Login as a Doctor
   - Go to Prescriptions page
   - Fill in medication details
   - Enter patient email when prompted
   - Click "Add Medication"

4. **View Prescriptions:**
   - Patients see only their prescriptions
   - Doctors see prescriptions they created
   - Pharmacy and Admin see all prescriptions

## Troubleshooting

- **"Cannot find module" errors:** Run `npm install` in the backend directory
- **MongoDB connection error:** Make sure MongoDB is running
- **Port 5000 already in use:** Change PORT in `.env` file
- **CORS errors:** Backend CORS is configured, make sure backend is running
- **API calls failing:** Check browser console and ensure backend is running on port 5000

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `POST /api/prescriptions` - Create prescription (Doctor only)
- `GET /api/prescriptions` - Get prescriptions (role-based)
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription


