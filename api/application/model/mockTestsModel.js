import { Sequelize } from 'sequelize';
import sequelize from '../config/db-connect-migration.js';
import db from '../config/db.connect.js';
import mockDummyData from '../config/mockDummyData.js';
import tm_publish_test_by_post from '../schemas/tm_publish_test_by_post.js';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';
import tm_test_question_sets from '../schemas/tm_test_question_sets.js';
import tn_mock_student_list from '../schemas/tn_mock_student_list.js';

const mockTestsModel = {
    // tests key
    checkForDuplicateTestKey: (testKey) => {
        return tm_publish_test_list.findAll({
            where: {
                ptl_link_1: testKey,
            },
            raw: true,
            limit: 1,
        });
    },

    publishMockTest: async (testData) => {
        let d = mockDummyData.testDetails(testData);

        return await tm_publish_test_list.create({
            ptl_active_date: d.ptl_active_date,
            ptl_time: d.ptl_time,
            ptl_link: d.ptl_link,
            ptl_link_1: d.ptl_link_1,
            ptl_test_id: d.ptl_test_id,
            ptl_master_exam_id: d.ptl_master_exam_id,
            ptl_master_exam_name: d.ptl_master_exam_name,
            ptl_added_date: d.ptl_added_date,
            ptl_added_time: d.ptl_added_time,
            ptl_time_stamp: d.ptl_time_stamp,
            ptl_test_description: d.ptl_test_description,
            ptl_is_live: d.ptl_is_live,
            ptl_aouth_id: d.ptl_aouth_id,
            ptl_is_test_done: d.ptl_is_test_done,
            ptl_test_info: JSON.stringify({}),
            mt_name: d.mt_name,
            mt_added_date: d.mt_added_date,
            mt_descp: d.mt_descp,
            mt_is_live: d.mt_is_live,
            mt_time_stamp: d.mt_time_stamp,
            mt_type: d.mt_type,
            tm_aouth_id: d.tm_aouth_id,
            mt_test_time: d.mt_test_time,
            mt_total_test_takan: d.mt_total_test_takan,
            mt_is_negative: d.mt_is_negative,
            mt_negativ_mark: d.mt_negativ_mark,
            mt_mark_per_question: d.mt_mark_per_question,
            mt_passing_out_of: d.mt_passing_out_of,
            mt_total_marks: d.mt_total_marks,
            mt_pattern_type: d.mt_pattern_type,
            mt_total_test_question: d.mt_total_test_question,
            mt_added_time: d.mt_added_time,
            mt_pattern_name: d.mt_pattern_name,
            is_test_generated: d.is_test_generated,
            ptl_test_mode: d.ptl_test_mode,

            center_code: d.center_code,
            tm_allow_to: d.tm_allow_to,
            is_test_loaded: d.is_test_loaded,
            is_student_added: d.is_student_added,
            is_uploaded: d.is_uploaded,
            is_start_exam: d.is_start_exam,
            is_absent_mark: d.is_absent_mark,
            is_exam_downloaded: d.is_exam_downloaded,
            is_photos_downloaded: d.is_photos_downloaded,
            is_sign_downloaded: d.is_sign_downloaded,
            is_final_published: d.is_final_published,
            is_students_downloaded: d.is_students_downloaded,
            is_attendance_started: 0,
        });
    },

    publishTestByPost: async (testData) => {
        return await tm_publish_test_by_post.create({
            post_id: 1,
            post_name: testData.post_name,
            published_test_id: testData.published_test_id,
        });
    },

    checkForDuplicateTest: async function (testData) {
        const q = `SELECT 
            *,
            DATE_FORMAT(ptl_active_date,'%Y-%m-%d') AS ptl_active_date

            FROM tm_publish_test_list
            WHERE center_code = ${testData.center_code}
            AND ptl_active_date = '${testData.exam_date}'
            AND ptl_test_mode = 'MOCK'

            LIMIT 1
        `;
        return await db.query(q);
    },

    getPublishedTestById: async function (ptid) {
        return await tm_publish_test_list.findOne({ where: { id: ptid }, raw: true });
    },

    removeDuplicateTestData: async function (duplicateTestDetails) {
        try {
            const q = `DELETE FROM tm_publish_test_list WHERE id = ${duplicateTestDetails.id}`;
            const q2 = `DELETE FROM tm_publish_test_by_post WHERE published_test_id = ${duplicateTestDetails.id} AND id >= 1`;

            const q3 = `DELETE FROM tn_mock_student_list 
                        WHERE sl_center_code = ${duplicateTestDetails.center_code} 
                        AND sl_batch_no = ${duplicateTestDetails.tm_allow_to}
                        AND sl_exam_date = '${duplicateTestDetails.ptl_active_date}'
                        AND id >= 1`;
            const q4 = `DELETE FROM tm_test_question_sets
                        WHERE tqs_test_id = ${duplicateTestDetails.ptl_test_id}
                        AND id >= 1`;
            await db.query(q);
            await db.query(q2);
            await db.query(q3);
            await db.query(q4);
        } catch (error) {
            console.log(error, '=error');
        }
    },

    getLastInsertRollNumber: async () => {
        const q = `SELECT id FROM tn_mock_student_list ORDER BY id DESC LIMIT 1;`;
        return await db.query(q);
    },

    generateMockStudents: async (testData) => {
        let students = mockDummyData.studentDummyData(testData);

        return await tn_mock_student_list.bulkCreate(students);
    },

    generateMockquestions: async (testData) => {
        const questions = mockDummyData.getDummyQuestion(testData);

        return await tm_test_question_sets.bulkCreate(questions);
    },

    getMockExamReport: async (testDetails) => {
        const q = `SELECT 
                        mac_id,
                        stm_min,
                        stm_sec,
                        stl_test_status,
                        stl_publish_id,
                        CONCAT(sl_f_name,' ',sl_m_name,' ',sl_l_name) AS full_name,
                        ptl.id AS published_test_id
                    FROM tn_mock_student_list AS sl

                    LEFT JOIN mock_exam_report AS mer
                    ON sl.id =  mer.stl_stud_id

                    LEFT JOIN tm_publish_test_list AS ptl
                    ON ptl.id = mer.stl_publish_id AND ptl.id = ${Number(testDetails.id)} 

                    WHERE sl.sl_exam_date = '${testDetails.ptl_active_date}'
                    AND sl.sl_center_code = ${testDetails.center_code}`;
        return sequelize.query(q, {
            type: Sequelize.QueryTypes.SELECT,
        });
    },
};

export default mockTestsModel;
