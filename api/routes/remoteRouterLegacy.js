import { Router } from 'express';
import remoteControllerLegacy from '../application/controllers/remoteControllerLegacy/remoteControllerLegacy.js';
import fileUpload from 'express-fileupload';
const remoteRouterLegacy = Router();

/**
 * This is the legacy remote router for handling exam-related requests.
 * This will handle requests from old exam panel made by Deepakkumar Sir
 * API's are getting exam list, downloading exam for the particular published test id, and downloading student batch wise.
 */

remoteRouterLegacy.post('/getNewExamList', remoteControllerLegacy.getTodaysExamList);
remoteRouterLegacy.get('/DownloadExam/:ptId', remoteControllerLegacy.downloadExam);

remoteRouterLegacy.get('/DownloadStudentBatch/:cc/:batch', remoteControllerLegacy.downloadStudent);

/**
 * This will save the answers given by the student in the exam
 * It will be called from the exam panel
 */
remoteRouterLegacy.post('/saveUploadedExam', remoteControllerLegacy.saveExamData);

export default remoteRouterLegacy;
