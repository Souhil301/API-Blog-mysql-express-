const { verify } = require('jsonwebtoken');

const JWT_SECRET = 'importantblogsecretkey'; 

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ success: false, error: 'User not logged in, try login' });
    }

    try {
        const decodedToken = verify(token, JWT_SECRET);
        req.user = decodedToken; 
        
        if (decodedToken) {
            return next();
        }
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};


module.exports = { validateToken };
