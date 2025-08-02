import db from '../config/db.connect.js';

const authModel = {
    checkUserCredentials: async (username, password) => {
        const sql = `SELECT 
        id AS userId, 
        a_username AS username,
        a_role AS role
        FROM aouth WHERE a_master_name = ? AND a_master_password = ?`;
        return await db.query(sql, [username, password]);
    },
};

export default authModel;
