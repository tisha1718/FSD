const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');

router.get('/', slotController.getAllSlots);
router.get('/location/:locationId', slotController.getSlotsByLocation);
router.post('/', authenticateJWT, authorizeAdmin, slotController.createSlot);
router.put('/:id', authenticateJWT, authorizeAdmin, slotController.updateSlot);
router.delete('/:id', authenticateJWT, authorizeAdmin, slotController.deleteSlot);

module.exports = router;
