const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const User = require('../models/User');
const Machine = require('../models/Machine');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ObjectId } = mongoose.Types;

// Set up Multer for incident file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/incidents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, PNG, or PDF files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([{ name: 'attachments', maxCount: 5 }]);

// Validation helpers
const validateSeverityLevel = (level) => {
  const validLevels = ['Minor', 'Moderate', 'Major', 'Critical'];
  return validLevels.includes(level);
};

const validateStatus = (status) => {
  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  return validStatuses.includes(status);
};

// Create a new Incident
const createIncident = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading files',
        });
      }

      const {
        incidentDateTime,
        zone,
        niveau,
        machine,
        severityLevel,
        description,
        declarant,
        operationStopped,
        zoneSecured,
        injuries,
        injuredNames,
        injuryTypes,
        injuryTimes,
        status,
        correctiveActions,
      } = req.body;

      // Validate required fields
      if (!incidentDateTime || !severityLevel || !status) {
        return res.status(400).json({
          success: false,
          message: 'Incident date, severity level, and status are required',
        });
      }

      // Validate IDs
      if (machine && !ObjectId.isValid(machine)) {
        return res.status(400).json({ success: false, message: 'Invalid machine ID' });
      }
      if (declarant && !ObjectId.isValid(declarant)) {
        return res.status(400).json({ success: false, message: 'Invalid declarant ID' });
      }

      // Validate enums
      if (!validateSeverityLevel(severityLevel)) {
        return res.status(400).json({ success: false, message: 'Invalid severity level' });
      }
      if (!validateStatus(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      // Validate declarant exists
      if (declarant) {
        const user = await User.findById(declarant);
        if (!user) {
          return res.status(400).json({ success: false, message: 'Declarant not found' });
        }
      }

      // Validate machine exists
      if (machine) {
        const machineExists = await Machine.findById(machine);
        if (!machineExists) {
          return res.status(400).json({ success: false, message: 'Machine not found' });
        }
      }

      const attachments = req.files?.attachments
        ? req.files.attachments.map((file) => `/Uploads/incidents/${file.filename}`)
        : [];

      const incident = new Incident({
        incidentDateTime,
        zone: zone || null,
        niveau: niveau || null,
        machine: machine || null,
        severityLevel,
        description,
        declarant: declarant || null,
        attachments,
        operationStopped: operationStopped === 'true' || operationStopped === true,
        zoneSecured: zoneSecured === 'true' || zoneSecured === true,
        injuries: injuries === 'true' || injuries === true,
        injuredNames: injuredNames ? (Array.isArray(injuredNames) ? injuredNames : [injuredNames]) : [],
        injuryTypes: injuryTypes ? (Array.isArray(injuryTypes) ? injuryTypes : [injuryTypes]) : [],
        injuryTimes: injuryTimes ? (Array.isArray(injuryTimes) ? injuryTimes : [injuryTimes]) : [],
        status,
        correctiveActions: correctiveActions || null,
      });

      const savedIncident = await incident.save();
      const populatedIncident = await Incident.findById(savedIncident._id)
        .populate('machine', '_id name')
        .populate('declarant', '_id name email');

      res.status(201).json({
        success: true,
        data: populatedIncident,
        message: 'Incident created successfully',
      });
    } catch (error) {
      console.error('Error creating incident:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create incident',
        error: error.message,
      });
    }
  });
};

