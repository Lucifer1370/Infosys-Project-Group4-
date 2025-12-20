const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: [true, 'Medication ID is required']
  },
  time: {
    type: String, // Time for reminder (e.g., "09:00")
    required: [true, 'Time is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  taken: {
    type: Boolean,
    default: false
  },
  snoozed: {
    type: Boolean,
    default: false
  },
  snoozeCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
reminderSchema.index({ userId: 1, date: 1 });
reminderSchema.index({ medicationId: 1, date: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);

