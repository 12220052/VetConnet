const express = require('express');
const router = express.Router();
const vetController = require('../controller/vetController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

// Day availability routes
router.route('/availability')
  .get(vetController.getAvailability)
  // .put(vetController.updateAvailability)
  .delete(vetController.clearAvailability)
  .put(vetController.updateAvailability);


// Specific day routes
router.route('/availability/:day')
  .get(vetController.getDayAvailability)
  .put(vetController.updateDayAvailability);



router.put('/availability/bulk', vetController.bulkUpdateAvailability);



// console.log('Controller methods available:', Object.keys(vetController));


// router.get('/test', (req, res) => res.send('Route test successful!'));


module.exports = router;