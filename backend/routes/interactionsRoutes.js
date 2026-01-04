const express = require('express');
const router = express.Router();
const { checkInteractions } = require('../controllers/interactionsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/check', checkInteractions);

module.exports = router;
