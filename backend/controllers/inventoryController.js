const Inventory = require('../models/Inventory');

// @desc    Add item to inventory
// @route   POST /api/inventory
// @access  Private (Pharmacist only)
exports.addItem = async (req, res) => {
    try {
        // STRICT: Only Pharmacists can add to inventory
        if (req.user.role !== 'Pharmacist') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only pharmacists can manage inventory'
            });
        }

        const {
            name,
            batchNumber,
            manufacturer,
            expiryDate,
            quantity,
            price,
            lowStockThreshold
        } = req.body;

        const inventoryItem = await Inventory.create({
            pharmacistId: req.user.id,
            name,
            batchNumber,
            manufacturer,
            expiryDate,
            quantity,
            price,
            lowStockThreshold: lowStockThreshold || 10
        });

        res.status(201).json({
            success: true,
            data: inventoryItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private (Pharmacist & Admin)
exports.getItems = async (req, res) => {
    try {
        // Only Pharmacists and Admins can view inventory
        if (req.user.role !== 'Pharmacist' && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const query = {};

        // If user is a pharmacist, show only their inventory
        // (Assuming multiple pharmacies might exist, otherwise show all)
        // For now, let's show all items or filter by creator if needed
        // query.pharmacistId = req.user.id; 

        const items = await Inventory.find(query).sort({ createdAt: -1 });

        // Process items to add alert flags
        const today = new Date();
        const processedItems = items.map(item => {
            const itemObj = item.toObject();

            // Check Low Stock
            itemObj.isLowStock = item.quantity <= item.lowStockThreshold;

            // Check Expiry
            const expiryDate = new Date(item.expiryDate);
            const timeDiff = expiryDate - today;
            const daysToExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            itemObj.isExpired = daysToExpiry < 0;
            itemObj.isExpiringSoon = daysToExpiry >= 0 && daysToExpiry <= 30; // Alert if expiring in 30 days

            return itemObj;
        });

        res.status(200).json({
            success: true,
            count: processedItems.length,
            data: processedItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Pharmacist only)
exports.updateItem = async (req, res) => {
    try {
        if (req.user.role !== 'Pharmacist') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        let item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Optional: Check ownership
        // if (item.pharmacistId.toString() !== req.user.id) { ... }

        item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Pharmacist only)
exports.deleteItem = async (req, res) => {
    try {
        if (req.user.role !== 'Pharmacist') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Item removed from inventory'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
