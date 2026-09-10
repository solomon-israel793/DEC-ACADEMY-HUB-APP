const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMe, updateMe, changeMyPassword } = require('../controllers/userController');

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', changeMyPassword);

module.exports = router;
