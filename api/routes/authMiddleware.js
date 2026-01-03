import jwt from 'jsonwebtoken';
import { sendError } from '../application/utils/commonFunctions.js';
import { dbStore, getPool } from '../application/config/db.connect.js';
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

        jwt.verify(token, JWT_SECRET, async (err, user) => {
            if (err) return res.status(403).json(sendError(res, err, 'Invalid token'));
            req.user = user;

            if (user.dbConfig) {
                try {
                    const { poolPromise } = await getPool(
                        user.dbConfig.dbServerId,
                        user.dbConfig.dbName
                    );
                    if (poolPromise) {
                        req.db = poolPromise;

                        // Run next() within the context of the selected DB
                        dbStore.run({ pool: poolPromise }, () => {
                            next();
                        });
                        return; // Ensure we don't call next() twice
                    } else {
                        console.error('Failed to get pool for', user.dbConfig);
                        // Optional: return error if DB is critical
                    }
                } catch (dbError) {
                    console.error('DB Connection Error:', dbError);
                    return res
                        .status(500)
                        .json(sendError(res, dbError, 'Database connection failed'));
                }
            }

            return res.status(403).json(sendError(res, err, 'Invalid token'));
        });
    } catch (error) {
        console.log(error, '==');
    }
};
