const db = require("../configDB");

const getComment = (req, res) => {

    console.log('Route parameters:', req.params);
    const postId = req.params.postId;
    console.log('Received postId:', postId); 

    if (!postId) {
        return res.status(400).json({ error: 'Missing postId parameter' });
    }

    db.query(`SELECT * FROM comment WHERE post_id = ?`, [postId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(results);
        
        res.json(results);
    });
};

const postComment = (req, res) => {
    const { postId, comment } = req.body;
    const username = req.user.username;
    if (!username || !postId || !comment) {
        return res.status(400).json({ error: 'postId, comment are required' });
    }
    const query = 'INSERT INTO comment (username ,post_id, comment) VALUES (?, ?, ?);';

    db.query(query, [username ,postId, comment], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: 'Comment added successfully', commentId: results.insertId });
    });
};

const deleteComment = (req, res) =>
{
    const commnetId = req.params.commentId;

    if(!commnetId)  return res.status(400).json({ error: 'commentId is required' });

    db.query(`DELETE * FROM comment WHERE id = ?;`, [commnetId], (err, results) =>
    {
        if(err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: 'Comment deleted successfully', commnetId: results.insertId })
    })

}

module.exports = 
{
    getComment,
    postComment,
    deleteComment
};
