const express = require('express');
const router = express.Router();
const {
    addItem,
    getItems,
    updateItem,
    deleteItem
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getItems)
    .post(addItem);

router.route('/:id')
    .put(updateItem)
    .delete(deleteItem);

module.exports = router;