const updateIncident = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading files',
        });
      }

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid incident ID' });
      }

      const incident = await Incident.findById(req.params.id);
      if (!incident) {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }

      const {
        incidentDateTime,
        zone,
        niveau,
        machine,
        severityLevel,
        description,
        declarant,
        operationStopped,
        zoneSecured,
        injuries,
        injuredNames,
        injuryTypes,
        injuryTimes,
        status,
        correctiveActions,
      } = req.body;

      // Update fields if provided
      if (incidentDateTime) incident.incidentDateTime = incidentDateTime;
      if (zone !== undefined) incident.zone = zone || null;
      if (niveau !== undefined) incident.niveau = niveau || null;
      if (machine) {
        if (!ObjectId.isValid(machine)) {
          return res.status(400).json({ success: false, message: 'Invalid machine ID' });
        }
        const machineExists = await Machine.findById(machine);
        if (!machineExists) {
          return res.status(400).json({ success: false, message: 'Machine not found' });
        }
        incident.machine = machine;
      }
      if (severityLevel) {

        incident.severityLevel = severityLevel;
      }
      if (description !== undefined) incident.description = description;
      if (declarant) {
        if (!ObjectId.isValid(declarant)) {
          return res.status(400).json({ success: false, message: 'Invalid declarant ID' });
        }
        const user = await User.findById(declarant);
        if (!user) {
          return res.status(400).json({ success: false, message: 'Declarant not found' });
        }
        incident.declarant = declarant;
      }
      if (req.files?.attachments) {
        const newAttachments = req.files.attachments.map(file => `/Uploads/incidents/${file.filename}`);
        incident.attachments = [...incident.attachments, ...newAttachments];
      }
      if (operationStopped !== undefined) {
        incident.operationStopped = operationStopped === 'true' || operationStopped === true;
      }
      if (zoneSecured !== undefined) {
        incident.zoneSecured = zoneSecured === 'true' || zoneSecured === true;
      }
      if (injuries !== undefined) {
        incident.injuries = injuries === 'true' || injuries === true;
      }
      if (injuredNames) {
        incident.injuredNames = Array.isArray(injuredNames) ? injuredNames : [injuredNames];
      }
      if (injuryTypes) {
        incident.injuryTypes = Array.isArray(injuryTypes) ? injuryTypes : [injuryTypes];
      }
      if (injuryTimes) {
        incident.injuryTimes = Array.isArray(injuryTimes) ? injuryTimes : [injuryTimes];
      }
      if (status) {
        if (!validateStatus(status)) {
          return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        incident.status = status;
      }
      if (correctiveActions !== undefined) {
        incident.correctiveActions = correctiveActions || null;
      }

      const updatedIncident = await incident.save();
      const populatedIncident = await Incident.findById(updatedIncident._id)
        .populate('machine', '_id name')
        .populate('declarant', '_id name email');

      res.status(200).json({
        success: true,
        data: populatedIncident,
        message: 'Incident updated successfully',
      });
    } catch (error) {
      console.error('Error updating incident:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update incident',
        error: error.message,
      });
    }
  });
};

// Get all Incidents
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate('machine', '_id name')
      .populate('declarant', '_id name email');

    res.status(200).json({
      success: true,
      data: incidents,
      message: 'Incidents retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents',
      error: error.message,
    });
  }
};

// Get a single Incident by ID
const getIncidentById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID' });
    }
    const incident = await Incident.findById(req.params.id)
      .populate('machine', '_id name')
      .populate('declarant', '_id name email');
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    res.status(200).json({
      success: true,
      data: incident,
      message: 'Incident retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incident',
      error: error.message,
    });
  }
};

// Delete an Incident
const deleteIncident = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid incident ID' });
    }
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Delete associated attachments
    if (incident.attachments && incident.attachments.length > 0) {
      for (const attachment of incident.attachments) {
        try {
          await fs.unlink(path.join(__dirname, '..', attachment));
        } catch (err) {
          console.warn('Failed to delete attachment:', err.message);
        }
      }
    }

    await incident.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Incident deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting incident:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete incident',
      error: error.message,
    });
  }
};

// Get Incidents Count
const getIncidentsCount = async (req, res) => {
  try {
    const count = await Incident.countDocuments();
    res.status(200).json({
      success: true,
      data: { count },
      message: 'Incidents count retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching incidents count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch incidents count',
      error: error.message,
    });
  }
};

// Get Recent Incidents
const getRecentIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('description severityLevel status createdAt')
      .lean();

    const formattedIncidents = incidents.map((incident) => ({
      title: incident.description || 'Incident reported',
      severity: incident.severityLevel,
      status: incident.status.toLowerCase().replace(' ', '-'),
      createdAt: incident.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedIncidents,
      message: 'Recent incidents retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching recent incidents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent incidents',
      error: error.message,
    });
  }
};

module.exports = {
  createIncident,
  updateIncident,
  getAllIncidents,
  getIncidentById,
  deleteIncident,
  getIncidentsCount,
  getRecentIncidents,
};