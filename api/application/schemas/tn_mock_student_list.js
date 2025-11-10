import sequelize from '../config/db-connect-migration.js';
import { studentTableColumns } from './studentTableColumns.js';

const tn_mock_student_list = sequelize.define(
    'tn_mock_student_list',
    studentTableColumns,
    {
        tableName: 'tn_mock_student_list',
        timestamps: false,
    }
);

export default tn_mock_student_list;
