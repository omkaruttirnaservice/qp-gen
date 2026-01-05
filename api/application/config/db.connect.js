import mysql from 'mysql2';
import dotenv from 'dotenv';
import { AsyncLocalStorage } from 'async_hooks';
import { databaseCredentialsMap } from '../../databasesList.js';
dotenv.config();

const __poolsMap = new Map();

import Sequelize from 'sequelize';

export async function getPool(dbId, dbName) {
    if (!dbName || !dbName) return undefined;

    if (!databaseCredentialsMap[dbId]) {
        throw new Error(`Unknown DB id: ${dbId}`);
    }

    const poolKey = `${dbId}:${dbName}`;
    console.log(poolKey, 'poolKey');
    console.log(__poolsMap, '__poolsMap');

    if (__poolsMap.has(poolKey)) {
        const cached = __poolsMap.get(poolKey);
        return cached;
    }

    const cfg = databaseCredentialsMap[dbId];
    const pool = mysql.createPool({
        host: cfg.DB_HOST,
        user: cfg.DB_USER,
        password: cfg.DB_PASSWORD,
        database: dbName,
        port: cfg.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: cfg.connectionLimit ?? 10,
        queueLimit: 0,
    });

    // Create Sequelize instance for this specific DB
    const sequelizeInstance = new Sequelize(dbName, cfg.DB_USER, cfg.DB_PASSWORD, {
        host: cfg.DB_HOST,
        dialect: 'mysql',
        logging: true,
        define: {
            freezeTableName: true,
            charset: 'utf8mb4',
            dialectOptions: {
                collate: 'utf8mb4_0900_ai_ci',
            },
            timestamps: true,
        },
        timezone: '+05:30',
    });

    console.log(sequelizeInstance, '============sequelizeInstance=============');
    try {
        await sequelizeInstance.authenticate();
        console.log('Sequelize authenticate() success');
    } catch (error) {
        console.log('Sequelize authenticate() error');
        console.log(error, 'authenticate()=error');
    }

    const result = { pool, poolPromise: pool.promise(), sequelizeInstance };
    // const result = { sequelizeInstance };
    __poolsMap.set(poolKey, result);

    return result;
}

// async function useDb(pool, dbName) {
//     await pool.promise().query(`USE ${dbName}`);
// }

export const dbStore = new AsyncLocalStorage();
const dbProxy = new Proxy(
    {},
    {
        get(target, prop) {
            const store = dbStore.getStore();
            console.log(store,'-store')
            if (store && store.pool) {
                return Reflect.get(store.pool, prop);
            }
            throw new Error('No database connection available. Please login to select a database.');
        },
    }
);

export default dbProxy;
