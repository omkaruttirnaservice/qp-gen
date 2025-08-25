import express from 'express';
import subjectController from '../application/controllers/subjectController.js';
const topicRouter = express.Router();

topicRouter.post('/get-topic-list', subjectController.getTopicList);

topicRouter.post(
    '/get-topic-list-and-question-count',
    subjectController.getTopicListAndQuestionCount
);

topicRouter.post('/add-topic', subjectController.addTopic);

export default topicRouter;
