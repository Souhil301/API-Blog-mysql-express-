const express = require('express');
const { getAllPosts, postPost, getPost, deletePost } = require('../controllers/postCotroller');
const { validateToken } = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/validate-token', validateToken, (req, res) => {
  const username = req.user.username;
  res.json({ username , token: req.headers['authorization'].split(' ')[1] });
});

router.get('/', getAllPosts);
router.post('/post', validateToken, postPost);
router.delete('/post/:id', validateToken, deletePost)
router.get('/post/:id', validateToken, getPost);


module.exports = router;