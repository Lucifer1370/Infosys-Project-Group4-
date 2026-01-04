const express = require('express');
const router = express.Router();
const {
    getAdminAnalytics,
    getDoctorAnalytics,
    getPharmacyAnalytics,
    getPatientAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/admin', getAdminAnalytics);
router.get('/doctor', getDoctorAnalytics);
router.get('/pharmacy', getPharmacyAnalytics);
router.get('/patient', getPatientAnalytics);

module.exports = router;
