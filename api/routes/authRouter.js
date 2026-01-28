import express from 'express';
import loginController from '../application/controllers/loginController.js';
import { databasesList } from '../databasesList.js';
import { isDevEnv } from '../application/config/utils.js';

const router = express.Router();

router.post('/login', loginController.login);

// getting list of databases on login page
router.get('/databases', (req, res, next) => {
    try {
        console.log(process.env.NODE_ENV,'=node env');
        console.log(isDevEnv(),'=isDev()');
        return res.status(200).json({
            success: true,
            data: !isDevEnv() ? databasesList.production : databasesList.developement,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
