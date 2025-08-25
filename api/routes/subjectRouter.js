import express from 'express';
import subjectController from '../application/controllers/subjectController.js';
const subjectRouter = express.Router();

subjectRouter.post('/list', subjectController.getSubjectList);
subjectRouter.post('/add', subjectController.addSubject);

export default subjectRouter;
