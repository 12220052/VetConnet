const express = require('express');
const router = express.Router();
const vetController = require('../controller/vetController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('vet'));

router.route('/availability')
  .post(vetController.setAvailability)
  .get(vetController.getAvailability);

module.exports = router;