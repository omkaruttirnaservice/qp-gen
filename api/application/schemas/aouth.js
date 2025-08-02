import { DATE, ENUM, INTEGER, Sequelize, STRING } from 'sequelize';
import { ROLES } from '../config/constants.js';
import sequelize from '../config/db-connect-migration.js';

const aouth = sequelize.define('aouth', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    a_master_name: {
        type: STRING(255),
    },

    a_master_password: {
        type: STRING(40),
    },

    a_username: {
        type: STRING(40),
        defaultValue: '-',
    },

    a_role: {
        type: ENUM(ROLES.ADMIN, ROLES.USER),
        defaultValue: ROLES.USER,
    },

    a_form_filling_ip: {
        type: STRING(1024),
    },
    exam_server_ip: {
        type: STRING(1024),
    },

    createdAt: {
        type: DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
});

export default aouth;
