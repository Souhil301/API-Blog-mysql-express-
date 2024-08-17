const express = require('express');
const router = express.Router();
const { getComment, postComment, deleteComment } = require('../controllers/commentController');
const { validateToken } = require('../middlewares/authMiddleware');



router.get('/:postId', validateToken, getComment);
router.post('/', validateToken, postComment);
router.delete('/:commentId', validateToken, deleteComment);



module.exports = router;