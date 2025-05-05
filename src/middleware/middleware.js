const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../helper/utlis');
const { ResponseHandler, ResponseObject } = require('../helper/responeHandler');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ResponseObject.code = 401;
        ResponseObject.message = "Access denied. No token provided.";
        return ResponseHandler(ResponseObject.message, ResponseObject, res);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded; // you can access user info via req.user in next handlers
        next();
    } catch (err) {
        ResponseObject.code = 403;
        ResponseObject.message = "Invalid or expired token.";
        return ResponseHandler(err, ResponseObject, res);
    }
};

module.exports = auth;
