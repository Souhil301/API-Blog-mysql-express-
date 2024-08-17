const express = require('express');
const { register, login, userProfile, changePassword } = require('../controllers/userController');
const { validateToken } = require('../middlewares/authMiddleware');
const router = express.Router();



router.post('/signup', register);
router.post('/signin', login);
router.put('/changepassword', validateToken, changePassword);
router.get('/profile', validateToken, userProfile);


module.exports = router;