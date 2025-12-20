const express = require('express');
const router = express.Router();
const {
  createMedication,
  getMedications,
  updateMedication,
  deleteMedication,
  getAdherence
} = require('../controllers/medicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected
router.use(protect);

// STRICT: Only Patients can access medication routes
router.post('/', authorize('Patient'), createMedication);
router.get('/', authorize('Patient'), getMedications);
router.put('/:id', authorize('Patient'), updateMedication);
router.delete('/:id', authorize('Patient'), deleteMedication);
router.get('/:id/adherence', authorize('Patient'), getAdherence);

module.exports = router;

