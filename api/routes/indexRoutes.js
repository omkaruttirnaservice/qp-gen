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

router.use('/topic', topicRouter);
router.use('/subject', subjectRouter);

router.use('/questions', questionRoutes);
router.use('/test', testsRouter);

router.use('/posts', postsRoutes);

router.use('/students-area', studentsAreaRouter);
router.use('/reports', reportsRouter);
router.use('/exams', saveExamsRouter);

router.use('/remote', remoteRouter);
router.use('/auth', authRoutes);

export default router;
