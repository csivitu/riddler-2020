const jwt = require('jsonwebtoken');

const decodeJWT = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'invalidJWT',
        });

        return;
    }

    try {
        req.participant = jwt.verify(token, process.env.JWT_SECRET);
        if (req.participant) {
            console.log(req.participant.scope);
            next();
        } else {
            res.status(400).json({
                success: false,
                message: 'unauthorizedUser',
            });

            return;
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'invalidJWT',
        });
    }
};

module.exports = decodeJWT;
