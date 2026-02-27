import sequelize from '../config/db-connect-migration.js';
import { studentListTableStructure } from './tn_student_list_mock.js';

const tn_student_list = sequelize.define('tn_student_list', studentListTableStructure, {
    tableName: 'tn_student_list',
    timestamps: false,
});

export default tn_student_list;
