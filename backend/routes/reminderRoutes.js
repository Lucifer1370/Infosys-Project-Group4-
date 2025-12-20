const express = require('express');
const router = express.Router();
const {
  generateReminders,
  getTodayReminders,
  markTaken,
  snoozeReminder,
  getAllReminders
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected and Patient-only
router.use(protect);
router.use(authorize('Patient')); // Apply Patient-only middleware to all routes

// Reminder routes - ALL Patient-only
// IMPORTANT: Specific routes must come BEFORE parameterized routes
router.post('/generate', generateReminders); // Auto-create reminders when medication added
router.get('/today', getTodayReminders); // Specific route first
router.put('/mark-taken', markTaken); // Mark as taken - using body parameter
router.put('/snooze', snoozeReminder); // Snooze - using body parameter
router.get('/', getAllReminders); // Catch-all route must come LAST

module.exports = router;

