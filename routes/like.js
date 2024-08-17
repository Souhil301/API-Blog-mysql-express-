const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/authMiddleware');
const { postLike } = require('../controllers/postCotroller');



router.post('/', validateToken, postLike);



module.exports = router;