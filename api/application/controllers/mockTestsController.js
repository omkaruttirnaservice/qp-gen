import { myDate } from '../config/utils.js';
import mockTestsModel from '../model/mockTestsModel.js';
import mock_exam_report from '../schemas/mock_exam_report.js';
import { sendError, sendSuccess } from '../utils/commonFunctions.js';

const mockTestsController = {
    createMock: async (req, res, next) => {
        try {
            /**
			 * Sample req.body
			 * {
                    center_code: '101',
                    examDate: '2025-06-20',
                    mockName: 'mock-test',
                    totalQuestions: '13',
                    marksPerQuestion: '12',
                    duration: '12',
                    candidates: '21',
                    defaultPassword: '12'
                }
			 */
            const data = req.body;

            let testData = {
                mt_name: data.mockName,
                batch_no: 1,
                center_code: data.center_code,

                total_marks: data.marksPerQuestion * data.totalQuestions,
                test_duration: data.duration,
                marks_per_question: data.marksPerQuestion,
                total_questions: data.totalQuestions,
                total_candidates: data.candidates,
                start_roll_number: 1,

                exam_date: data.examDate,
                exam_time: myDate.getTime(),
                exam_date_time: '-',
                default_password: data.defaultPassword,
                post_id: '1',
                post_name: 'DUMMY POST',
                test_mode: 'MOCK',
            };

            // check if mock test exsists with same center_code, exam_date
            const [duplicateTest] = await mockTestsModel.checkForDuplicateTest(testData);

            if (duplicateTest.length > 0) {
                console.log(
                    `Info: test already available with Date:${testData.exam_date} and Center:${testData.center_code}`
                );
                console.log('Info: removing the old test data');
                await mockTestsModel.removeDuplicateTestData(duplicateTest[0]);
                console.log('Info: finish removing old test data');
            }

            // publish new mock test
            const _publishTestResp = await mockTestsModel.publishMockTest(testData);

            testData.published_test_id = _publishTestResp.id;

            // publish test by post
            await mockTestsModel.publishTestByPost(testData);

            // get last insert roll number of studetns
            const [lastRollNumber] = await mockTestsModel.getLastInsertRollNumber();
            if (lastRollNumber.length > 0) {
                testData.start_roll_number = lastRollNumber[0].id + 1;
            } else {
                testData.start_roll_number = 1001;
            }

            // generate dummy students
            const [_generateStudentResp] = await mockTestsModel.generateMockStudents(testData);

            // generate questions
            await mockTestsModel.generateMockquestions(testData);

            return sendSuccess(res, null, 'Successfully created mock test');
        } catch (error) {
            console.log(error, '-error');
            return sendError(res, error.message);
        }
    },

    saveMockReport: async (req, res, next) => {
        try {
            const { studentsList } = req.body;

            await mock_exam_report.bulkCreate(studentsList);
            return sendSuccess(res, '', 'Sucessfully saved mock exam report');
        } catch (error) {
            console.log(error, '==error');
            return sendError(res, error.message);
        }
    },

    getMockTestReport: async (req, res, next) => {
        try {
            const { ptid } = req.query;

            if (!ptid) {
                throw new Error('Invalid published test id');
            }

            const testDetails = await mockTestsModel.getPublishedTestById(ptid);
            if (testDetails.length === 0) {
                throw new Error('No test details found');
            }
            const mockReport = await mockTestsModel.getMockExamReport(testDetails);
            return sendSuccess(res, mockReport, '');
        } catch (error) {
            return sendError(res, error.message);
        }
    },
};

export default mockTestsController;
