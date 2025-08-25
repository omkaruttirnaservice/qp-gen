import { Sequelize } from 'sequelize';
import aouth from '../schemas/aouth.js';
import tn_student_list from '../schemas/tn_student_list.js';
import ApiError from '../utils/ApiError.js';
import tn_center_list from '../schemas/tn_center_list.js';
import tm_server_ip_list from '../schemas/tm_server_ip_list.js';
import tm_student_question_paper from '../schemas/tm_student_question_paper.js';
import tm_publish_test_list from '../schemas/tm_publish_test_list.js';
import tm_test_question_sets from '../schemas/tm_test_question_sets.js';
import db from '../config/db.connect.js';
import sequelize from '../config/db-connect-migration.js';

const studentAreaModel = {
    getServerIP: async () => {
        return tm_server_ip_list.findAll({ raw: true });
    },
    addFormFillingIP: ({ form_filling_server_ip, exam_panel_server_ip }) => {
        return tm_server_ip_list.create({
            form_filling_server_ip,
            exam_panel_server_ip,
        });
    },
    updateFormFillingIP: ({ form_filling_server_ip, exam_panel_server_ip }, id) => {
        return tm_server_ip_list.update(
            {
                form_filling_server_ip,
                exam_panel_server_ip,
            },
            {
                where: {
                    id: id,
                },
            }
        );
    },

    deleteFormFillingIP: (id) => {
        return tm_server_ip_list.destroy({
            where: {
                id: id,
            },
        });
    },

    saveAllStudentsList: (_data, transact) => {
        try {
            return tn_student_list.bulkCreate(_data, { transaction: transact });
        } catch (error) {
            throw new ApiError(500, error?.message || 'Something went wrong');
        }
    },

    getAllStudentsList_2: () => {
        try {
            return tn_student_list.findAll(
                {
                    attributes: [
                        'id',
                        'sl_f_name',
                        'sl_m_name',
                        'sl_l_name',
                        'sl_image',
                        'sl_sign',
                        'sl_email',
                        'sl_father_name',
                        'sl_mother_name',
                        'sl_address',
                        'sl_mobile_number_parents',
                        'sl_tenth_marks',
                        'sl_contact_number',
                        'sl_class',
                        'sl_roll_number',
                        'sl_subject',
                        'sl_stream',
                        'sl_addmit_type',
                        'sl_time',
                        'sl_date',
                        'sl_time_stamp',
                        'sl_added_by_login_id',
                        'sl_is_live',
                        [
                            Sequelize.fn(
                                'DATE_FORMAT',
                                Sequelize.col('sl_date_of_birth'),
                                '%d-%m-%Y'
                            ),
                            'sl_date_of_birth',
                        ],
                        'sl_school_name',
                        'sl_catagory',
                        'sl_application_number',
                        'sl_is_physical_handicap',
                        'sl_is_physical_handicap_desc',
                        'sl_post',
                        'sl_center_code',
                        'sl_batch_no',
                        'sl_exam_date',
                        'sl_password',
                    ],
                },
                { raw: true }
            );
        } catch (error) {
            throw new ApiError(500, error?.message || 'Something went wrong');
        }
    },

    getAllStudentsList_v2: async (data) => {
        try {
            const { limit, page, offset, searchTerm, searchType, ...rest } = data;
            let returnData = {};

            // Build WHERE clauses
            let whereClauses = [];

            if (searchTerm) {
                if (searchType === 'roll_no') {
                    whereClauses.push(`sl_roll_number LIKE '%${searchTerm}%'`);
                }
                if (searchType === 'name') {
                    whereClauses.push(`
						(
                    sl_f_name LIKE '%${searchTerm}%' OR
                    sl_m_name LIKE '%${searchTerm}%' OR
                    sl_l_name LIKE '%${searchTerm}%'
						)
                `);
                }
            }

            // Additional filters
            if (rest.postName) whereClauses.push(`sl_post = '${rest.postName}'`);
            if (rest.examDate)
                whereClauses.push(`DATE_FORMAT(sl_exam_date,'%d-%m-%Y') = '${rest.examDate}'`);
            if (rest.batch) whereClauses.push(`sl_batch_no = '${rest.batch}'`);

            // Combine all WHERE clauses
            const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
            let candidateListQuery = `SELECT 
			sl.*,
			DATE_FORMAT(sl_date_of_birth, '%d-%m-%Y') as sl_date_of_birth
			FROM 
			tn_student_list sl
			${where}
			ORDER BY sl_roll_number
			LIMIT  ${limit} OFFSET ${offset}
			`;
            console.log(candidateListQuery);

            const [candidateList] = await sequelize.query(candidateListQuery);
            returnData['candidateList'] = candidateList?.length > 0 ? candidateList : [];

            let paginationDataQuery = `SELECT
            JSON_OBJECT (
            'pagination', JSON_OBJECT(
					'total_rows', COUNT(*),
					'page', ${page},
					'limit', ${limit},
					'total_pages', CEIL(COUNT(*) / ${limit})
					)
            ) as pagination
            FROM
            tn_student_list sl
			${where}
            `;
            const [pagination] = await sequelize.query(paginationDataQuery);
            returnData['pagination'] = pagination[0].pagination.pagination;

            return returnData;
        } catch (error) {
            throw new ApiError(500, error?.message || 'Something went wrong');
        }
    },

    getStudentsListPageFilters: async () => {
        let q = ` SELECT 
				JSON_OBJECT(
					'post',GROUP_CONCAT(DISTINCT(sl_post)),
					'exam_date',GROUP_CONCAT(DISTINCT(DATE_FORMAT(sl_exam_date, '%d-%m-%Y'))),
					'batch',GROUP_CONCAT(DISTINCT sl_batch_no),
					'center',GROUP_CONCAT(DISTINCT cl_name)
				) AS filters

				FROM utr_question_paper.tn_student_list sl

				INNER JOIN tn_center_list cl
				ON sl.sl_center_code = cl.cl_number `;

        const [filters] = await sequelize.query(q);
        return filters;
    },

    getStudentsListByFilter: async (data) => {
        try {
            let _result = await tn_student_list.findAll({
                attributes: [
                    'id',
                    'sl_f_name',
                    'sl_m_name',
                    'sl_l_name',
                    'sl_image',
                    'sl_sign',
                    'sl_email',
                    'sl_father_name',
                    'sl_mother_name',
                    'sl_address',
                    'sl_mobile_number_parents',
                    'sl_tenth_marks',
                    'sl_contact_number',
                    'sl_class',
                    'sl_roll_number',
                    'sl_subject',
                    'sl_stream',
                    'sl_addmit_type',
                    'sl_time',
                    'sl_date',
                    'sl_time_stamp',
                    'sl_added_by_login_id',
                    'sl_is_live',
                    [
                        Sequelize.fn('DATE_FORMAT', Sequelize.col('sl_date_of_birth'), '%d-%m-%Y'),
                        'sl_date_of_birth',
                    ],
                    'sl_school_name',
                    'sl_catagory',
                    'sl_application_number',
                    'sl_is_physical_handicap',
                    'sl_is_physical_handicap_desc',
                    'sl_post',
                    'sl_center_code',
                    'sl_batch_no',
                    'sl_exam_date',
                    'sl_password',
                ],
                where: {
                    sl_center_code: data.centerNumber,
                    sl_batch_no: data.batchNumber,
                    sl_exam_date: data.date,
                },
                raw: true,
            });
            return _result;
        } catch (error) {
            console.log(error, '==error==');
            throw new ApiError(500, error || 'Something went wrong');
        }
    },

    deleteCentersListOld: () => {
        try {
            return tn_center_list.destroy({
                truncate: true,
            });
        } catch (error) {
            throw new ApiError(500, error || 'Something went wrong');
        }
    },

    saveCentersList: (centersList) => {
        try {
            return tn_center_list.bulkCreate(centersList);
        } catch (error) {
            throw new ApiError(500, error?.message || 'Something went wrong');
        }
    },

    getCentersList: async () => {
        try {
            const result = await tn_center_list.findAll({
                group: ['cl_number'],
                raw: true,
            });
            return result;
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    },

    getBatchList: async () => {
        try {
            const results = await tn_student_list.findAll({
                attributes: ['sl_batch_no'],
                group: ['sl_batch_no'],
                order: [['sl_batch_no', 'ASC']],
                raw: true,
            });

            return results;
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    },
    getPostsList: async () => {
        try {
            const _results = await tn_student_list.findAll({
                attributes: ['sl_post'],
                group: ['sl_post'],
                raw: true,
            });
            return _results;
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    },

    // save downlaoded students question paper from exam panel
    saveStudentQuestionPaper: async (questionPapers) => {
        try {
            const result = tm_student_question_paper.bulkCreate(questionPapers);
            return result;
        } catch (error) {
            throw new ApiError(500, error?.message || 'Server errror.');
        }
    },

    // get individual published test details
    getPublishedTestById: async (id) => {
        try {
            const result = tm_publish_test_list.findAll({
                where: {
                    id,
                },
                raw: true,
                limit: 1,
            });
            return result;
        } catch (error) {
            throw new ApiError(500, error?.message || 'Server errror.');
        }
    },

    // get individual question paper by published test id
    getQuestionPaperByPublishedTestId: async (test_id) => {
        try {
            const result = tm_test_question_sets.findAll({
                where: {
                    tqs_test_id: test_id,
                },
                raw: true,
            });

            return result;
        } catch (error) {
            throw new ApiError(500, error?.message || 'Server errror.');
        }
    },
};

export default studentAreaModel;
