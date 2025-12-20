const Reminder = require('../models/Reminder');
const Medication = require('../models/Medication');

// @desc    Generate reminders automatically (called when medication is created)
// @route   POST /api/reminders/generate
// @access  Private (Patient only)
exports.generateReminders = async (req, res) => {
  try {
    // STRICT: Only Patients can generate reminders
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can generate reminders'
      });
    }

    const { medicationId, frequency, time } = req.body;

    if (!medicationId || !frequency || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide medicationId, frequency, and time'
      });
    }

    // Generate reminders for next 30 days
    const reminders = await generateRemindersForMedication(
      req.user.id,
      medicationId,
      frequency,
      time
    );

    res.status(201).json({
      success: true,
      message: 'Reminders generated successfully',
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get today's reminders
// @route   GET /api/reminders/today
// @access  Private (Patient only)
exports.getTodayReminders = async (req, res) => {
  try {
    // STRICT: Double-check role (middleware already checks, but extra security)
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can view reminders'
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reminders = await Reminder.find({
      userId: req.user.id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    })
      .populate('medicationId', 'name dosage frequency')
      .sort({ time: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark reminder as taken
// @route   PUT /api/reminders/mark-taken
// @access  Private (Patient only)
exports.markTaken = async (req, res) => {
  try {
    
    // STRICT: Double-check role
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can mark reminders as taken'
      });
    }
    
    const { reminderId } = req.body;

    if (!reminderId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reminder ID'
      });
    }

    const reminder = await Reminder.findById(reminderId)
      .populate('medicationId');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Check if user owns this reminder
    if (reminder.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reminder'
      });
    }

    // Update reminder - mark as taken
    reminder.taken = true;
    reminder.snoozed = false; // Reset snooze when marked as taken
    await reminder.save();

    // Update medication adherence count (Module 3 adherence tracking)
    if (reminder.medicationId) {
      const medication = await Medication.findById(reminder.medicationId._id);
      if (medication) {
        medication.adherenceCount = (medication.adherenceCount || 0) + 1;
        await medication.save();
      }
    }

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Snooze reminder
// @route   PUT /api/reminders/snooze
// @access  Private (Patient only)
exports.snoozeReminder = async (req, res) => {
  try {
    
    // STRICT: Double-check role
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can snooze reminders'
      });
    }
    
    const { reminderId, snoozeMinutes = 15 } = req.body || {};

    if (!reminderId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reminder ID'
      });
    }

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Check if user owns this reminder
    if (reminder.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to snooze this reminder'
      });
    }

    // Mark as snoozed
    reminder.snoozed = true;
    reminder.snoozeCount = (reminder.snoozeCount || 0) + 1;
    await reminder.save();

    res.status(200).json({
      success: true,
      data: reminder,
      message: `Reminder snoozed for ${snoozeMinutes} minutes`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to generate reminders for medication (used by both reminder and medication controllers)
async function generateRemindersForMedication(userId, medicationId, frequency, time) {
  const reminders = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate reminders for next 30 days
  for (let i = 0; i < 30; i++) {
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + i);

    if (frequency === 'Daily') {
      reminders.push({
        userId,
        medicationId,
        time,
        date: reminderDate,
        taken: false,
        snoozed: false
      });
    } else if (frequency === 'Alternate') {
      if (i % 2 === 0) {
        reminders.push({
          userId,
          medicationId,
          time,
          date: reminderDate,
          taken: false,
          snoozed: false
        });
      }
    } else if (frequency === 'Custom') {
      // For custom, generate daily (can be customized later)
      reminders.push({
        userId,
        medicationId,
        time,
        date: reminderDate,
        taken: false,
        snoozed: false
      });
    }
  }

  if (reminders.length > 0) {
    return await Reminder.insertMany(reminders);
  }
  return [];
}

// Export helper function for use in medicationController
module.exports.generateRemindersForMedication = generateRemindersForMedication;

// @desc    Get all reminders for a user
// @route   GET /api/reminders
// @access  Private (Patient only)
exports.getAllReminders = async (req, res) => {
  try {
    // STRICT: Double-check role
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can view reminders'
      });
    }
    const { date } = req.query;
    
    let query = { userId: req.user.id };
    
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: targetDate,
        $lt: nextDay
      };
    }

    const reminders = await Reminder.find(query)
      .populate('medicationId', 'name dosage frequency')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

