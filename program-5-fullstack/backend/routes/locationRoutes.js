const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');

router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.post('/', authenticateJWT, authorizeAdmin, locationController.createLocation);
router.put('/:id', authenticateJWT, authorizeAdmin, locationController.updateLocation);
router.delete('/:id', authenticateJWT, authorizeAdmin, locationController.deleteLocation);

module.exports = router;
