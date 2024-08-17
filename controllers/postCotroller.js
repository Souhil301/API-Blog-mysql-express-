const db = require("../configDB")



const getAllPosts = (req, res) => {
    db.query(`
        SELECT posts.*, COUNT(likes.id) AS likeCount
        FROM posts
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id;
    `, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
}



const getPost = (req, res)=>
{
    const id = req.params.id
    db.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
        if (err)
        {
            return res.status(500).json({ error: err.message });
        }
        res.json(results)

      });
}

const postPost = (req, res) => 
{
    const { title, postText } = req.body;
    const username = req.user.username;

    if(!title || !postText || !username)
    {
        return res.status(400).json({ error: 'Title and postText are required' })
    }

    db.query(`INSERT INTO posts (title, postText, username) VALUES (?, ?, ?);`, [title, postText, username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ id: result.insertId, title, postText, username });
    })
}


const deletePost = (req, res) => {
    const id = req.params.id;

    db.query(`DELETE FROM likes WHERE post_id = ?;`, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(`DELETE FROM posts WHERE id = ?;`, [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json('Post deleted !!');
        });
    });
}




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
    getAllPosts,
    getPost,
    postPost,
    deletePost,
    postLike
}