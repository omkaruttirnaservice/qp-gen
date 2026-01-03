import express from 'express';
import loginController from '../application/controllers/loginController.js';
import { databasesList } from '../databasesList.js';

const router = express.Router();

router.post('/login', loginController.login);

// getting list of databases on login page
router.get('/databases', (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            data: databasesList,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
