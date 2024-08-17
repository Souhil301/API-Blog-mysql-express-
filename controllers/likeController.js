const db = require('../configDB');


const postLike = (req, res) =>
{
    const { postId } = req.body;
    const userId = req.user.id;

        db.query(`SELECT * FROM likes WHERE post_id = ? AND user_id = ?;`, [postId, userId], (err, results) =>
            {
                if(err) return res.status(500).json({ error: err.message });
        
                if(results.length !== 0)
                {
                    db.query(`DELETE FROM likes WHERE post_id = ? AND user_id = ?`, [postId, userId], (err, results) =>
                    {
                        if(err) return res.status(500).json({ error: err.message });  
                        return res.json('Unliked post');   
                    })
                }
                else{
                    db.query(`INSERT INTO likes (post_id, user_id) VALUES (?, ?);`, [postId, userId], (err, results) =>
                    {
                        if(err) return res.status(500).json({ error: err.message });    
                        return res.json('liked post');   
 
                    })
                }
            });
}


module.exports = 
{
    postLike
}