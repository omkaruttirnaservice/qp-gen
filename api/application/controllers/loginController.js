import jwt from 'jsonwebtoken';
import authModel from '../model/authModel.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginController = {
    login: async (req, res) => {
        console.log('login controller');
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return sendError(res, 'Username and password required');
            }

            const [result] = await authModel.checkUserCredentials(username, password);

            if (result.length === 0) {
                return sendError(res, 'Invalid username or password');
            }

            const user = result[0];
            console.log({ user }, '===================');
            const token = jwt.sign(
                {
                    id: user.userId,
                    username: user.username,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                maxAge: 36000000,
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
            });
            // return sendSuccess(res, token);
            return sendSuccess(res, {
                id: user.userId,
                username: user.username,
                role: user.role,
            });
        } catch (error) {
            console.error(error);
            return sendError(res, error);
        }
    },
};

export default loginController;
