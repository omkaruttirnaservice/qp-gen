import jwt from 'jsonwebtoken';
import { sendError } from '../application/utils/commonFunctions.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateJWT = (req, res, next) => {
    try {
        console.log(req.cookies);
        const authHeader = req.cookies.token;
        console.log({ authHeader });

        if (!authHeader) {
            return res.status(403).json(sendError(res, null, 'Invalid token'));
        }

        const token = authHeader.replace('Bearer ', '');

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json(sendError(res, err, 'Invalid token'));
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error, '==');
    }
};
