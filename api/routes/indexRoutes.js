const router = express.Router();
import express from 'express';

import authRoutes from './authRouter.js';
import postsRoutes from './postsRoutes.js';
import questionRoutes from './questionRoutes.js';
import remoteRouter from './remoteRouter.js';
import reportsRouter from './reportsRouter.js';
import saveExamsRouter from './saveExamsRouter.js';
import studentsAreaRouter from './studentsAreaRouter.js';
import testsRouter from './testsRouter.js';

import subjectRouter from './subjectRouter.js';
import topicRouter from './topicRouter.js';
import { authenticateJWT } from './authMiddleware.js';

router.use('/topics', authenticateJWT, topicRouter);
router.use('/subject', authenticateJWT, subjectRouter);

router.use('/questions', authenticateJWT, questionRoutes);
router.use('/test', authenticateJWT, testsRouter);

router.use('/posts', authenticateJWT, postsRoutes);

router.use('/students-area', authenticateJWT, studentsAreaRouter);
router.use('/reports', authenticateJWT, reportsRouter);
router.use('/exams', authenticateJWT, saveExamsRouter);

router.use('/remote', authenticateJWT, remoteRouter);
router.use('/auth', authRoutes);

export default router;
