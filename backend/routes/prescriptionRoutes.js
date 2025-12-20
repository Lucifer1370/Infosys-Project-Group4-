const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptions,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected
router.use(protect);

// Doctor only route
router.post('/', authorize('Doctor'), createPrescription);

// Role-based routes (matching spec)
router.get('/patient', authorize('Patient'), getPatientPrescriptions);
router.get('/doctor', authorize('Doctor'), getDoctorPrescriptions);

// General routes
router.get('/', getPrescriptions);
router.get('/:id', getPrescription);
router.put('/:id', authorize('Doctor'), updatePrescription);
router.delete('/:id', deletePrescription);

module.exports = router;


