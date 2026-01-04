const User = require('../models/User');
const Prescription = require('../models/Prescription');
const Inventory = require('../models/Inventory');
const Reminder = require('../models/Reminder');
const Medication = require('../models/Medication');

// @desc    Get Admin Analytics (counts of everything)
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
exports.getAdminAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const totalUsers = await User.countDocuments();
        const patients = await User.countDocuments({ role: 'Patient' });
        const doctors = await User.countDocuments({ role: 'Doctor' });
        const pharmacists = await User.countDocuments({ role: 'Pharmacy' });

        const totalPrescriptions = await Prescription.countDocuments();
        const totalReminders = await Reminder.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                users: { total: totalUsers, patients, doctors, pharmacists },
                activity: { totalPrescriptions, totalReminders }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Doctor Analytics (Prescription stats)
// @route   GET /api/analytics/doctor
// @access  Private (Doctor only)
exports.getDoctorAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'Doctor') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Prescriptions issued by this doctor
        const myPrescriptions = await Prescription.find({ doctorId: req.user.id });

        // Convert to stats
        const totalIssued = myPrescriptions.length;
        const active = myPrescriptions.filter(p => p.status === 'Active').length;

        // Group by month (simple last 6 months)
        // This is a basic implementation. For production, use MongoDB Aggregation
        const now = new Date();
        const last6Months = {};
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            last6Months[monthName] = 0;
        }

        myPrescriptions.forEach(p => {
            const d = new Date(p.issuedDate);
            const monthName = d.toLocaleString('default', { month: 'short' });
            if (last6Months[monthName] !== undefined) {
                last6Months[monthName]++;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalIssued,
                active,
                history: last6Months
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Pharmacist Analytics (Inventory stats)
// @route   GET /api/analytics/pharmacy
// @access  Private (Pharmacy only)
exports.getPharmacyAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'Pharmacist') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const inventory = await Inventory.find({}); // All inventory or filtered by user if needed

        const totalItems = inventory.length;
        const totalValue = inventory.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const lowStock = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;

        const today = new Date();
        const expired = inventory.filter(item => new Date(item.expiryDate) < today).length;
        const expiringSoon = inventory.filter(item => {
            const exp = new Date(item.expiryDate);
            const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
            return diff >= 0 && diff <= 30;
        }).length;

        res.status(200).json({
            success: true,
            data: {
                totalItems,
                totalValue,
                alerts: { lowStock, expired, expiringSoon }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Patient Analytics (Adherence)
// @route   GET /api/analytics/patient
// @access  Private (Patient only)
exports.getPatientAnalytics = async (req, res) => {
    try {
        if (req.user.role !== 'Patient') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const medications = await Medication.find({ userId: req.user.id });
        const reminders = await Reminder.find({ userId: req.user.id });

        const totalMedicines = medications.length;
        const totalReminders = reminders.length;
        const takenReminders = reminders.filter(r => r.taken).length;
        const missedReminders = totalReminders - takenReminders;

        const adherenceRate = totalReminders > 0
            ? Math.round((takenReminders / totalReminders) * 100)
            : 0;

        // Last 7 days adherence - Placeholder for future implementation
        // Currently skipped to avoid Date parsing errors with "HH:MM" time format
        const dailyAdherence = {};

        // Mock data for the "Adherence Trends" line chart (Week 1 - Week 4)
        // In a real app, this would be calculated from actual reminder logs
        const weeklyAdherence = [65, 72, 68, adherenceRate];

        // Fetch recent prescriptions for "Prescription History"
        const recentPrescriptions = await Prescription.find({ patientId: req.user.id })
            .sort({ issuedDate: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalMedicines,
                adherence: {
                    rate: adherenceRate,
                    taken: takenReminders,
                    missed: missedReminders,
                    total: totalReminders
                },
                trends: weeklyAdherence,
                history: recentPrescriptions
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
