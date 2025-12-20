const Prescription = require('../models/Prescription');

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, patientEmail, medicineName, dosage, duration, notes, startDate, expiryDate } = req.body;

    // Validation
    if ((!patientId && !patientEmail) || !medicineName || !dosage || !startDate || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patientId or patientEmail, medicineName, dosage, startDate, and duration'
      });
    }

    let finalPatientId = patientId;
    let finalExpiryDate = expiryDate;

    // If patientEmail is provided, look up the patient
    if (patientEmail && !patientId) {
      const User = require('../models/User');
      const patient = await User.findOne({ email: patientEmail.toLowerCase(), role: 'Patient' });
      
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found with the provided email'
        });
      }
      
      finalPatientId = patient._id;
    }

    // Calculate expiryDate from duration if not provided
    if (!finalExpiryDate && duration) {
      const start = new Date(startDate);
      finalExpiryDate = new Date(start);
      finalExpiryDate.setDate(start.getDate() + parseInt(duration));
    }

    // Determine status based on expiryDate
    const now = new Date();
    const status = finalExpiryDate && new Date(finalExpiryDate) < now ? 'Expired' : 'Active';

    // Create prescription
    const prescription = await Prescription.create({
      patientId: finalPatientId,
      doctorId: req.user.id, // Current logged in doctor
      medicineName,
      dosage,
      duration: parseInt(duration),
      notes: notes || '',
      startDate,
      expiryDate: finalExpiryDate,
      status
    });

    // Populate patient and doctor info
    await prescription.populate('patientId', 'fullName email');
    await prescription.populate('doctorId', 'fullName email');

    res.status(201).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all prescriptions (role-based)
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res) => {
  try {
    let prescriptions;

    // STRICT Role-based filtering - Module 3: Only Patient and Doctor
    if (req.user.role === 'Patient') {
      // Patients see only their own prescriptions
      prescriptions = await Prescription.find({ patientId: req.user.id })
        .populate('patientId', 'fullName email')
        .populate('doctorId', 'fullName email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'Doctor') {
      // Doctors see only prescriptions they created
      prescriptions = await Prescription.find({ doctorId: req.user.id })
        .populate('patientId', 'fullName email')
        .populate('doctorId', 'fullName email')
        .sort({ createdAt: -1 });
    } else {
      // Pharmacist and Admin exist but not used in Module 3
      return res.status(403).json({
        success: false,
        message: 'Access denied for your role. Only Patient and Doctor roles are active in Module 3.'
      });
    }

    // Update status based on expiryDate
    const now = new Date();
    for (let pres of prescriptions) {
      if (pres.status === 'Active' && pres.expiryDate && new Date(pres.expiryDate) < now) {
        pres.status = 'Expired';
        await pres.save();
      }
    }

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get patient prescriptions
// @route   GET /api/prescriptions/patient
// @access  Private (Patient only)
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user.id })
      .populate('patientId', 'fullName email')
      .populate('doctorId', 'fullName email')
      .sort({ createdAt: -1 });

    // Update status based on expiryDate
    const now = new Date();
    for (let pres of prescriptions) {
      if (pres.status === 'Active' && pres.expiryDate && new Date(pres.expiryDate) < now) {
        pres.status = 'Expired';
        await pres.save();
      }
    }

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get doctor prescriptions
// @route   GET /api/prescriptions/doctor
// @access  Private (Doctor only)
exports.getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user.id })
      .populate('patientId', 'fullName email')
      .populate('doctorId', 'fullName email')
      .sort({ createdAt: -1 });

    // Update status based on expiryDate
    const now = new Date();
    for (let pres of prescriptions) {
      if (pres.status === 'Active' && pres.expiryDate && new Date(pres.expiryDate) < now) {
        pres.status = 'Expired';
        await pres.save();
      }
    }

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'fullName email')
      .populate('doctorId', 'fullName email');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Role-based access check
    if (req.user.role === 'Patient' && prescription.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prescription'
      });
    }

    if (req.user.role === 'Doctor' && prescription.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prescription'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
exports.updatePrescription = async (req, res) => {
  try {
    let prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // STRICT Role-based access check
    // Patient can NEVER update prescriptions
    if (req.user.role === 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients cannot update prescriptions'
      });
    }

    // Only the doctor who created the prescription can update it
    if (req.user.role === 'Doctor' && prescription.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription'
      });
    }

    // Update status based on expiryDate if it's being updated
    const updateData = { ...req.body };
    if (updateData.expiryDate) {
      const now = new Date();
      if (new Date(updateData.expiryDate) < now) {
        updateData.status = 'Expired';
      } else {
        updateData.status = 'Active';
      }
    } else if (prescription.expiryDate) {
      // Check current expiryDate
      const now = new Date();
      if (new Date(prescription.expiryDate) < now && prescription.status === 'Active') {
        updateData.status = 'Expired';
      }
    }

    // Update prescription
    prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('patientId', 'fullName email')
     .populate('doctorId', 'fullName email');

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // STRICT Role-based access check
    // Patient can NEVER delete prescriptions
    if (req.user.role === 'Patient') {
      return res.status(403).json({
        success: false,
        message: 'Patients cannot delete prescriptions'
      });
    }

    // Only the doctor who created the prescription can delete it
    if (req.user.role === 'Doctor' && prescription.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this prescription'
      });
    }

    await prescription.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

