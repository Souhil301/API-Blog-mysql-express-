const db = require('../configDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = (req, res) => 
    {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => 
    {
        if (err) 
        {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) 
        {
            return res.status(400).json({ error: 'User already registered!' });
        } else 
        {
            bcrypt.hash(password, 10)
                .then((hash) => {
                    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?);', [username, email, hash], (err, results) => 
                    {
                        if (err) 
                        {
                            console.log(err);
                            return res.status(500).json({ error: 'Failed to register user' });
                        }
                        return res.status(201).json({ message: 'User registered successfully' });
                    });
                }).catch(err => 
                {
                    console.log(err);
                    return res.status(500).json({ error: 'Failed to hash password' });
                });
        }
    });
};


const JWT_SECRET = 'importantblogsecretkey';

const login = async (req, res)=>
    {
        const { email, password } = req.body;

        if(!email || !password)
        {
            return res.status(400).json({ error : 'email and password are required' });
        }
        else 
        {
            db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, results) =>
            {
                if(err)
                {
                    return res.status(500).json({ error: err.message });
                }
                
                if (results.length === 0) {
                    return res.status(400).json({ error: 'User does not exist' });
                }
                const user = results[0];

                try {
                  const match = await bcrypt.compare(password, user.password);
                  if (!match) {
                    return res.status(401).json({ error: 'Wrong email or password' });
                  }
            
                  const accessToken = jwt.sign({ username: user.username ,email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            
                  res.json({ token: accessToken, username: user.username, email: user.email, id: user.id });
                } catch (err) {
                  console.error('Error comparing passwords:', err);
                  res.status(500).json({ error: 'Internal server error' });
                }
                
            });
        }
    }


const userProfile = (req, res) =>
{
    const username = req.user.username

    db.query(`
        SELECT posts.*, COUNT(likes.id) AS likeCount
        FROM posts
        LEFT JOIN likes ON posts.id = likes.post_id
        WHERE posts.username = ?
        GROUP BY posts.id;
    `, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    })
}


const changePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Old password and new password are required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        bcrypt.compare(oldPassword, user.password, (err, match) => {
            if (err) return res.status(500).json({ error: 'Internal server error' });

            if (!match) return res.status(401).json({ error: 'Wrong password entered!' });

            bcrypt.hash(newPassword, 10).then((hash) => {
                db.query('UPDATE users SET password = ? WHERE username = ?', [hash, username], (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });

                    if (results.affectedRows > 0) {
                        return res.status(200).json({ message: 'Password updated successfully' });
                    } else {
                        return res.status(404).json({ error: 'User not found' });
                    }
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ error: 'Failed to hash password' });
            });
        });
    });
};



module.exports = {
    register,
    login,
    userProfile, 
    changePassword
};
