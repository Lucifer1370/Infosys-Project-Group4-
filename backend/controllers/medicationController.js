const Medication = require('../models/Medication');
const Reminder = require('../models/Reminder');
// Import helper function from reminderController for auto-generating reminders
let generateRemindersForMedication;

// @desc    Create medication
// @route   POST /api/medications
// @access  Private (Patient only)
exports.createMedication = async (req, res) => {
  try {
    // STRICT: Only Patients can create medications
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can add medications'
      });
    }

    const { prescriptionId, name, dosage, frequency, time, notificationType } = req.body;

    // Validation
    if (!name || !dosage || !frequency || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, dosage, frequency, and time'
      });
    }

    // Create medication
    const medication = await Medication.create({
      userId: req.user.id,
      prescriptionId: prescriptionId || null,
      name,
      dosage,
      frequency,
      time,
      notificationType: notificationType || 'Push',
      status: 'Active'
    });

    // Auto-generate reminders based on frequency (Module 3)
    // Reminders are generated automatically when medication is created by Patient
    if (!generateRemindersForMedication) {
      const reminderController = require('./reminderController');
      generateRemindersForMedication = reminderController.generateRemindersForMedication;
    }
    await generateRemindersForMedication(req.user.id, medication._id, frequency, time);

    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all medications for current user
// @route   GET /api/medications
// @access  Private (Patient only)
exports.getMedications = async (req, res) => {
  try {
    // STRICT: Only Patients can view medications
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only patients can view medications'
      });
    }

    const medications = await Medication.find({ userId: req.user.id })
      .populate('prescriptionId', 'medicineName dosage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res) => {
  try {
    let medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Check if user owns this medication
    if (medication.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medication'
      });
    }

    // Update medication
    medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Check if user owns this medication
    if (medication.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this medication'
      });
    }

    // Delete associated reminders
    await Reminder.deleteMany({ medicationId: medication._id });

    await medication.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Medication deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Note: generateRemindersForMedication is imported from reminderController (see line 44-45)
// No duplicate function definition needed here

// @desc    Get adherence statistics
// @route   GET /api/medications/:id/adherence
// @access  Private
exports.getAdherence = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Check if user owns this medication
    if (medication.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get all reminders for this medication
    const reminders = await Reminder.find({ medicationId: medication._id });
    const totalReminders = reminders.length;
    const takenReminders = reminders.filter(r => r.taken).length;
    const adherencePercentage = totalReminders > 0 
      ? Math.round((takenReminders / totalReminders) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        medicationId: medication._id,
        medicationName: medication.name,
        totalReminders,
        takenReminders,
        missedReminders: totalReminders - takenReminders,
        adherencePercentage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

