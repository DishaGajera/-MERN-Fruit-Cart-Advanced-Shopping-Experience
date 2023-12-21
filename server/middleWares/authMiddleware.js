const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    const secretKey = '70422b875dd08af73d158a04e6507d17c88acdae96857abfeca1841d6283723b'
    if (!token) {
        return res.status(401).json({ error: 'Authorization token not provided' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error.message)
    }
};

module.exports = authenticateUser;
