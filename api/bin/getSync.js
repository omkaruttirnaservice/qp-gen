import sequelize from '../application/config/db-connect-migration.js';
// import tm_master_test_list from '../application/schemas/tm_master_test_list.js';
// import tm_mega_question_set from '../application/schemas/tm_mega_question_set.js';
// import tm_main_topic_list from '../application/schemas/tm_main_topic_list.js';
// import tm_sub_topic_list from '../application/schemas/tm_sub_topic_list.js';

// import tm_test_user_master_list from '../application/schemas/tm_test_user_master_list.js';
// import tm_test_question_sets from '../application/schemas/tm_test_question_sets.js';

// import tm_publish_test_list from '../application/schemas/tm_publish_test_list.js';

// import tm_exam_to_question from '../application/schemas/tm_exam_to_question.js';
// import tn_student_list from '../application/schemas/tn_student_list.js';
// import tn_center_list from '../application/schemas/tn_center_list.js';
// import aouth from '../application/schemas/aouth.js';

// import tm_student_test_list from '../application/schemas/tm_student_test_list.js';
// import tm_student_question_paper from '../application/schemas/tm_student_question_paper.js';
// import tm_student_final_result_set from '../application/schemas/tm_student_final_result_set.js';
// import tm_server_ip_list from '../application/schemas/tm_server_ip_list.js';
// import tm_publish_test_by_post from '../application/schemas/tm_publish_test_by_post.js';
// import mock_exam_report from '../application/schemas/mock_exam_report.js';

import fs from 'fs';
import path from 'path';

let models = await requireModels();

const getSync = (...args) => {
    sequelize
        .sync({ args })
        .then(() => {
            console.log(
                '"\x1b[47m", \x1b[30m%s\x1b[0m',
                'Database has been migrated successfully, you can now start the server.',
            );
        })
        .catch((error) => console.log(error));
};

export function requireModels() {
    return new Promise(async (resolve, reject) => {
        let _models = {};
        const baseModelPath = path.resolve(process.cwd(), 'application', 'schemas');
        // read all models
        let files = fs.readdirSync(baseModelPath).filter((file) => {
            return file.endsWith('.js');
        });

        for (let file of files) {
            const model = await import(path.join(baseModelPath, file));
            const modelName = path.basename(file, '.js');
            _models[modelName] = model;
        }

        resolve(_models);
    });
}

export default getSync;
