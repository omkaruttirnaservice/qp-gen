const DEV_DB_SERVER_1 = 'DEV_DB_SERVER_1';
const KOP_DB_SERVER_2 = 'KOP_DB_SERVER_2';

export const databasesList = {
    production: [
        {
            dbName: 'qp_kbt_exam_04_02_2026',
            processName: 'KBT Exam 2',
            isShow: true,
            dbServerId: KOP_DB_SERVER_2,
        },

        {
            dbName: 'utr_question_paper_amalner_mock',
            processName: 'APMC_Amalner_Mock',
            isShow: true,
            dbServerId: KOP_DB_SERVER_2,
        },

        {
            dbName: 'utr_question_paper_amalner',
            processName: 'APMC_Amalner',
            isShow: true,
            dbServerId: KOP_DB_SERVER_2,
        },

        {
            dbName: 'utr_question_paper_uttirna',
            processName: 'Uttirna Data Entry',
            isShow: true,
            dbServerId: KOP_DB_SERVER_2,
        },
    ],

    developement: [
        {
            dbName: '_debug_utr_question_paper_uttirna',
            processName: 'Debug Uttirna Data Entry (Dev)',
            isShow: true,
            dbServerId: DEV_DB_SERVER_1,
        },

        {
            dbName: 'utr_question_paper_uttirna',
            processName: 'Uttirna Data Entry (Prod)',
            isShow: true,
            dbServerId: KOP_DB_SERVER_2,
        },
    ],
};

export const databaseCredentialsMap = {
    DEV_DB_SERVER_1: {
        DB_HOST: '134.209.154.181',
        DB_USER: 'devUser',
        DB_PASSWORD: '000@devUser@#',
        DB_PORT: 3306,
    },

    KOP_DB_SERVER_2: {
        DB_HOST: '143.110.183.61',
        DB_USER: 'mainUser',
        DB_PASSWORD: '000@mainUser@#',
        DB_PORT: 3306,
    },
};
