const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
    default: null // Can be null if medication is added manually
  },
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['Daily', 'Alternate', 'Custom'],
    default: 'Daily'
  },
  time: {
    type: String, // Time of day (e.g., "09:00", "Morning", "Evening")
    required: [true, 'Time is required']
  },
  notificationType: {
    type: String,
    enum: ['Push', 'Email', 'Both'],
    default: 'Push'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active'
  },
  adherenceCount: {
    type: Number,
    default: 0 // Track number of times medication was taken
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medication', medicationSchema);

