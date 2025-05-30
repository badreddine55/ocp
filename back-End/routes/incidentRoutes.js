const express = require('express');
const router = express.Router();
const {
  createIncident,
  updateIncident,
  getAllIncidents,
  getIncidentById,
  deleteIncident,
  getIncidentsCount,
  getRecentIncidents
} = require('../controllers/incidentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);
router.route('/')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getAllIncidents)
  .post(restrictTo('superadmin', 'admin', 'manager', 'operator'), createIncident);
router.route('/count')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getIncidentsCount);
router.route('/recent')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getRecentIncidents);
router.route('/:id')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getIncidentById)
  .put(restrictTo('superadmin', 'admin', 'manager', 'operator'), updateIncident)
  .delete(restrictTo('superadmin', 'admin', 'manager'), deleteIncident);

module.exports = router;